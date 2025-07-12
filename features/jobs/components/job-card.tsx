"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  Calendar, 
  Edit, 
  Eye, 
  EyeOff, 
  MapPin,
  MoreVertical, 
  Trash2, 
  User,
  Clock
} from "lucide-react";

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

interface JobCardProps {
  job: JobPost;
  onEdit: (job: JobPost) => void;
  onRefresh: () => void;
}

export function JobCard({ job, onEdit, onRefresh }: JobCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isActive = !job.closed_at && !job.deleted_at;
  const isClosed = !!job.closed_at && !job.deleted_at;

  const truncateDescription = (text: string, maxLength: number = 150) => {
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
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

  const handleToggleStatus = async () => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      
      const { error } = await supabase
        .from("job_post")
        .update({
          closed_at: isActive ? new Date().toISOString() : null,
        })
        .eq("id", job.id);

      if (error) throw error;
      onRefresh();
    } catch (error) {
      console.error("Failed to toggle job status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      
      const { error } = await supabase
        .from("job_post")
        .update({
          deleted_at: new Date().toISOString(),
        })
        .eq("id", job.id);

      if (error) throw error;
      onRefresh();
    } catch (error) {
      console.error("Failed to delete job:", error);
    } finally {
      setIsLoading(false);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <>
      <Card className={`transition-colors ${!isActive ? "opacity-60" : ""}`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg font-semibold mb-2">
                {job.title}
              </CardTitle>
              <div className="flex items-center gap-4 mb-3">
                <div className="flex items-center gap-2">
                  <Badge variant={isActive ? "default" : isClosed ? "secondary" : "destructive"}>
                    {isActive ? "Active" : isClosed ? "Closed" : "Deleted"}
                  </Badge>
                </div>
                {job.location && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {job.location}
                  </div>
                )}
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {formatJobType(job.job_type)}
                </div>
              </div>
              <CardDescription className="text-sm">
                {truncateDescription(job.description)}
              </CardDescription>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(job)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleToggleStatus} disabled={isLoading}>
                  {isActive ? (
                    <>
                      <EyeOff className="h-4 w-4 mr-2" />
                      Close Job
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-2" />
                      Reopen Job
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-red-600"
                  onClick={() => setIsDeleteDialogOpen(true)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Created {formatDate(job.created_at)}
              </div>
              {job.updated_at !== job.created_at && (
                <div className="flex items-center gap-1">
                  <Edit className="h-3 w-3" />
                  Updated {formatDate(job.updated_at)}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Job Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this job post? This action cannot be undone.
              The job will be permanently removed from your listings.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Job
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}