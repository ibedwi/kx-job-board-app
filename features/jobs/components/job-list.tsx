"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { JobCard } from "./job-card";
import { JobForm } from "./job-form";
import { FileText, Plus, RefreshCw } from "lucide-react";

interface JobPost {
  id: string;
  title: string;
  description: string;
  location: string | null;
  job_type: "FULL_TIME" | "PART_TIME" | "CONTRACT";
  company_id: string;
  created_by_id: string;
  closed_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface JobListProps {
  companyId: string;
  userId: string;
}

export function JobList({ companyId, userId }: JobListProps) {
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingJob, setEditingJob] = useState<JobPost | null>(null);
  const [activeTab, setActiveTab] = useState("active");

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("job_post")
        .select("*")
        .eq("company_id", companyId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [companyId]);

  const handleRefresh = () => {
    fetchJobs();
  };

  const handleEdit = (job: JobPost) => {
    setEditingJob(job);
    setShowCreateForm(true);
  };

  const handleCloseForm = () => {
    setShowCreateForm(false);
    setEditingJob(null);
    fetchJobs();
  };

  const activeJobs = jobs.filter((job) => !job.closed_at && !job.deleted_at);
  const closedJobs = jobs.filter((job) => job.closed_at && !job.deleted_at);
  const deletedJobs = jobs.filter((job) => job.deleted_at);

  if (showCreateForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              {editingJob ? "Edit Job Post" : "Create New Job Post"}
            </h2>
            <p className="text-muted-foreground">
              {editingJob
                ? "Update your job posting"
                : "Add a new job opening for your company"}
            </p>
          </div>
        </div>
        <JobForm
          companyId={companyId}
          userId={userId}
          initialData={
            editingJob
              ? {
                  id: editingJob.id,
                  title: editingJob.title,
                  description: editingJob.description,
                  location: editingJob.location || undefined,
                  job_type: editingJob.job_type,
                }
              : undefined
          }
          onCancel={handleCloseForm}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Job Posts</h2>
          <p className="text-muted-foreground">
            Manage your company's job openings
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Job Post
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="active">Active ({activeJobs.length})</TabsTrigger>
          <TabsTrigger value="closed">Closed ({closedJobs.length})</TabsTrigger>
          <TabsTrigger value="deleted">
            Deleted ({deletedJobs.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Loading jobs...</p>
            </div>
          ) : activeJobs.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
                <h3 className="text-lg font-semibold mb-2">
                  No active job posts
                </h3>
                <p className="text-muted-foreground mb-4">
                  Create your first job post to start attracting candidates
                </p>
                <Button onClick={() => setShowCreateForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Job Post
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {activeJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onEdit={handleEdit}
                  onRefresh={handleRefresh}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="closed" className="space-y-4">
          {closedJobs.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
                <p className="text-muted-foreground">No closed job posts</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {closedJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onEdit={handleEdit}
                  onRefresh={handleRefresh}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="deleted" className="space-y-4">
          {deletedJobs.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
                <p className="text-muted-foreground">No deleted job posts</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {deletedJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onEdit={handleEdit}
                  onRefresh={handleRefresh}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
