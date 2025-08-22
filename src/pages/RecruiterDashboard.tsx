import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, Users, Search, Eye } from 'lucide-react';

interface TeacherProfile {
  id: string;
  name: string;
  subject: string;
  education: string;
  years_of_experience: number;
  location: string;
  skills: string[];
  resume_link: string;
  phone: string;
}

const RecruiterDashboard = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState<TeacherProfile[]>([]);
  const [filteredTeachers, setFilteredTeachers] = useState<TeacherProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [experienceFilter, setExperienceFilter] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/auth?role=recruiter');
      return;
    }
    
    if (profile?.role !== 'recruiter') {
      navigate('/');
      return;
    }

    fetchTeachers();
  }, [user, profile, navigate]);

  useEffect(() => {
    applyFilters();
  }, [teachers, searchTerm, subjectFilter, locationFilter, experienceFilter]);

  const fetchTeachers = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('teacher_profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      setTeachers(data);
    }
    setLoading(false);
  };

  const applyFilters = () => {
    let filtered = teachers;

    if (searchTerm) {
      filtered = filtered.filter(teacher =>
        teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.skills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (subjectFilter) {
      filtered = filtered.filter(teacher =>
        teacher.subject?.toLowerCase().includes(subjectFilter.toLowerCase())
      );
    }

    if (locationFilter) {
      filtered = filtered.filter(teacher =>
        teacher.location?.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    if (experienceFilter) {
      const minExp = parseInt(experienceFilter);
      filtered = filtered.filter(teacher =>
        teacher.years_of_experience >= minExp
      );
    }

    setFilteredTeachers(filtered);
  };

  const TeacherDetailsDialog = ({ teacher }: { teacher: TeacherProfile }) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Eye className="h-4 w-4 mr-1" />
          View
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{teacher.name}</DialogTitle>
          <DialogDescription>Teacher Profile Details</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="font-medium">Subject/Role</Label>
              <p className="text-sm text-muted-foreground">{teacher.subject || 'Not specified'}</p>
            </div>
            <div>
              <Label className="font-medium">Experience</Label>
              <p className="text-sm text-muted-foreground">{teacher.years_of_experience} years</p>
            </div>
          </div>
          
          <div>
            <Label className="font-medium">Education</Label>
            <p className="text-sm text-muted-foreground">{teacher.education || 'Not specified'}</p>
          </div>
          
          <div>
            <Label className="font-medium">Location</Label>
            <p className="text-sm text-muted-foreground">{teacher.location || 'Not specified'}</p>
          </div>
          
          <div>
            <Label className="font-medium">Phone</Label>
            <p className="text-sm text-muted-foreground">{teacher.phone || 'Not provided'}</p>
          </div>
          
          <div>
            <Label className="font-medium">Skills</Label>
            <div className="flex flex-wrap gap-2 mt-1">
              {teacher.skills?.map((skill, index) => (
                <Badge key={index} variant="secondary">{skill}</Badge>
              )) || <span className="text-sm text-muted-foreground">No skills listed</span>}
            </div>
          </div>
          
          {teacher.resume_link && (
            <div className="space-y-2">
              <Label className="font-medium">Resume (PDF)</Label>
              <div className="rounded-md border">
                <iframe
                  title="Resume PDF"
                  src={teacher.resume_link}
                  className="h-[500px] w-full rounded-md"
                />
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center space-x-4">
            <Users className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">Recruiter Dashboard</h1>
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
        <div className="space-y-6">
          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="mr-2 h-5 w-5" />
                Find Teachers
              </CardTitle>
              <CardDescription>
                Search and filter through our database of qualified teachers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="search">Search</Label>
                  <Input
                    id="search"
                    placeholder="Name, subject, or skills..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject/Role</Label>
                  <Input
                    id="subject"
                    placeholder="Filter by subject..."
                    value={subjectFilter}
                    onChange={(e) => setSubjectFilter(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="Filter by location..."
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experience">Min. Experience</Label>
                  <Input
                    id="experience"
                    type="number"
                    placeholder="Years..."
                    value={experienceFilter}
                    onChange={(e) => setExperienceFilter(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle>Teachers ({filteredTeachers.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Loading teachers...</div>
              ) : filteredTeachers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No teachers found matching your criteria
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Experience</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Skills</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTeachers.map((teacher) => (
                        <TableRow key={teacher.id}>
                          <TableCell className="font-medium">{teacher.name}</TableCell>
                          <TableCell>{teacher.subject || 'Not specified'}</TableCell>
                          <TableCell>{teacher.years_of_experience} years</TableCell>
                          <TableCell>{teacher.location || 'Not specified'}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {teacher.skills?.slice(0, 2).map((skill, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                              {teacher.skills?.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{teacher.skills.length - 2}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <TeacherDetailsDialog teacher={teacher} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default RecruiterDashboard;