import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, UserPlus, LogIn, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

const Auth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const role = (searchParams.get('role') as 'teacher' | 'recruiter') || 'recruiter';

  const cleanupAuthState = () => {
    localStorage.removeItem('supabase.auth.token');
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
    Object.keys(sessionStorage || {}).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        sessionStorage.removeItem(key);
      }
    });
  };

  useEffect(() => {
    if (user && profile) {
      if (profile.role === 'teacher') {
        navigate('/teacher/dashboard');
      } else if (profile.role === 'recruiter') {
        navigate('/recruiter/dashboard');
      }
    }
  }, [user, profile, navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      cleanupAuthState();
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
      }

      if (isSignUp) {
        const redirectUrl = `${window.location.origin}/`;
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl,
            data: { role }
          }
        });

        if (error) throw error;
        
        toast({
          title: "Check your email",
          description: "We sent you a confirmation link to complete your registration.",
        });
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        if (data.user) {
          try {
            const { data: existingProfile } = await supabase
              .from('profiles')
              .select('*')
              .eq('user_id', data.user.id)
              .single();

            if (!existingProfile) {
              await supabase
                .from('profiles')
                .insert({
                  user_id: data.user.id,
                  email: data.user.email,
                  role,
                });
            } else if (role === 'teacher' && existingProfile.role !== 'teacher') {
              await supabase
                .from('profiles')
                .update({ role: 'teacher' })
                .eq('user_id', data.user.id);
            } else if (role === 'recruiter' && existingProfile.role !== 'recruiter') {
              await supabase
                .from('profiles')
                .update({ role: 'recruiter' })
                .eq('user_id', data.user.id);
            }
          } catch (e) {
            // Non-blocking: continue navigation even if profile sync fails
          }

          window.location.href = '/';
        }
      }
    } catch (error: any) {
      toast({
        title: "Authentication Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-background">
      <SiteHeader />

      <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-8 px-4 py-10 md:grid-cols-2 md:py-16">
        <div className="order-2 md:order-1">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>

          <Card className="rounded-2xl">
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-center gap-2">
                <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs">
                  {role}
                </Badge>
              </div>
              <CardTitle className="text-center text-2xl">
                {isSignUp ? 'Create Account' : 'Welcome Back'}
              </CardTitle>
              <CardDescription className="text-center">
                {isSignUp ? 'Sign up' : 'Sign in'} as a {role}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAuth} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Please wait...' : (
                    isSignUp ? (
                      <span className="inline-flex items-center"> <UserPlus className="mr-2 h-4 w-4" /> Sign Up</span>
                    ) : (
                      <span className="inline-flex items-center"> <LogIn className="mr-2 h-4 w-4" /> Sign In</span>
                    )
                  )}
                </Button>
              </form>

              <div className="mt-4 text-center">
                <Button
                  variant="link"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-sm"
                >
                  {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                </Button>
                <p className="text-xs text-muted-foreground">We respect your privacy and never share your data <Shield className="ml-1 inline h-3 w-3" /></p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="order-1 flex flex-col items-center justify-center text-center md:order-2">
          <div className="mx-auto max-w-sm">
            <div className="mb-4 inline-flex items-center justify-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              Build your teaching journey
            </div>
            <h2 className="bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-3xl font-extrabold text-transparent md:text-4xl">
              Join TeacherHire
            </h2>
            <p className="mt-3 text-sm text-muted-foreground md:text-base">
              Create a profile, showcase your skills, and connect with institutions looking for your expertise.
            </p>
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
};

export default Auth;