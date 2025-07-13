"use client";

import { PublicJobCard } from "./public-job-card";
import { JobFilters } from "./job-filters";
import { Briefcase } from "lucide-react";
import { Tables } from "@/lib/supabase/types";

interface PublicJobListProps {
  jobs: (Tables<"job_post"> & { company: Tables<"company"> })[];
  allJobs: (Tables<"job_post"> & { company: Tables<"company"> })[];
  currentFilters: {
    search: string;
    job_type: string;
    location: string;
  };
}

export function PublicJobList({ jobs, allJobs, currentFilters }: PublicJobListProps) {
  const uniqueJobTypes = [...new Set(allJobs.map((job) => job.job_type))];
  const uniqueLocations = [
    ...new Set(allJobs.map((job) => job.location).filter(Boolean)),
  ];

  const hasActiveFilters = currentFilters.search || currentFilters.job_type || currentFilters.location;

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <JobFilters
        uniqueJobTypes={uniqueJobTypes}
        uniqueLocations={uniqueLocations}
        currentFilters={currentFilters}
      />

      {/* Results summary */}
      {hasActiveFilters && (
        <div className="text-sm text-muted-foreground">
          Showing {jobs.length} of {allJobs.length} jobs
        </div>
      )}

      {/* Job List */}
      {jobs.length === 0 ? (
        <div className="text-center py-12">
          <Briefcase className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
          <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
          <p className="text-muted-foreground">
            {hasActiveFilters
              ? "Try adjusting your search or filters"
              : "No jobs are currently available"}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {jobs.map((job) => (
            <PublicJobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}
