import { useState } from "react"; import { createRoot } from "react-dom/client";
function App() { const [n, setN] = useState(0); return <main><h1>Hello</h1><button onClick={() => setN(n + 1)}>{n}</button></main>; }
createRoot(document.getElementById("root")).render(<App />);
