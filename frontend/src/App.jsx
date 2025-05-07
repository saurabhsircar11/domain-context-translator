import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import NewProject from "./pages/NewProject";
import EditProject from "./pages/EditProject";
import ViewProject from "./pages/ViewProject";
import PrivateRoute from "./routes/PrivateRoute";
import Sidebar from "./components/Sidebar";
import { useSelector } from "react-redux";
import LoginPage from "./pages/LoginPage";

function App() {
  const user = useSelector((state) => state.auth.user);

  return (
    <Router>
      <div className="flex min-h-screen">
        {user && <Sidebar />}
        <div className="flex-1 p-4">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<PrivateRoute />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/projects/new" element={<NewProject />} />
              <Route path="/projects/:id" element={<ViewProject />} />
              <Route path="/projects/:id/edit" element={<EditProject />} />
            </Route>
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
