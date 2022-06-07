import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Card from "../components/Card";

export default function Enable2fa(props) {
  const navigate = useNavigate();

  const [otp, setOtp] = useState(null);
  const [secret, setSecret] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    axios
      .post(
        "/generate-2fa-secret",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      )
      .then((response) => {
        if (response.status === 200 && !response.data.twofaEnabled) {
          const { secret, qrImageDataUrl } = response.data;
          setSecret({ secret, qrImageDataUrl });
          setMessage(null);
        }
      })
      .catch((error) => {
        if (error.response.status === 400 && error.response.data.twofaEnabled) {
          navigate("/profile");
        } else {
          setSecret(null);
          setMessage("Error");
        }
      });
  }, [navigate]);

  function onClick(event) {
    event.preventDefault();
    axios
      .post(
        "/verify-otp",
        {
          token: otp,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      )
      .then((response) => {
        if (response.status === 200 && response.data.twofaEnabled) {
          navigate("/disable-2fa");
        }
      })
      .catch((error) => {
        if (
          error.response.status === 400 &&
          !error.response.data.twofaEnabled
        ) {
          setMessage("OTP verification failed: Invalid token");
        } else {
          setMessage("Error");
        }
      });
  }

  return (
    <Card>
      {secret && (
        <>
          <h2>Enable 2FA</h2>

          <div className="twofa_instructions">
            Scan the following QR code or manually input the secret in{" "}
            <a
              target="_blank"
              href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2"
            >
              Google Authenticator
            </a>{" "}
            and then enter an OTP below to enable 2-Factor Authentication
          </div>

          <div className="twofa_secret">
            <img src={secret.qrImageDataUrl} />

            <p>
              Secret: <b>{secret.secret}</b>
            </p>
          </div>

          <form>
            <div className="form_field_container">
              <label>OTP</label>
              <input type="number" onChange={(e) => setOtp(e.target.value)} />
            </div>

            <button type="submit" onClick={onClick}>
              Enable 2FA
            </button>
          </form>
        </>
      )}

      <Link to={"/profile"}>Go back to profile</Link>

      {message && <div>{message}</div>}
    </Card>
  );
}
