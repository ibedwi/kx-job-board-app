"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Briefcase, X } from "lucide-react";

interface JobFiltersProps {
  uniqueJobTypes: (string | null)[];
  uniqueLocations: (string | null)[];
  currentFilters: {
    search: string;
    job_type: string;
    location: string;
  };
}

export function JobFilters({
  uniqueJobTypes,
  uniqueLocations,
  currentFilters,
}: JobFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [searchInput, setSearchInput] = useState(currentFilters.search);

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

  const updateURL = (params: Record<string, string | null>) => {
    const newSearchParams = new URLSearchParams(searchParams);

    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newSearchParams.set(key, value);
      } else {
        newSearchParams.delete(key);
      }
    });

    startTransition(() => {
      router.push(`/jobs?${newSearchParams.toString()}`);
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateURL({ search: searchInput });
  };

  const handleJobTypeClick = (jobType: string) => {
    const newJobType = currentFilters.job_type === jobType ? null : jobType;
    updateURL({ job_type: newJobType });
  };

  const handleLocationClick = (location: string) => {
    const newLocation = currentFilters.location === location ? null : location;
    updateURL({ location: newLocation });
  };

  const clearFilters = () => {
    setSearchInput("");
    startTransition(() => {
      router.push("/jobs");
    });
  };

  const hasActiveFilters =
    currentFilters.search || currentFilters.job_type || currentFilters.location;

  return (
    <div className="bg-card border rounded-lg p-6 flex flex-col gap-2">
      {/* Search Form */}
      <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
        <Input
          placeholder="Search jobs, companies, or keywords..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="pl-10 pr-20"
        />
        {searchInput && (
          <Button type="submit" size="sm" className="h-8" disabled={isPending}>
            Search
          </Button>
        )}
      </form>

      {/* Active Search Filter */}
      {currentFilters.search && (
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Search:</span>
          <Badge variant="default" className="gap-1">
            {currentFilters.search}
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 hover:bg-transparent"
              onClick={() => {
                setSearchInput("");
                updateURL({ search: null });
              }}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        </div>
      )}

      {/* Job Type Filters */}
      <div className="flex flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Briefcase className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Job Type:</span>
          {uniqueJobTypes.map((type) => (
            <Badge
              key={type}
              variant={currentFilters.job_type === type ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handleJobTypeClick(type || "")}
            >
              {formatJobType(type || "")}
            </Badge>
          ))}
        </div>
      </div>

      {/* Location Filters */}
      {uniqueLocations.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Location:</span>
            {uniqueLocations.map((location) => (
              <Badge
                key={location}
                variant={
                  currentFilters.location === location ? "default" : "outline"
                }
                className="cursor-pointer"
                onClick={() => handleLocationClick(location || "")}
              >
                {location}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Clear Filters */}
      {hasActiveFilters && (
        <div className="flex items-center justify-end">
          <Button
            variant="ghost"
            onClick={clearFilters}
            size="sm"
            disabled={isPending}
          >
            Clear all filters
          </Button>
        </div>
      )}
    </div>
  );
}
