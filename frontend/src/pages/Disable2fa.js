import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "../components/Card";

export default function Disable2fa(props) {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    axios
      .get("/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setUser(response.data.user);
          if (!response.data.user.twofaEnabled) {
            navigate("/profile");
          }
          setMessage(null);
        }
      })
      .catch((error) => {
        setUser(null);
        setMessage("Error");
      });
  }, []);

  function onClick(event) {
    event.preventDefault();
    axios
      .post(
        "/disable-2fa",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      )
      .then((response) => {
        if (response.status === 200 && !response.data.twofaEnabled) {
          navigate("/enable-2fa");
        }
      })
      .catch((error) => {
        setMessage("Error");
      });
  }

  return (
    <Card>
      {user?.twofaEnabled && (
        <a href="" onClick={onClick}>
          Disable 2FA
        </a>
      )}

      <Link to={"/profile"}>Go back to profile</Link>

      {message && <div>{message}</div>}
    </Card>
  );
}
