-- Create a public storage bucket for resumes and RLS policies

-- Create bucket if it doesn't already exist
insert into storage.buckets (id, name, public)
values ('resumes', 'resumes', true)
on conflict (id) do nothing;

-- Allow public read for resumes so they can be embedded in an iframe
do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'Public read for resumes'
  ) then
    create policy "Public read for resumes" on storage.objects
      for select using (bucket_id = 'resumes');
  end if;
end $$;

-- Allow authenticated users to upload files into their own folder (userId/filename)
do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'Users can upload own resumes'
  ) then
    create policy "Users can upload own resumes" on storage.objects
      for insert with check (
        bucket_id = 'resumes'
        and auth.role() = 'authenticated'
        and split_part(name, '/', 1) = auth.uid()::text
      );
  end if;
end $$;

-- Allow users to update/delete their own resume files
do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'Users can manage own resumes'
  ) then
    create policy "Users can manage own resumes" on storage.objects
      for all using (
        bucket_id = 'resumes' and split_part(name, '/', 1) = auth.uid()::text
      ) with check (
        bucket_id = 'resumes' and split_part(name, '/', 1) = auth.uid()::text
      );
  end if;
end $$;


