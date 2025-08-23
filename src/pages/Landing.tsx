import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Users, ArrowRight, Briefcase, School, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-background">
      <SiteHeader />

      <main className="mx-auto flex max-w-6xl flex-col items-center px-4 py-12 md:py-16">
        <section className="grid w-full grid-cols-1 items-center gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <span className="inline-flex rounded-full bg-primary/20 px-3 py-1 text-xs font-medium text-primary">India's leading teacher database for schools</span>
            <h1 className="text-4xl font-extrabold md:text-5xl">Access Qualified Teachers, Instantly</h1>
            <p className="text-balance text-muted-foreground md:text-lg">Powerful search and filters to discover verified educator profiles. Save time, hire faster.</p>
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => navigate('/auth?role=recruiter')}>Access Teacher Database</Button>
              <Button variant="outline" onClick={() => navigate('/auth?role=recruiter')}>Recruiter Login</Button>
            </div>
          </div>
          <div className="">
            <div className="rounded-2xl border border-border p-6 shadow-sm">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Search by Subject</CardTitle>
                    <CardDescription>Maths, Science, English, more</CardDescription>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Filter by Experience</CardTitle>
                    <CardDescription>From freshers to 10+ years</CardDescription>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Locations & Availability</CardTitle>
                    <CardDescription>City, state, remote</CardDescription>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Verified Profiles</CardTitle>
                    <CardDescription>Resume, skills, education</CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-16 w-full">
          <h2 className="mb-8 text-center text-2xl font-bold">How Hiring Works</h2>
          <div className="grid gap-6 md:grid-cols-4">
            <Card className="text-center">
              <CardHeader>
                <Briefcase className="mx-auto h-8 w-8 text-primary" />
                <CardTitle className="text-base">1. Define Needs</CardTitle>
                <CardDescription>Role, subject, location, budget</CardDescription>
              </CardHeader>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <Users className="mx-auto h-8 w-8 text-primary" />
                <CardTitle className="text-base">2. Search & Filter</CardTitle>
                <CardDescription>Discover matching teacher profiles</CardDescription>
              </CardHeader>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <CheckCircle2 className="mx-auto h-8 w-8 text-primary" />
                <CardTitle className="text-base">3. Shortlist</CardTitle>
                <CardDescription>Save profiles and reach out directly</CardDescription>
              </CardHeader>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <School className="mx-auto h-8 w-8 text-primary" />
                <CardTitle className="text-base">4. Hire</CardTitle>
                <CardDescription>Interview and finalize selections</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>
        
        <section className="mt-16 w-full">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Featured Teacher Segments</h2>
            <Button variant="ghost" onClick={() => navigate('/auth?role=recruiter')}>Browse All</Button>
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {["English professor (2–5 yrs)", "Maths professor (3–7 yrs)", "Primary Teacher (1–3 yrs)"].map((title, i) => (
              <Card key={i} className="hover:shadow-md">
                <CardHeader>
                  <CardTitle className="text-base">{title}</CardTitle>
                  <CardDescription>Verified resumes, skills and education</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button size="sm" variant="outline" onClick={() => navigate('/auth?role=recruiter')}>View Profiles</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
};

export default Landing;