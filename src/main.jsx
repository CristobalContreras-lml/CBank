import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { SesionProvider } from "./context/SesionContext";
import { ThemeProvider } from "./context/ThemeContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <SesionProvider>
        <App />
      </SesionProvider>
    </ThemeProvider>
  </StrictMode>
);