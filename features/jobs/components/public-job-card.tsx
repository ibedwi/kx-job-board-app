"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, Building, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Tables } from "@/lib/supabase/types";

interface PublicJobCardProps {
  job: Tables<"job_post"> & { company: Tables<"company"> };
}

export function PublicJobCard({ job }: PublicJobCardProps) {
  const truncateDescription = (text: string, maxLength: number = 200) => {
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

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

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl font-semibold mb-2">
              <Link
                href={`/jobs/${job.id}`}
                className="hover:text-primary transition-colors text-lg font-semibold hover:underline"
              >
                {job.title}
              </Link>
            </CardTitle>
            <div className="flex items-center gap-4 mb-3 flex-wrap">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Building className="h-4 w-4" />
                <span className="font-medium">{job.company.display_name}</span>
              </div>
              {job.location && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {job.location}
                </div>
              )}
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-4 w-4" />
                {formatJobType(job.job_type || "")}
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {formatDate(job.created_at)}
              </div>
            </div>
            <CardDescription className="text-sm leading-relaxed">
              {truncateDescription(job.description)}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <Badge variant="secondary">{formatJobType(job.job_type || "")}</Badge>
          <Button asChild>
            <Link href={`/jobs/${job.id}`}>
              View Details
              <ExternalLink className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
