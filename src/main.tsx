import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Buffer } from "buffer";

// Polyfill Buffer for browser environment (needed by gray-matter)
window.Buffer = Buffer;

createRoot(document.getElementById("root")!).render(<App />);
