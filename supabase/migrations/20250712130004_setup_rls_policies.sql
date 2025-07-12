-- Simplified Row Level Security Policies
-- Basic policies for MVP - can be enhanced later

-- User table policies - users can only access their own data
CREATE POLICY "Users can manage their own profile" ON "user"
  FOR ALL USING (auth.uid() = id);

-- Company table policies - company owners have full access
CREATE POLICY "Company owners can manage their companies" ON company
  FOR ALL USING (company_owner = auth.uid());

CREATE POLICY "Authenticated users can create companies" ON company
  FOR INSERT WITH CHECK (auth.uid() = created_by AND auth.uid() = company_owner);

-- Employer profile policies - basic access control
CREATE POLICY "Users can manage their own employer profiles" ON employer_profile
  FOR ALL USING (user_id = auth.uid());

-- Job post policies - simplified for MVP
CREATE POLICY "Users can manage job posts they created" ON job_post
  FOR ALL USING (created_by_id = auth.uid());