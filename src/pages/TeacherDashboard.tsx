import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { LogOut, User } from 'lucide-react';

interface TeacherProfile {
  name: string;
  phone: string;
  subject: string;
  education: string;
  years_of_experience: number;
  location: string;
  skills: string[];
  resume_link: string;
}

const TeacherDashboard = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [teacherProfile, setTeacherProfile] = useState<TeacherProfile>({
    name: '',
    phone: '',
    subject: '',
    education: '',
    years_of_experience: 0,
    location: '',
    skills: [],
    resume_link: ''
  });
  const [skillsInput, setSkillsInput] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/auth?role=teacher');
      return;
    }
    
    if (profile?.role !== 'teacher') {
      navigate('/');
      return;
    }

    fetchTeacherProfile();
  }, [user, profile, navigate]);

  const fetchTeacherProfile = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('teacher_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (data) {
      setTeacherProfile(data);
      setSkillsInput(data.skills?.join(', ') || '');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const skills = skillsInput.split(',').map(skill => skill.trim()).filter(Boolean);
      let resumeUrl = teacherProfile.resume_link;

      if (resumeFile) {
        if (resumeFile.type !== 'application/pdf') {
          throw new Error('Please upload a PDF file');
        }
        if (resumeFile.size > 10 * 1024 * 1024) {
          throw new Error('File size must be under 10MB');
        }

        const fileExt = resumeFile.name.split('.').pop();
        const filePath = `${user!.id}/resume-${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase
          .storage
          .from('resumes')
          .upload(filePath, resumeFile, {
            contentType: 'application/pdf',
            upsert: true,
          });

        if (uploadError) {
          throw uploadError;
        }

        const { data: publicData } = supabase
          .storage
          .from('resumes')
          .getPublicUrl(filePath);

        resumeUrl = publicData.publicUrl;
      }

      const { error } = await supabase
        .from('teacher_profiles')
        .upsert({
          user_id: user!.id,
          ...teacherProfile,
          skills,
          resume_link: resumeUrl
        });

      if (error) throw error;

      toast({
        title: "Profile Updated",
        description: "Your teacher profile has been successfully saved.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center space-x-4">
            <User className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">Teacher Dashboard</h1>
              <p className="text-muted-foreground">Welcome, {profile?.email}</p>
            </div>
          </div>
          <Button variant="outline" onClick={signOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle>Your Teacher Profile</CardTitle>
            <CardDescription>
              Complete your profile to help recruiters find you
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={teacherProfile.name}
                    onChange={(e) => setTeacherProfile(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={teacherProfile.phone}
                    onChange={(e) => setTeacherProfile(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject/Role</Label>
                  <Input
                    id="subject"
                    placeholder="e.g., Mathematics, Science, English"
                    value={teacherProfile.subject}
                    onChange={(e) => setTeacherProfile(prev => ({ ...prev, subject: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="years_of_experience">Years of Experience</Label>
                  <Input
                    id="years_of_experience"
                    type="number"
                    min="0"
                    value={teacherProfile.years_of_experience}
                    onChange={(e) => setTeacherProfile(prev => ({ ...prev, years_of_experience: parseInt(e.target.value) || 0 }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="education">Education</Label>
                <Input
                  id="education"
                  placeholder="e.g., Bachelor's in Education, Master's in Mathematics"
                  value={teacherProfile.education}
                  onChange={(e) => setTeacherProfile(prev => ({ ...prev, education: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="e.g., New York, NY"
                  value={teacherProfile.location}
                  onChange={(e) => setTeacherProfile(prev => ({ ...prev, location: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="skills">Skills (comma-separated)</Label>
                <Textarea
                  id="skills"
                  placeholder="e.g., Classroom Management, Curriculum Development, Technology Integration"
                  value={skillsInput}
                  onChange={(e) => setSkillsInput(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="resume_pdf">Resume (PDF)</Label>
                <Input
                  id="resume_pdf"
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                />
                {teacherProfile.resume_link && (
                  <p className="text-sm text-muted-foreground">
                    Current: <a className="underline" href={teacherProfile.resume_link} target="_blank" rel="noreferrer">View uploaded resume</a>
                  </p>
                )}
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Saving...' : 'Save Profile'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default TeacherDashboard;