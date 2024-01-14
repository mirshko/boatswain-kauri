import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Providers from "./providers";
import App from "./screens/app";
import "./index.css";

const root = document.getElementById("root") as HTMLElement;

createRoot(root).render(
  <StrictMode>
    <Providers>
      <App />
    </Providers>
  </StrictMode>
);
