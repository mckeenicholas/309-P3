import "./styles/app.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Calendars from "./pages/Calendars";
import Pricing from "./pages/Pricing";
import Features from "./pages/Features";
import Support from "./pages/Support";
import Footer from "./components/Footer";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Footer />}>
          <Route index element={<Home />} />
          <Route path="pricing/" element={<Pricing />} />
          <Route path="features/" element={<Features />} />
          <Route path="support/" element={<Support />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
