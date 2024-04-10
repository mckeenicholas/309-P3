import "./styles/app.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Pricing from "./pages/Pricing";
import Features from "./pages/Features";
import Support from "./pages/Support";
import Footer from "./components/Footer";
import Calendars from "./pages/Calendars";
import LogInPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Contacts from "./pages/Contacts";
import NotFound from "./pages/NotFound";
import Settings from "./pages/Settings";
import AuthProvider from "./utils/AuthService";
import { DashboardOverlay } from "./components/DashboardOverlay";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<Footer />}>
            <Route index element={<Home />} />
            <Route path="pricing/" element={<Pricing />} />
            <Route path="features/" element={<Features />} />
            <Route path="support/" element={<Support />} />
            <Route path="login/" element={<LogInPage />} />
            <Route path="signup/" element={<SignupPage />} />
          </Route>
          <Route element={<DashboardOverlay />}>
            <Route path="dashboard/" element={<Calendars />} />
            <Route path="contacts/" element={<Contacts />} />
            <Route path="settings/" element={<Settings />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
