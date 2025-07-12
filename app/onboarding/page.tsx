import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { OnboardingForm } from "@/features/user";

export default async function OnboardingPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Check if user profile already exists
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

  // If both profile and company exist, redirect to dashboard
  if (userProfile && companies && companies.length > 0) {
    redirect("/protected");
  }

  // Get name from user metadata if available
  const userName = user.user_metadata?.name || "";

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50">
      <div className="container max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Welcome to KX Job Board</h1>
          <p className="text-muted-foreground mt-2">
            Complete your setup to start posting jobs
          </p>
        </div>
        <OnboardingForm initialName={userName} userId={user.id} />
      </div>
    </div>
  );
}