import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { App } from "@/app";
import "@/app/styles/tailwind.css";
import "@/app/styles/index.scss";

const rootElement = document.getElementById("root")!;
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
