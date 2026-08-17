// 初恋ラボのルート共通シェル。「ふわり恋色ノート」のページ遷移は常に新しい便箋の先頭から読み始める。
import { useEffect, useLayoutEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import HeroineList from "./pages/HeroineList";
import WorkPlaceholder from "@/pages/WorkPlaceholder";
import Commission from "@/pages/Commission";
import Diagnosis from "@/pages/Diagnosis";
import AboutProduction from "@/pages/AboutProduction";
import Fun from "@/pages/Fun";

function MutualGameRedirect() {
  useEffect(() => {
    window.location.replace("/mutual/index.html");
  }, []);

  return null;
}

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/heroines"} component={HeroineList} />
      <Route path={"/works/:slug"} component={WorkPlaceholder} />
      <Route path={"/commission"} component={Commission} />
      <Route path={"/diagnosis/gameover"} component={Diagnosis} />
      <Route path={"/diagnosis/result/:slug"} component={Diagnosis} />
      <Route path={"/diagnosis"} component={Diagnosis} />
      <Route path={"/fun"} component={Fun} />
      <Route path={"/mutual"} component={MutualGameRedirect} />
      <Route path={"/about"} component={AboutProduction} />
      <Route path={"/about-production"} component={AboutProduction} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function ScrollToPageTop() {
  const [location] = useLocation();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return null;
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <ScrollToPageTop />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
