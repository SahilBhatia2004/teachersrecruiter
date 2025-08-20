import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground">
            Teacher<span className="text-primary">Hire</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Connecting talented educators with schools and educational institutions
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/auth?role=teacher')}>
            <CardHeader className="space-y-4">
              <div className="flex justify-center">
                <GraduationCap className="h-12 w-12 text-primary" />
              </div>
              <CardTitle>I am a Teacher</CardTitle>
              <CardDescription>
                Create your profile and showcase your expertise to find your ideal teaching position
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" size="lg">
                Get Started as Teacher
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/auth?role=recruiter')}>
            <CardHeader className="space-y-4">
              <div className="flex justify-center">
                <Users className="h-12 w-12 text-primary" />
              </div>
              <CardTitle>I am a Recruiter</CardTitle>
              <CardDescription>
                Discover and connect with qualified teachers for your educational institution
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline" size="lg">
                Find Teachers
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Landing;