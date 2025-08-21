import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import AuthGuard from "@/components/auth-guard";
import DevAuthGuard from "@/components/dev-auth-guard";
import { TimerControl } from "@/pages/TimerControl";
import TVDisplay from "@/pages/tv-display";
import Profile from "@/pages/profile";
import NotFound from "@/pages/not-found";

function Router() {
  // Use DevAuthGuard in development, AuthGuard in production
  const Guard = import.meta.env.DEV ? DevAuthGuard : AuthGuard;
  
  return (
    <Switch>
      <Route path="/" component={() => (
        <Guard>
          <TimerControl />
        </Guard>
      )} />
      <Route path="/mobile" component={() => (
        <Guard>
          <TimerControl />
        </Guard>
      )} />
      <Route path="/control" component={() => (
        <Guard>
          <TimerControl />
        </Guard>
      )} />
      <Route path="/profile" component={() => (
        <Guard>
          <Profile />
        </Guard>
      )} />
      <Route path="/config" component={() => (
        <Guard>
          <Profile />
        </Guard>
      )} />
      <Route path="/tv" component={TVDisplay} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <div className="dark">
            <Toaster />
            <Router />
          </div>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
