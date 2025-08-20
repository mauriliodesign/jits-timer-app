import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import AuthGuard from "@/components/auth-guard";
import MobileControl from "@/pages/mobile-control";
import TVDisplay from "@/pages/tv-display";
import Profile from "@/pages/profile";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={() => (
        <AuthGuard>
          <MobileControl />
        </AuthGuard>
      )} />
      <Route path="/mobile" component={() => (
        <AuthGuard>
          <MobileControl />
        </AuthGuard>
      )} />
      <Route path="/control" component={() => (
        <AuthGuard>
          <MobileControl />
        </AuthGuard>
      )} />
      <Route path="/profile" component={() => (
        <AuthGuard>
          <Profile />
        </AuthGuard>
      )} />
      <Route path="/config" component={() => (
        <AuthGuard>
          <Profile />
        </AuthGuard>
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
