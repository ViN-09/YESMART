import React from "react";
import { useNavigate } from "react-router-dom";

export default function ButtonRoute({
  iconClass = "bi bi-circle", // default Bootstrap icon
  text = "",
  bgColor = "#f35525",        // background button
  textColor = "#fff",          // text color
  route = "/",                 // route tujuan
  disabled = false,
  style = {}                   // tambahan styling inline
}) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (disabled) return;
    navigate(route);
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      style={{
        backgroundColor: bgColor,
        color: textColor,
        border: "none",
        borderRadius: "8px",
        padding: "8px 16px",
        cursor: disabled ? "not-allowed" : "pointer",
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        fontSize: "16px",
        transition: "all 0.2s ease",
        ...style
      }}
   // optional, kalau mau styling default bootstrap
    >
      <i className={iconClass}></i>
      {text}
    </button>
  );
}
