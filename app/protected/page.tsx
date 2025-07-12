import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { EmployerDashboard } from "@/features/dashboard";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/auth/login");
  }

  // Check if user profile exists
  const { data: userProfile } = await supabase
    .from("user")
    .select("*")
    .eq("id", data.user.id)
    .single();

  // Check if user has a company
  const { data: companies } = await supabase
    .from("company")
    .select("*")
    .eq("company_owner", data.user.id)
    .is("deleted_at", null);

  // If either profile or company is missing, redirect to onboarding
  if (!userProfile || !companies || companies.length === 0) {
    redirect("/onboarding");
  }

  const company = companies[0];

  return (
    <div className="flex-1 w-full max-w-5xl mx-auto">
      <EmployerDashboard user={userProfile} company={company} />
    </div>
  );
}
