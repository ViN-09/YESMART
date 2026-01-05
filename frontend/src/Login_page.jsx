import { useState } from 'react';
import './Login_page.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { checkUser } from "./API";

function Login_page() {
  const [showPass, setShowPass] = useState(false);
  const [id, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const data = await checkUser(id, password);

      if (data.status === true) {

        Swal.fire({
          icon: "success",
          title: "Login Berhasil!",
          text: "Selamat datang kembali 😎",
          timer: 1500,
          showConfirmButton: false
        });
      
        // Simpan session
        sessionStorage.setItem("login_info", JSON.stringify(data.login_info));
      
        // Arahkan ke halaman home_page setelah delay Swal
        setTimeout(() => {
          navigate("/home_page");
        }, 1500); // sama dengan timer Swal
      } else {
        Swal.fire({
          icon: "error",
          title: "Login gagal",
          text: data.message || "ID atau password salah!"
        });
      }

    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Tidak dapat terhubung ke server!"
      });
    }
  };

  return (
    <div className="login-wrapper">
      
      <div className="left-side">
        <img 
          src="https://images.unsplash.com/photo-1519389950473-47ba0277781c"
          className="bg-image"
          alt="background"
        />
        <div className="overlay"></div>
      </div>

      <div className="right-side">
        <div className="form-box fade-in">
          <h2 className="title">Welcome Back</h2>
          <p className="subtitle">Silakan login untuk melanjutkan</p>

          <div className="input-group">
            <input 
              type="text" 
              className="input" 
              placeholder="ID"
              value={id}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="input-group">
            <input
              type={showPass ? "text" : "password"}
              className="input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span className="toggle-pass" onClick={() => setShowPass(!showPass)}>
              {showPass ? (
                <i className="bi bi-eye-slash"></i>
              ) : (
                <i className="bi bi-eye"></i>
              )}
            </span>
          </div>

          <button className="btn-login" onClick={handleLogin}>
            LOGIN
          </button>

        </div>
      </div>

    </div>
  );
}

export default Login_page;
