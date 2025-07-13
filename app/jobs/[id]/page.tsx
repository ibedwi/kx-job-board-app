import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { PublicJobDetail } from "@/features/jobs/components/public-job-detail";

interface JobDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: job, error } = await supabase
    .from("job_post")
    .select(
      `
      *,
      company:company_id(*)
    `
    )
    .eq("id", id)
    .is("deleted_at", null)
    .is("closed_at", null)
    .single();

  if (error || !job) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8">
      <PublicJobDetail job={job} />
    </div>
  );
}
