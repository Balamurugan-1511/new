import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/adminAuth';
import { sendMail } from '@/lib/mailer';

const ALLOWED_STATUSES = ['pending', 'half_paid', 'paid', 'rejected'];

// PATCH /api/enrollments/:id — admin only. This is the ONLY place an
// enrollment's payment_status can move to "paid" (or be rejected). The admin
// checks the UTR against the bank/GPay statement first, then confirms here.
// Every change is written to payment_status_logs as an audit trail — who
// changed it, what it changed from/to, and (for rejections) why.
export async function PATCH(request, { params }) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, message: 'Admin login required.' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const { payment_status, amount_paid, note, next_due_at } = await request.json();

    if (!ALLOWED_STATUSES.includes(payment_status)) {
      return NextResponse.json({ success: false, message: 'Invalid status.' }, { status: 400 });
    }

    const before = await prisma.enrollment.findUnique({ where: { id: Number(id) } });
    if (!before) {
      return NextResponse.json({ success: false, message: 'Enrollment not found.' }, { status: 404 });
    }

    const total = before.amount_total != null ? Number(before.amount_total) : null;

    // A rejected payment never carries a confirmed amount — force it to 0
    // regardless of whatever was left in the admin's amount input, so a
    // rejected row can never show money as received.
    let cleanAmountPaid;
    if (payment_status === 'rejected') {
      cleanAmountPaid = 0;
    } else {
      cleanAmountPaid = Number(amount_paid);
      if (!Number.isFinite(cleanAmountPaid) || cleanAmountPaid < 0) {
        return NextResponse.json({ success: false, message: 'Enter a valid amount paid.' }, { status: 400 });
      }
    }

    // Sanity guard rails so a mistyped amount can't silently land on the
    // wrong status (this is on top of the admin UI's auto-suggested status).
    if (total != null) {
      if (payment_status === 'half_paid') {
        if (cleanAmountPaid <= 0) {
          return NextResponse.json(
            { success: false, message: 'Half Paid needs an amount greater than 0. Use Pending if nothing has been paid yet.' },
            { status: 400 }
          );
        }
        if (cleanAmountPaid >= total) {
          return NextResponse.json(
            { success: false, message: `Amount paid (₹${cleanAmountPaid}) covers the full total (₹${total}) — use Paid instead of Half Paid.` },
            { status: 400 }
          );
        }
      }
    }

    let cleanNextDueAt = null;
    if (payment_status !== 'rejected' && next_due_at) {
      const parsed = new Date(next_due_at);
      if (Number.isNaN(parsed.getTime())) {
        return NextResponse.json({ success: false, message: 'Invalid due date.' }, { status: 400 });
      }
      cleanNextDueAt = parsed;
    }

    // Marking "paid" with a balance still owed is only valid as an
    // installment plan — require a due date so access can be auto-revoked
    // later if the student stops paying instead of silently staying unlocked
    // forever.
    if (payment_status === 'paid' && total != null && cleanAmountPaid < total && !cleanNextDueAt) {
      return NextResponse.json(
        {
          success: false,
          message: `Amount paid (₹${cleanAmountPaid}) is less than the total (₹${total}). If this is an installment plan, set a "next due date" so access auto-revokes if they stop paying — otherwise enter the full amount.`,
        },
        { status: 400 }
      );
    }

    const cleanNote = note ? String(note).trim().slice(0, 500) : null;

    // Update the enrollment and append its audit-trail row together, so we
    // never end up with a status change that has no corresponding history.
    const [enrollment] = await prisma.$transaction([
      prisma.enrollment.update({
        where: { id: Number(id) },
        data: {
          payment_status,
          amount_paid: cleanAmountPaid,
          verified_at: new Date(),
          next_due_at: cleanNextDueAt,
        },
        include: {
          user: { select: { id: true, name: true, email: true } },
          course: { select: { id: true, title: true, slug: true, price: true } },
        },
      }),
      prisma.paymentStatusLog.create({
        data: {
          enrollment_id: Number(id),
          admin_id: admin.id,
          admin_name: admin.name || admin.email,
          from_status: before.payment_status,
          to_status: payment_status,
          amount_paid: cleanAmountPaid,
          note: cleanNote,
        },
      }),
    ]);

    // Only email the student when the admin's action actually changes
    // something they'd care about (status, amount, or due date) — not on a
    // no-op save.
    const beforeDueAt = before.next_due_at ? new Date(before.next_due_at).getTime() : null;
    const afterDueAt = enrollment.next_due_at ? new Date(enrollment.next_due_at).getTime() : null;
    const changed =
      before.payment_status !== payment_status ||
      Number(before.amount_paid) !== cleanAmountPaid ||
      beforeDueAt !== afterDueAt;
    if (changed) {
      notifyStudentOfPaymentUpdate(enrollment, cleanNote).catch(err =>
        console.error('[enrollments] student notify failed:', err)
      );
    }

    return NextResponse.json({ success: true, enrollment });
  } catch (error) {
    console.error(error);
    if (error?.code === 'P2025') {
      return NextResponse.json({ success: false, message: 'Enrollment not found.' }, { status: 404 });
    }
    return NextResponse.json({ success: false, message: 'Something went wrong.' }, { status: 500 });
  }
}

// Emails the student as soon as an admin confirms, rejects, or otherwise
// updates their payment, so they don't have to keep refreshing their
// dashboard to find out.
async function notifyStudentOfPaymentUpdate(enrollment, note) {
  const email = enrollment.user?.email;
  if (!email) return;

  const courseTitle = enrollment.course?.title || 'your course';
  const total = enrollment.amount_total != null ? Number(enrollment.amount_total) : null;
  const paid = Number(enrollment.amount_paid || 0);

  let subject;
  let message;

  if (enrollment.payment_status === 'paid') {
    subject = `Payment confirmed — ${courseTitle}`;
    message = `<p>Your payment for <strong>${courseTitle}</strong> has been confirmed. The course is now unlocked in your dashboard.</p>`;
    if (enrollment.next_due_at) {
      const balance = total != null ? total - paid : null;
      const dueLabel = new Date(enrollment.next_due_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
      message += `<p>This is an installment plan${balance != null ? ` — ₹${balance} is still due` : ''} by <strong>${dueLabel}</strong>. If it isn't paid by then, access will be paused automatically.</p>`;
    }
  } else if (enrollment.payment_status === 'half_paid') {
    const balance = total != null ? total - paid : null;
    subject = `Partial payment received — ${courseTitle}`;
    message = `
      <p>We've recorded a payment of ₹${paid} for <strong>${courseTitle}</strong>${total != null ? ` (out of ₹${total} total)` : ''}.</p>
      ${balance != null ? `<p>Balance remaining: ₹${balance}. Pay the balance to unlock the course.</p>` : ''}
    `;
  } else if (enrollment.payment_status === 'rejected') {
    subject = `Payment could not be verified — ${courseTitle}`;
    message = `
      <p>We couldn't verify the payment you submitted for <strong>${courseTitle}</strong> against our bank/GPay statement, so it has been marked as rejected.</p>
      ${note ? `<p>Reason: ${note}</p>` : ''}
      <p>If you believe this is a mistake, or if you'd like to resubmit with a valid transaction reference, please contact support.</p>
    `;
  } else {
    subject = `Payment update — ${courseTitle}`;
    message = `<p>Your payment status for <strong>${courseTitle}</strong> has been updated to "${enrollment.payment_status}". Check your dashboard for details.</p>`;
  }

  await sendMail({ to: email, subject, html: message });
}
