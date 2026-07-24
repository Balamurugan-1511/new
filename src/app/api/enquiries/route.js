import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request) {
  try {
    const { name, email, phone, course, preferredMode, message } = await request.json();

    const fullMessage = [
      course ? `Course: ${course}` : null,
      preferredMode ? `Preferred mode: ${preferredMode}` : null,
      message,
    ].filter(Boolean).join('\n');

    const enquiry = await prisma.enquiry.create({
      data: { name, email, phone, message: fullMessage },
    });

    return NextResponse.json({ success: true, id: enquiry.id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}