// const environment = import.meta.env.VITE_DEVELOPMENT_ENVIRONMENT;

// if (environment !== "dev") {
//   const url = new URL(window.location.href);
//   if (url.searchParams.has("at") || url.searchParams.has("rt")) {
//     url.searchParams.delete("at");
//     url.searchParams.delete("rt");
//     window.history.replaceState({}, document.title, url.toString());
//   }
// }

// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/main.scss";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <BrowserRouter>
    <main className="main ">
      <App />
    </main>
  </BrowserRouter>
  // </StrictMode>
);
