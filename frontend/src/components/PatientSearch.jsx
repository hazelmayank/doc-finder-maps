import React, { useState, useEffect, useCallback } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import axios from "axios";
import "./PatientSearch.css";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const defaultCenter = {
  lat: 12.9716,
  lng: 77.5946,
};

export default function PatientSearch() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyDpsB3ZGhYmNC2AWotX34Tp87xotnO_ia8",
  });

  const [currentPosition, setCurrentPosition] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [searchArea, setSearchArea] = useState("");

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setCurrentPosition(coords);
        setMapCenter(coords);
      },
      () => {
        alert("Allow location access for accurate results.");
      }
    );
  }, []);

  const fetchNearbyDoctors = useCallback(async () => {
    if (!currentPosition) return;
    try {
      const res = await axios.get("http://localhost:3000/api/v1/doctor/search", {
        params: {
          lat: currentPosition.lat,
          lng: currentPosition.lng,
        },
      });
      setDoctors(res.data || []);
    } catch (error) {
      console.error(error);
      alert("Error fetching nearby clinics.");
    }
  }, [currentPosition]);

  const handleSearchArea = async () => {
    if (!searchArea) return;
    try {
      const geoRes = await axios.get(
        "https://maps.googleapis.com/maps/api/geocode/json",
        {
          params: {
            address: searchArea,
            key: "AIzaSyDpsB3ZGhYmNC2AWotX34Tp87xotnO_ia8",
          },
        }
      );

      if (
        geoRes.data.status !== "OK" ||
        !geoRes.data.results ||
        geoRes.data.results.length === 0
      ) {
        alert("Location not found");
        return;
      }

      const location = geoRes.data.results[0].geometry.location;
      setMapCenter({ lat: location.lat, lng: location.lng });

      const res = await axios.get("http://localhost:3000/api/v1/doctor/search", {
        params: {
          lat: location.lat,
          lng: location.lng,
        },
      });
      setDoctors(res.data || []);
    } catch (error) {
      console.error(error);
      alert("Error searching clinics by area.");
    }
  };

  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <div className="search-page">
      <h2>Find Nearby Clinics</h2>

      <div className="button-group">
        <button onClick={fetchNearbyDoctors} className="btn">
          🔍 Search Nearby Clinics
        </button>
      </div>

      <div className="area-search">
        <input
          type="text"
          placeholder="Search Area (e.g., JP Nagar)"
          value={searchArea}
          onChange={(e) => setSearchArea(e.target.value)}
        />
        <button onClick={handleSearchArea} className="btn">Search By Area</button>
      </div>

      <div className="map-container">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={mapCenter}
          zoom={12}
        >
          {currentPosition && <Marker position={currentPosition} label="You" />}
          {doctors.map((doc, index) => {
            const coords = doc.clinic?.location?.coordinates;
            if (!coords || coords.length < 2) return null;

            return (
              <Marker
                key={index}
                position={{ lat: coords[1], lng: coords[0] }}
                label={doc.name?.slice(0, 10) || "Clinic"}
              />
            );
          })}
        </GoogleMap>
      </div>

      <h3>Results:</h3>
      <ul className="results-list">
        {doctors.map((doc, index) => (
          <li key={index} className="doctor-card">
            <strong>{doc.name}</strong>
            <br />
            Address: {doc.clinic?.address}
          </li>
        ))}
      </ul>
    </div>
  );
}
