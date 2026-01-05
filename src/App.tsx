import { Routes } from "react-router-dom";
import PublicRoutes from "./routes/PublicRoutes";
//import AdminRoutes from "./routes/AdminRoutes";
//import ProtectedRoutes from "./routes/ProtectedRoutes";

function App() {
  return <Routes>{PublicRoutes()}</Routes>;
}

export default App;
