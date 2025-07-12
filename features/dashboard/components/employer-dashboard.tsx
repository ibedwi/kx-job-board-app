"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Building,
  Plus,
  FileText,
  Settings,
  RefreshCw,
  MapPin,
  Clock,
} from "lucide-react";

interface User {
  id: string;
  name: string;
  created_at: string;
}

interface Company {
  id: string;
  display_name: string;
  created_at: string;
  company_owner: string;
}

interface JobStats {
  activeJobs: number;
  closedJobs: number;
  totalJobs: number;
  recentJobs: Array<{
    id: string;
    title: string;
    location: string | null;
    job_type: "FULL_TIME" | "PART_TIME" | "CONTRACT";
    created_at: string;
    closed_at: string | null;
  }>;
}

interface EmployerDashboardProps {
  user: User;
  company: Company;
}

export function EmployerDashboard({ user, company }: EmployerDashboardProps) {
  const [jobStats, setJobStats] = useState<JobStats>({
    activeJobs: 0,
    closedJobs: 0,
    totalJobs: 0,
    recentJobs: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

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

  const fetchJobStats = async () => {
    try {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("job_post")
        .select("*")
        .eq("company_id", company.id)
        .is("deleted_at", null)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const jobs = data || [];
      const activeJobs = jobs.filter((job) => !job.closed_at);
      const closedJobs = jobs.filter((job) => job.closed_at);
      const recentJobs = jobs.slice(0, 5).map((job) => ({
        id: job.id,
        title: job.title,
        location: job.location,
        job_type: job.job_type,
        created_at: job.created_at,
        closed_at: job.closed_at,
      }));

      setJobStats({
        activeJobs: activeJobs.length,
        closedJobs: closedJobs.length,
        totalJobs: jobs.length,
        recentJobs,
      });
    } catch (error) {
      console.error("Failed to fetch job stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobStats();
  }, [company.id]);

  const handleCreateJob = () => {
    router.push("/admin/jobs/new");
  };

  const handleViewJobs = () => {
    router.push("/admin/jobs");
  };
  return (
    <div className="py-8 flex flex-col items-stretch gap-8">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {user.name}!</h1>
        <p className="text-muted-foreground mt-2">
          Manage your job postings and company profile
        </p>
      </div>

      {/* Quick Actions */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Get started with your most common tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-start gap-4">
            <Button size="lg" onClick={handleCreateJob}>
              <Plus className="h-6 w-6" />
              Create Job Post
            </Button>
            <Button size="lg" variant="outline" onClick={handleViewJobs}>
              <FileText className="h-6 w-6" />
              View All Jobs
            </Button>
            <Button variant="outline" size="lg" disabled>
              <Settings className="h-6 w-6" />
              Company Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Company Info Card */}
      <div className="flex flex-col items-stretch gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Company</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{company.display_name}</div>
            <p className="text-xs text-muted-foreground">
              Created {new Date(company.created_at).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <RefreshCw className="h-6 w-6 animate-spin" />
              ) : (
                jobStats.activeJobs
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {jobStats.activeJobs === 0
                ? "No active job postings"
                : "Active job postings"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <RefreshCw className="h-6 w-6 animate-spin" />
              ) : (
                jobStats.totalJobs
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Jobs posted all time
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest job posting activity</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                Loading recent activity...
              </p>
            </div>
          ) : jobStats.recentJobs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>No job postings yet</p>
              <p className="text-sm">
                Create your first job post to get started
              </p>
              <Button className="mt-4" onClick={handleCreateJob}>
                <Plus className="h-4 w-4 mr-2" />
                Create Job Post
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {jobStats.recentJobs.map((job) => (
                <div
                  key={job.id}
                  className="flex items-start justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium">{job.title}</p>
                    <div className="flex items-center gap-4 mt-1">
                      {job.location && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {job.location}
                        </div>
                      )}
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {formatJobType(job.job_type)}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Created {new Date(job.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="ml-4">
                    {job.closed_at ? (
                      <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                        Closed
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                        Active
                      </span>
                    )}
                  </div>
                </div>
              ))}
              <div className="text-center pt-4">
                <Button variant="outline" onClick={handleViewJobs}>
                  View All Jobs
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
