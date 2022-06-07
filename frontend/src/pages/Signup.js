import { useState } from "react";
import axios from "axios";
import { BACKEND_API_URL } from "../env";
import { Link, useNavigate } from "react-router-dom";
import Card from "../components/Card";

export default function Signup(props) {
  const navigate = useNavigate();

  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [age, setAge] = useState(null);
  const [message, setMessage] = useState(null);

  function onClick(event) {
    event.preventDefault();
    axios
      .post(
        "/signup",
        {
          email,
          password,
          age,
        },
        {}
      )
      .then((response) => {
        if (response.status === 201) {
          setMessage("Signup successful. Redirecting to login page now...");
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        }
      })
      .catch((error) => {
        setMessage("Error in signup");
      });
  }

  return (
    <Card>
      <h2>Signup</h2>

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

        <div className="form_field_container">
          <label>Your Age</label>
          <input type="number" onChange={(e) => setAge(e.target.value)} />
        </div>

        <button type="submit" onClick={onClick}>
          Signup
        </button>
      </form>

      <div className="or">or</div>

      <Link to={"/login"}>Login</Link>

      {message && <div className="message">{message}</div>}
    </Card>
  );
}
