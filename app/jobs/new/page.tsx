import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { JobForm } from "@/features/jobs";

export default async function NewJobPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Check if user profile exists
  const { data: userProfile } = await supabase
    .from("user")
    .select("*")
    .eq("id", user.id)
    .single();

  // Check if user has a company
  const { data: companies } = await supabase
    .from("company")
    .select("*")
    .eq("company_owner", user.id)
    .is("deleted_at", null);

  // If either profile or company is missing, redirect to onboarding
  if (!userProfile || !companies || companies.length === 0) {
    redirect("/onboarding");
  }

  const company = companies[0];

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create New Job Post</h1>
          <p className="text-muted-foreground">
            Add a new job opening for {company.display_name}
          </p>
        </div>
        <JobForm companyId={company.id} userId={user.id} />
      </div>
    </div>
  );
}