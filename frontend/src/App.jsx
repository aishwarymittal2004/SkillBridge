import { BrowserRouter, Routes, Route } from "react-router-dom";
import Progress from "./pages/Progress";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import ResumeDetail from "./pages/ResumeDetail";
import ResumeReport from "./pages/ResumeReport";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Register from "./pages/Register";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Protected/Layout Pages */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <Layout>
                <History />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/progress"
          element={
            <ProtectedRoute>
              <Layout>
                <Progress />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/resume/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <ResumeDetail />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/resume/:id/report"
          element={
            <ProtectedRoute>
              <Layout>
                <ResumeReport />
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
