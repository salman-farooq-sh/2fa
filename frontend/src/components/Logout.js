import { useNavigate } from "react-router-dom";

export default function Logout(props) {
  const navigate = useNavigate();

  function onClick(event) {
    event.preventDefault();
    localStorage.removeItem("authToken");
    navigate("/login");
  }

  return <a onClick={onClick} href=''>Logout</a>;
}
