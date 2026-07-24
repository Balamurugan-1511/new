import { openPositions, getJobBySlug, slugify } from '@/lib/openPositions';
import ApplyForm from './ApplyForm';

export function generateStaticParams() {
  return openPositions?.map(job => ({ job: slugify(job?.title) }));
}

export function generateMetadata({ params }) {
  const job = getJobBySlug(params?.job);
  if (!job) return { title: 'Apply | SkandaPlus Careers' };
  return { title: `Apply – ${job?.title} | SkandaPlus Careers` };
}

export default function JobApplicationPage({ params }) {
  const job = getJobBySlug(params?.job);
  return <ApplyForm job={job} />;
}
