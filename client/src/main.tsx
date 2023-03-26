import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import ViewProvider from "./context/ViewContext";
import "./index.scss";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <BrowserRouter>
    <ViewProvider>
      <App />
    </ViewProvider>
  </BrowserRouter>
);
