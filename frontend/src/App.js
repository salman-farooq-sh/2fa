import { Navigate, Route, Routes } from "react-router-dom";
import axios from "axios";
import { BACKEND_API_URL } from "./env";
import Private from "./components/Private";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import LoginStep2 from "./pages/LoginStep2";
import Profile from "./pages/Profile";
import Enable2fa from "./pages/Enable2fa";
import Disable2fa from "./pages/Disable2fa";

export default function App() {
  axios.defaults.baseURL = BACKEND_API_URL;

  return (
    <Routes>
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/login-step2" element={<LoginStep2 />} />
      <Route path="/profile" element={<Private element={<Profile />} />} />
      <Route path="/enable-2fa" element={<Private element={<Enable2fa />} />} />
      <Route
        path="/disable-2fa"
        element={<Private element={<Disable2fa />} />}
      />
      <Route path="*" element={<Navigate to="/profile" replace={true} />} />
    </Routes>
  );
}
