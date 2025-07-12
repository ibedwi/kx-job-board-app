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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CompanySetupFormProps {
  userId: string;
}

export function CompanySetupForm({ userId }: CompanySetupFormProps) {
  const [companyName, setCompanyName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!companyName.trim()) {
      setError("Company name is required");
      setIsLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      
      // Check if company name already exists (app-level validation)
      const { data: existingCompany } = await supabase
        .from("company")
        .select("id")
        .eq("display_name", companyName.trim())
        .is("deleted_at", null)
        .single();

      if (existingCompany) {
        setError("A company with this name already exists");
        setIsLoading(false);
        return;
      }

      // Create company
      const { data: newCompany, error: companyError } = await supabase
        .from("company")
        .insert({
          display_name: companyName.trim(),
          created_by: userId,
          company_owner: userId,
        })
        .select()
        .single();

      if (companyError) throw companyError;

      // Create employer profile automatically (US-3.1 requirement)
      const { error: employerError } = await supabase
        .from("employer_profile")
        .insert({
          user_id: userId,
          company_id: newCompany.id,
        });

      if (employerError) throw employerError;

      // Redirect to dashboard
      router.push("/protected");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Company Information</CardTitle>
        <CardDescription>
          Create your company profile to start posting jobs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name</Label>
            <Input
              id="companyName"
              type="text"
              placeholder="Enter your company name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
            />
          </div>
          
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating company..." : "Create Company & Continue"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}