"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Building, Plus, FileText, Settings } from "lucide-react";

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

interface EmployerDashboardProps {
  user: User;
  company: Company;
}

export function EmployerDashboard({ user, company }: EmployerDashboardProps) {
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
            <Button size="lg">
              <Plus className="h-6 w-6" />
              Create Job Post
            </Button>
            <Button size="lg" variant="outline">
              <FileText className="h-6 w-6" />
              View All Jobs
            </Button>
            <Button variant="outline" size="lg">
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
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              No active job postings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
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
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p>No job postings yet</p>
            <p className="text-sm">Create your first job post to get started</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
