import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeftCircle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="max-w-md w-full rounded-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl">404</CardTitle>
          <CardDescription>Oops! Page not found</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <Button asChild>
            <a href="/" className="inline-flex items-center">
              <ArrowLeftCircle className="mr-2 h-4 w-4" />
              Return to Home
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
