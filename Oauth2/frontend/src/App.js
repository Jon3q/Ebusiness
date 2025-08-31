import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import GoogleLoginButton from "./GoogleLoginButton";
import GitHubLoginButton from "./GitHubLoginButton";
import OauthSuccess from "./OauthSuccess";

function Dashboard() {
  return <h2>Witaj w aplikacji – jesteś zalogowany!</h2>;
}

export default function App() {
  return (
    <Router>
      <nav>
        <Link to="/login">Login</Link> |{" "}
        <Link to="/register">Register</Link>
      </nav>
      <GoogleLoginButton />
      <GitHubLoginButton />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/oauth-success" element={<OauthSuccess />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}
