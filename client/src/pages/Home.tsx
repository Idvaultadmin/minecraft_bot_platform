import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { getLoginUrl } from "@/const";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold text-foreground">Welcome to Minecraft Bot Platform</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">Automate your Minecraft builds with intelligent multi-bot coordination</p>
          <Button
            size="lg"
            onClick={() => setLocation("/dashboard/image-builder")}
            className="text-base"
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-foreground">Minecraft Bot Platform</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">Automate your Minecraft builds with intelligent multi-bot coordination</p>
        <Button
          size="lg"
          onClick={() => window.location.href = getLoginUrl()}
          className="text-base"
        >
          Sign In to Get Started
        </Button>
      </div>
    </div>
  );
}
