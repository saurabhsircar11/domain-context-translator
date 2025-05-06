import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Translate from "./pages/Translate";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/translate"
          element={
            <PrivateRoute>
              <Translate />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
