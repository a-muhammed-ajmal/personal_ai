import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Layout from "./components/Layout";

// Pages
import Home from "./pages/Home";
import StrategicCore from "./pages/StrategicCore";
import DailyWorkflow from "./pages/DailyWorkflow";

// Banking Engine
import BankingCRM from "./pages/banking/BankingCRM";
import ActivityTracker from "./pages/banking/ActivityTracker";
import ProductVault from "./pages/banking/ProductVault";
import MarketIntel from "./pages/banking/MarketIntel";

// Consulting Engine
import ConsultingCRM from "./pages/consulting/ConsultingCRM";
import OfferFramework from "./pages/consulting/OfferFramework";
import ContentSystem from "./pages/consulting/ContentSystem";
import ToolkitVault from "./pages/consulting/ToolkitVault";

// Stability Engine
import FinancePanel from "./pages/stability/FinancePanel";
import HabitTracker from "./pages/stability/HabitTracker";
import BurnoutMonitor from "./pages/stability/BurnoutMonitor";

// Control System
import WeeklyReview from "./pages/control/WeeklyReview";
import QuarterlyReview from "./pages/control/QuarterlyReview";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/strategic-core" component={StrategicCore} />
        <Route path="/daily-workflow" component={DailyWorkflow} />

        {/* Banking Engine */}
        <Route path="/banking/crm" component={BankingCRM} />
        <Route path="/banking/activity" component={ActivityTracker} />
        <Route path="/banking/products" component={ProductVault} />
        <Route path="/banking/market-intel" component={MarketIntel} />

        {/* Consulting Engine */}
        <Route path="/consulting/crm" component={ConsultingCRM} />
        <Route path="/consulting/offers" component={OfferFramework} />
        <Route path="/consulting/content" component={ContentSystem} />
        <Route path="/consulting/toolkit" component={ToolkitVault} />

        {/* Stability Engine */}
        <Route path="/stability/finance" component={FinancePanel} />
        <Route path="/stability/habits" component={HabitTracker} />
        <Route path="/stability/burnout" component={BurnoutMonitor} />

        {/* Control System */}
        <Route path="/control/weekly" component={WeeklyReview} />
        <Route path="/control/quarterly" component={QuarterlyReview} />

        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster richColors position="bottom-right" />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
