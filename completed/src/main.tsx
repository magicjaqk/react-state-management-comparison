import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

// Jotai Provider
import { Provider as JotaiProvider } from "jotai";

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <JotaiProvider>
      <App />
    </JotaiProvider>
  </React.StrictMode>,
);
