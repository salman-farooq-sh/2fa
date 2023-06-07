import axios from "axios";
import { BACKEND_API_URL } from "../env";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";

export default function LoginStep2(props) {
  const navigate = useNavigate();

  const [otp, setOtp] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (!localStorage.getItem("loginStep2VerificationToken")) {
      navigate("/login");
    }
  }, [navigate]);

  function onClick(event) {
    event.preventDefault();
    axios
      .post(
        "/login-step2",
        {
          loginStep2VerificationToken: localStorage.getItem(
            "loginStep2VerificationToken"
          ),
          twofaToken: otp,
        },
        {}
      )
      .then((response) => {
        if (response.status === 200) {
          localStorage.setItem("authToken", response.data.token);
          localStorage.removeItem("loginStep2VerificationToken");
          navigate("/profile");
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          setMessage(error.response.data.message);
        } else if (error.response.status === 401) {
          setMessage(error.response.data.message);
          localStorage.removeItem("loginStep2VerificationToken");
        } else {
          setMessage("Error logging in");
        }
      });
  }

  return (
    <Card>
      <h2>Login Step 2</h2>

      <form className="otp">
        <div className="form_field_container">
          <label>OTP</label>
          <input type="number" onChange={(e) => setOtp(e.target.value)} />
        </div>

        <button type="submit" onClick={onClick}>
          Submit
        </button>
      </form>

      {message && <div>{message}</div>}
    </Card>
  );
}
