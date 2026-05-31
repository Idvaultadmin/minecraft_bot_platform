import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import DashboardLayout from "./components/DashboardLayout";
import Home from "./pages/Home";
import ImageBuilder from "./pages/ImageBuilder";
import BuildControl from "./pages/BuildControl";
import BotStatus from "./pages/BotStatus";
import BuildHistory from "./pages/BuildHistory";
import ServerConfig from "./pages/ServerConfig";
import BotScriptDownload from "./pages/BotScriptDownload";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/dashboard"} nest>
        {() => (
          <DashboardLayout>
            <Switch>
              <Route path={"/image-builder"} component={ImageBuilder} />
              <Route path={"/build-control"} component={BuildControl} />
              <Route path={"/bot-status"} component={BotStatus} />
              <Route path={"/history"} component={BuildHistory} />
              <Route path={"/config"} component={ServerConfig} />
              <Route path={"/script-download"} component={BotScriptDownload} />
              <Route component={ImageBuilder} />
            </Switch>
          </DashboardLayout>
        )}
      </Route>
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
