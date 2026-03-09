import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { secureStorage } from "./lib/secureStorage";

// Initialize encrypted storage before rendering
secureStorage.init().then(() => {
  createRoot(document.getElementById("root")!).render(<App />);
});
