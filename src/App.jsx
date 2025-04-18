import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/authContext";
import Login from "./page/login";
import Dashboard from "./page/dashboard";
import ProtectedRoute from "./routes/protectedRoutes";
import LoginLayout from "./component/Layouts/Loginlayout";
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route element={<LoginLayout />}>
            <Route path="/" element={<Login />} />
          </Route>
          <Route
            path="/dashboard"
            element={
              // <ProtectedRoute>
              <Dashboard />
              // </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
