import React from "react";
import { useNavigate } from "react-router-dom";
import "./HomeLanding.css";

export default function HomeLanding() {
  const navigate = useNavigate();

  return (
    <div className="home-landing">
      <h1 className="home-title">Welcome to Doc Finder</h1>
      <p className="home-subtitle">Choose how you want to proceed</p>
      <div className="home-buttons">
        <button className="home-btn" onClick={() => navigate("/doctor")}>
          Enter as Doctor
        </button>
        <button className="home-btn" onClick={() => navigate("/patient")}>
          Enter as Patient
        </button>
      </div>
    </div>
  );
}
