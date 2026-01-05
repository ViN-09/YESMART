import { useNavigate } from "react-router-dom";
import { logoutUser } from "./API"; // GANTI sesuai lokasi file API kamu
import "bootstrap-icons/font/bootstrap-icons.css";
import './Homepage.css';
import logo from "./assets/Gemini_Generated_Image_gtab1ngtab1ngtab.png";

function Homepage() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const session = sessionStorage.getItem("login_info");

    

    if (session) {
      const parsed = JSON.parse(session);
      const loginSessionId = parsed.login_session;


      // 🔥 Panggil API logout
      await logoutUser(loginSessionId);
    }

    // Hapus session
    sessionStorage.removeItem("login_info");

    // Redirect ke login
    navigate("/");
  };

  return (
    <div id="Homepage">
      <div id="logo-box">
        <img src={logo} alt="Logo" />
      </div>
      <div id="menu-box">
        <button  onClick={handleLogout}><i className="bi bi-box-arrow-left"></i></button>
        <button onClick={() => navigate("/cashier")}>Cashier</button>
        <button>Point-Of-Sale</button>
      </div>

    </div>
  );
}

export default Homepage;
