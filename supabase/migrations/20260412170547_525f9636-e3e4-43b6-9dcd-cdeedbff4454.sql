
-- 1. Fix CRITICAL: credit_transactions — remove user INSERT, tighten SELECT to authenticated
DROP POLICY IF EXISTS "Users can insert own transactions" ON public.credit_transactions;
DROP POLICY IF EXISTS "Users can view own transactions" ON public.credit_transactions;

CREATE POLICY "Authenticated users can view own transactions"
ON public.credit_transactions
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Service role manages credit transactions"
ON public.credit_transactions
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- 2. bookmarked_bhajans — tighten from public to authenticated
DROP POLICY IF EXISTS "Users can manage own bookmarks" ON public.bookmarked_bhajans;

CREATE POLICY "Authenticated users manage own bookmarks"
ON public.bookmarked_bhajans
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 3. saved_kundalis — tighten from public to authenticated
DROP POLICY IF EXISTS "Users can manage own kundalis" ON public.saved_kundalis;

CREATE POLICY "Authenticated users manage own kundalis"
ON public.saved_kundalis
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 4. profiles — tighten from public to authenticated
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

CREATE POLICY "Authenticated users can view own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Authenticated users can update own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Authenticated users can insert own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);
