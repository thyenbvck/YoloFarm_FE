import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/authContext";
import Login from "./page/login";
import Dashboard from "./page/dashboard";
import OperationHistory from "./page/operationhistory";
import AutoSchedulePage from "./page/autoschedule";
import AlertPage from "./page/notificationAlert";
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
          <Route
            path="/history"
            element={
              // <ProtectedRoute>
              <OperationHistory />
              // </ProtectedRoute>
            }
          />
          <Route
            path="/setting"
            element={
              // <ProtectedRoute>
              <AutoSchedulePage />
              // </ProtectedRoute>
            }
          />
          <Route
            path="/notification"
            element={
              // <ProtectedRoute>
              <AlertPage />
              // </ProtectedRoute>
            }
          />
          
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
