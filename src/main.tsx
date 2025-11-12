
  import { createRoot } from "react-dom/client";
  import App from "./App.tsx";
  import "./index.css";

  try {
    const rootElement = document.getElementById("root");
    if (!rootElement) {
      throw new Error("Root element not found");
    }
    const root = createRoot(rootElement);
    root.render(<App />);
  } catch (error) {
    console.error("Failed to render app:", error);
    document.body.innerHTML = `
      <div style="padding: 20px; font-family: sans-serif;">
        <h1>Error loading application</h1>
        <p>${error instanceof Error ? error.message : String(error)}</p>
        <p>Please check the browser console for more details.</p>
      </div>
    `;
  }
  