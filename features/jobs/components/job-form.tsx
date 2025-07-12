"use client";

import { useState } from "react";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText, Save, X } from "lucide-react";

interface JobFormProps {
  companyId: string;
  userId: string;
  initialData?: {
    id: string;
    title: string;
    description: string;
    location?: string;
    job_type: "FULL_TIME" | "PART_TIME" | "CONTRACT";
  };
  onCancel?: () => void;
}

export function JobForm({ companyId, userId, initialData, onCancel }: JobFormProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [location, setLocation] = useState(initialData?.location || "");
  const [jobType, setJobType] = useState<"FULL_TIME" | "PART_TIME" | "CONTRACT">(
    initialData?.job_type || "FULL_TIME"
  );
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const isEditing = !!initialData;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!title.trim()) {
      setError("Job title is required");
      setIsLoading(false);
      return;
    }

    if (!description.trim()) {
      setError("Job description is required");
      setIsLoading(false);
      return;
    }

    try {
      const supabase = createClient();

      const jobData = {
        title: title.trim(),
        description: description.trim(),
        location: location.trim() || null,
        job_type: jobType,
      };

      if (isEditing) {
        // Update existing job post
        const { error } = await supabase
          .from("job_post")
          .update(jobData)
          .eq("id", initialData.id);

        if (error) throw error;
      } else {
        // Create new job post
        const { error } = await supabase
          .from("job_post")
          .insert({
            ...jobData,
            company_id: companyId,
            created_by_id: userId,
          });

        if (error) throw error;
      }

      // Redirect to jobs list or call onCancel if provided
      if (onCancel) {
        onCancel();
      } else {
        router.push("/jobs");
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          {isEditing ? "Edit Job Post" : "Create New Job Post"}
        </CardTitle>
        <CardDescription>
          {isEditing 
            ? "Update your job posting details" 
            : "Create a job posting to attract qualified candidates"
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Job Title *</Label>
            <Input
              id="title"
              placeholder="e.g. Senior Software Engineer, Marketing Manager"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="e.g. San Francisco, CA or Remote"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="jobType">Job Type *</Label>
              <Select value={jobType} onValueChange={(value: "FULL_TIME" | "PART_TIME" | "CONTRACT") => setJobType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FULL_TIME">Full Time</SelectItem>
                  <SelectItem value="PART_TIME">Part Time</SelectItem>
                  <SelectItem value="CONTRACT">Contract</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Job Description *</Label>
            <Textarea
              id="description"
              placeholder="Enter a detailed job description including responsibilities, requirements, and qualifications..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={8}
              className="resize-y min-h-[120px]"
            />
            <p className="text-sm text-muted-foreground">
              Provide a clear and comprehensive description of the role
            </p>
          </div>
          
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
          
          <div className="flex gap-3">
            {onCancel && (
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1"
                onClick={onCancel}
                disabled={isLoading}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            )}
            <Button 
              type="submit" 
              className="flex-1"
              disabled={isLoading}
            >
              <Save className="h-4 w-4 mr-2" />
              {isLoading 
                ? (isEditing ? "Updating..." : "Creating...") 
                : (isEditing ? "Update Job" : "Create Job Post")
              }
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}