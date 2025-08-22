import { Button } from '@/components/ui/button';
import { GraduationCap, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const SiteHeader = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <button onClick={() => navigate('/')} className="flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold">Teacher<span className="text-primary">Hire</span></span>
        </button>

        <nav className="hidden items-center gap-6 md:flex">
          <button onClick={() => navigate('/')} className="text-sm text-foreground hover:text-primary">Home</button>
          <button onClick={() => navigate('/')} className="text-sm text-foreground hover:text-primary">Teachers</button>
          <button onClick={() => navigate('/')} className="text-sm text-foreground hover:text-primary">Institutions</button>
          <button onClick={() => navigate('/')} className="text-sm text-foreground hover:text-primary">How It Works</button>
          <button onClick={() => navigate('/')} className="text-sm text-foreground hover:text-primary">Pricing</button>
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Button variant="secondary" onClick={() => navigate('/auth?role=recruiter')}>
            Recruiter Login
          </Button>
          <Button variant="outline" onClick={() => navigate('/auth?role=teacher')}>
            Teacher Login
          </Button>
          <Button onClick={() => navigate('/auth?role=recruiter')}>Access Teacher Database</Button>
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)}>
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {open && (
        <div className="mx-auto block max-w-6xl px-4 pb-4 md:hidden">
          <div className="grid gap-2">
            <button onClick={() => { navigate('/'); setOpen(false); }} className="rounded px-2 py-2 text-left text-sm hover:bg-muted">Home</button>
            <button onClick={() => { navigate('/'); setOpen(false); }} className="rounded px-2 py-2 text-left text-sm hover:bg-muted">Teachers</button>
            <button onClick={() => { navigate('/'); setOpen(false); }} className="rounded px-2 py-2 text-left text-sm hover:bg-muted">Institutions</button>
            <button onClick={() => { navigate('/'); setOpen(false); }} className="rounded px-2 py-2 text-left text-sm hover:bg-muted">How It Works</button>
            <button onClick={() => { navigate('/'); setOpen(false); }} className="rounded px-2 py-2 text-left text-sm hover:bg-muted">Pricing</button>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Button variant="secondary" className="w-full" onClick={() => { navigate('/auth?role=recruiter'); setOpen(false); }}>Recruiter Login</Button>
              <Button variant="outline" className="w-full" onClick={() => { navigate('/auth?role=teacher'); setOpen(false); }}>Teacher Login</Button>
              <Button className="col-span-2 w-full" onClick={() => { navigate('/auth?role=recruiter'); setOpen(false); }}>Access Teacher Database</Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default SiteHeader;


