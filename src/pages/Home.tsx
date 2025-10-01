// ...existing code...
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate(); // ✅ inside component

  return (
    <div>
      <button onClick={() => navigate("/profile")}>Go to Profile</button>
    </div>
  );
}
