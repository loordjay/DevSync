// src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import NotFound from "./Components/ui/NotFound.jsx";
import { ThemeProvider } from "./Components/ui/theme-provider";
import PomodoroTimer from "./Components/DashBoard/PomodoroTimer.jsx";
import { TimerProvider } from "./context/TimerContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <TimerProvider>
        <BrowserRouter>
          <Routes>
            {/* App handles all routes internally */}
            <Route path="/*" element={<App />} />
            
            {/* Extra routes outside of App */}
            <Route path="/pomodoro" element={<PomodoroTimer />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TimerProvider>
    </ThemeProvider>
  </StrictMode>
);
