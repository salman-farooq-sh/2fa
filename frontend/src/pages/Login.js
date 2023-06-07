import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_API_URL } from "../env";
import { useState } from "react";
import Card from "../components/Card";

export default function Login(props) {
  const navigate = useNavigate();

  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [message, setMessage] = useState(null);

  function onClick(event) {
    event.preventDefault();
    axios
      .post(
        "/login",
        {
          email,
          password,
        },
        {}
      )
      .then((response) => {
        if (response.status === 200) {
          if (response.data.twofaEnabled) {
            localStorage.setItem(
              "loginStep2VerificationToken",
              response.data.loginStep2VerificationToken
            );
            navigate("/login-step2");
          } else {
            localStorage.setItem("authToken", response.data.token);
            navigate("/profile");
          }
        }
      })
      .catch((error) => {
        setMessage("Error logging in");
      });
  }

  return (
    <Card>
      <h2>Login</h2>

      <form>
        <div className="form_field_container">
          <label>Email</label>
          <input type="email" onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div className="form_field_container">
          <label>Password</label>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" onClick={onClick}>
          Login
        </button>
      </form>

      <div className="or">or</div>

      <Link to={"/signup"}>Signup</Link>

      {message && <div className="message">{message}</div>}
    </Card>
  );
}
