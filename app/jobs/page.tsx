import { createClient } from "@/lib/supabase/server";
import { PublicJobList } from "@/features/jobs/components/public-job-list";

export default async function PublicJobsPage() {
  const supabase = await createClient();

  const { data: jobs, error } = await supabase
    .from("job_post")
    .select(
      `
      *,
      company:company_id(*)
    `
    )
    .is("deleted_at", null)
    .is("closed_at", null)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch jobs:", error);
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error loading jobs</h1>
          <p className="text-muted-foreground">Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Find Your Next Job
        </h1>
        <p className="text-lg text-muted-foreground">
          Browse open positions from top companies
        </p>
      </div>
      <PublicJobList jobs={jobs || []} />
    </div>
  );
}
