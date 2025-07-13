"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Calendar,
  MapPin,
  Clock,
  Building,
  ExternalLink,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { Tables } from "@/lib/supabase/types";

interface PublicJobDetailProps {
  job: Tables<"job_post"> & { company: Tables<"company"> };
}

export function PublicJobDetail({ job }: PublicJobDetailProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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

  const formatDescription = (description: string) => {
    return description.split("\n").map((paragraph, index) => (
      <p key={index} className="mb-4 last:mb-0">
        {paragraph}
      </p>
    ));
  };

  const onClickApply = () => {
    alert("This feature is not available yet");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Button */}
      <Button variant="ghost" asChild className="mb-4">
        <Link href="/jobs">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Jobs
        </Link>
      </Button>

      {/* Job Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardTitle className="text-3xl font-bold mb-4">
                {job.title}
              </CardTitle>

              <div className="flex items-center gap-6 flex-wrap">
                <div className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-muted-foreground" />
                  <span className="text-lg font-semibold">
                    {job.company.display_name}
                  </span>
                </div>

                {job.location && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-5 w-5" />
                    <span>{job.location}</span>
                  </div>
                )}

                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-5 w-5" />
                  <span>{formatJobType(job.job_type || "")}</span>
                </div>

                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-5 w-5" />
                  <span>Posted {formatDate(job.created_at)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Job Description */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Job Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                {formatDescription(job.description)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Company Info and Apply */}
        <div className="space-y-6">
          {/* Apply Section */}
          <Card>
            <CardHeader>
              <CardTitle>Apply for this position</CardTitle>
              <CardDescription>
                Interested in this role? Get in touch with the company.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full mb-4" size="lg" onClick={onClickApply}>
                Apply Now
                <ExternalLink className="h-4 w-4 ml-2" />
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                You'll be redirected to the company's application process
              </p>
            </CardContent>
          </Card>

          {/* Company Info */}
          <Card>
            <CardHeader>
              <CardTitle>About {job.company.display_name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {job.company.display_name}
              </p>
            </CardContent>
          </Card>

          {/* Job Details */}
          <Card>
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Job Type</span>
                <span className="text-sm text-muted-foreground">
                  {formatJobType(job.job_type || "")}
                </span>
              </div>

              {job.location && (
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Location</span>
                  <span className="text-sm text-muted-foreground">
                    {job.location}
                  </span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-sm font-medium">Posted</span>
                <span className="text-sm text-muted-foreground">
                  {formatDate(job.created_at)}
                </span>
              </div>

              {job.updated_at !== job.created_at && (
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Updated</span>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(job.updated_at)}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
