import { Routes } from "react-router-dom";
import PublicRoutes from "./routes/PublicRoutes";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>{PublicRoutes()}</Routes>
    </>
  );
}

export default App;
