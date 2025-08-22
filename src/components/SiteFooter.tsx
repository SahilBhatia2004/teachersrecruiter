const SiteFooter = () => {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-10 md:grid-cols-4">
        <div>
          <h4 className="mb-3 text-sm font-semibold">Explore</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>For Job Seekers</li>
            <li>For Schools</li>
            <li>About Us</li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Quick Links</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>How it Works</li>
            <li>Browse Jobs</li>
            <li>Contact Us</li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Follow</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>LinkedIn</li>
            <li>Instagram</li>
            <li>Google</li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Contact</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>hello@teacherhire.app</li>
            <li>+91 – 90 390 32383</li>
            <li className="text-xs">Privacy Policy | Terms</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto max-w-6xl px-4 py-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} TeacherHire, All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;


