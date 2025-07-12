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
import { ArrowLeft, Building, User } from "lucide-react";

interface OnboardingFormProps {
  initialName: string;
  userId: string;
}

export function OnboardingForm({ initialName, userId }: OnboardingFormProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState(initialName);
  const [companyName, setCompanyName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    // Just move to step 2, don't submit yet
    setStep(2);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!name.trim()) {
      setError("Name is required");
      setIsLoading(false);
      return;
    }

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

      // 1. Create user profile
      const { error: userError } = await supabase.from("user").insert({
        id: userId,
        name: name.trim(),
      });

      if (userError) throw userError;

      // 2. Create company
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

      // 3. Create employer profile automatically (US-3.1 requirement)
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

  if (step === 1) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Your Profile
          </CardTitle>
          <CardDescription>Tell us a bit about yourself</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleProfileSubmit}
            className="flex flex-col items-stretch gap-4"
          >
            <div className="flex flex-col items-stretch gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button type="submit" className="w-full">
              Continue to Company Setup
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-start gap-2">
          <Button
            type="button"
            variant="ghost"
            className="w-fit mb-4 px-2"
            onClick={() => setStep(1)}
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Profile Setup
          </Button>
        </div>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          Company Information
        </CardTitle>
        <CardDescription>
          Create your company profile to start posting jobs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleFinalSubmit}
          className="flex flex-col items-stretch gap-4"
        >
          <div className="flex flex-col items-stretch gap-2">
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

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex gap-3">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating company..." : "Complete Setup"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
