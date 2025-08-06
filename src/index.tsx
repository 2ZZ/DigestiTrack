import React from "react";
import { createRoot } from "react-dom/client";
import "./globals.css";
import App from "./App";

console.log("DigestiTrack: Starting application initialization...");

const container = document.getElementById("root");
if (!container) {
  console.error("DigestiTrack: Root element not found!");
  throw new Error("Root element not found");
}

console.log("DigestiTrack: Root element found, creating React root...");
const root = createRoot(container);

console.log("DigestiTrack: Rendering App component...");
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

console.log("DigestiTrack: App component rendered successfully!");
