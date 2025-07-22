import React, { useState, useCallback } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import axios from "axios";
import "./DoctorForm.css";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 12.9716,
  lng: 77.5946,
};

export default function DoctorForm() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyDpsB3ZGhYmNC2AWotX34Tp87xotnO_ia8",
  });

 
  const [markerPosition, setMarkerPosition] = useState(null);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");

  const onMapClick = useCallback((event) => {
    setMarkerPosition({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!markerPosition) {
      alert("Please select a location on map!");
      return;
    }

    try {
      await axios.post("http://localhost:3000/api/v1/doctor/add", {
        name,
        address,
        coordinates: [markerPosition.lng, markerPosition.lat],
      });
      alert("Clinic added successfully!");
      setName("");
      setAddress("");
      setMarkerPosition(null);
    } catch (error) {
      console.error(error);
      alert("Error saving clinic.");
    }
  };

  if (!isLoaded) {
    return <div>Loading Maps...</div>;
  }

  return (
    <div className="doctor-form-page">
      <h2>Add Your Clinic Location</h2>
      <form className="doctor-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Doctor Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Clinic Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
        <button type="submit" className="btn">Save Clinic</button>
      </form>

      <div className="map-container">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={12}
          onClick={onMapClick}
        >
          {markerPosition && <Marker position={markerPosition} />}
        </GoogleMap>
      </div>
    </div>
  );
}
