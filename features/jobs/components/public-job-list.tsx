"use client";

import { useState } from "react";
import { PublicJobCard } from "./public-job-card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Briefcase } from "lucide-react";
import { Tables } from "@/lib/supabase/types";

interface Company {
  name: string;
  website: string | null;
  description: string | null;
}

interface PublicJobListProps {
  jobs: (Tables<"job_post"> & { company: Tables<"company"> })[];
}

export function PublicJobList({ jobs }: PublicJobListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJobType, setSelectedJobType] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  const uniqueJobTypes = [...new Set(jobs.map((job) => job.job_type))];
  const uniqueLocations = [
    ...new Set(jobs.map((job) => job.location).filter(Boolean)),
  ];

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.display_name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesJobType = !selectedJobType || job.job_type === selectedJobType;
    const matchesLocation =
      !selectedLocation || job.location === selectedLocation;

    return matchesSearch && matchesJobType && matchesLocation;
  });

  const formatJobType = (jobType: string) => {
    switch (jobType) {
      case "FULL_TIME":
        return "Full Time";
      case "PART_TIME":
        return "Part Time";
      case "CONTRACT":
        return "Contract";
      default:
        return jobType;
    }
  };

  const clearFilters = () => {
    setSelectedJobType(null);
    setSelectedLocation(null);
    setSearchTerm("");
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-card border rounded-lg p-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search jobs, companies, or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Job Type:</span>
            {uniqueJobTypes.map((type) => (
              <Badge
                key={type}
                variant={selectedJobType === type ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() =>
                  setSelectedJobType(selectedJobType === type ? null : type)
                }
              >
                {formatJobType(type || "")}
              </Badge>
            ))}
          </div>
        </div>

        {uniqueLocations.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Location:</span>
              {uniqueLocations.map((location) => (
                <Badge
                  key={location}
                  variant={
                    selectedLocation === location ? "default" : "outline"
                  }
                  className="cursor-pointer"
                  onClick={() =>
                    setSelectedLocation(
                      selectedLocation === location ? null : location
                    )
                  }
                >
                  {location}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {(selectedJobType || selectedLocation || searchTerm) && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {filteredJobs.length} of {jobs.length} jobs
            </p>
            <Button variant="ghost" onClick={clearFilters} size="sm">
              Clear filters
            </Button>
          </div>
        )}
      </div>

      {/* Job List */}
      {filteredJobs.length === 0 ? (
        <div className="text-center py-12">
          <Briefcase className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
          <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
          <p className="text-muted-foreground">
            {searchTerm || selectedJobType || selectedLocation
              ? "Try adjusting your search or filters"
              : "No jobs are currently available"}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredJobs.map((job) => (
            <PublicJobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}
