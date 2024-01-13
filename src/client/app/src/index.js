import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import "./styles.css";

import App from "./App";

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
