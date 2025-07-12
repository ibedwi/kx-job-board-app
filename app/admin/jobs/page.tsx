import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { JobList } from "@/features/jobs";

export default async function JobsPage() {
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
    <div className="container mx-auto py-8">
      <JobList companyId={company.id} userId={user.id} />
    </div>
  );
}