import { createClient } from "@/lib/supabase/server";
import { PublicJobList } from "@/features/jobs/components/public-job-list";

interface PublicJobsPageProps {
  searchParams: Promise<{
    search?: string;
    job_type?: string;
    location?: string;
  }>;
}

export default async function PublicJobsPage({
  searchParams,
}: PublicJobsPageProps) {
  const { search, job_type, location } = await searchParams;
  const supabase = await createClient();

  // Build the query with filters
  let query = supabase
    .from("job_post")
    .select(
      `
      *,
      company:company_id(*)
    `
    )
    .is("deleted_at", null)
    .is("closed_at", null);

  // Apply search filter
  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
  }

  // Apply job type filter
  if (job_type) {
    query = query.eq(
      "job_type",
      job_type as "FULL_TIME" | "PART_TIME" | "CONTRACT"
    );
  }

  // Apply location filter
  if (location) {
    query = query.eq("location", location);
  }

  // Order by creation date
  query = query.order("created_at", { ascending: false });

  const { data: jobs, error } = await query;

  // Get all jobs for filter options (unfiltered)
  const { data: allJobs } = await supabase
    .from("job_post")
    .select(
      `
      *,
      company:company_id(*)
    `
    )
    .is("deleted_at", null)
    .is("closed_at", null);

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
      <PublicJobList
        jobs={jobs || []}
        allJobs={allJobs || []}
        currentFilters={{
          search: search || "",
          job_type: job_type || "",
          location: location || "",
        }}
      />
    </div>
  );
}
