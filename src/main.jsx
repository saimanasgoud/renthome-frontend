import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundry";

// 🔥 GLOBAL ERROR CATCH (TEMP – FOR DEBUGGING MOBILE WHITE SCREEN)
window.onerror = function (message, source, lineno, colno, error) {
  alert(
    "JS ERROR:\n" +
    message +
    "\nLine: " + lineno
  );
};


ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter basename="/renthome">
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </BrowserRouter>
);
