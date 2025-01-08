import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import L from "leaflet";
import "leaflet-geosearch/dist/geosearch.css";
import { toast } from "react-toastify";

interface LocationSelectorProps {
  onLocationSelect: (
    latLng: { lat: number; lng: number },
    address: string
  ) => void;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
  onLocationSelect,
}) => {
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [address, setAddress] = useState<string>("");

  const LocationFinder = () => {
    useMapEvents({
      click(e: L.LeafletMouseEvent) {
        e.originalEvent.stopPropagation();
        setPosition(e.latlng);
        fetchAddress(e.latlng.lat, e.latlng.lng);
      },
    });

    const fetchAddress = async (lat: number, lng: number) => {
      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=en`
        );
        if (response.data) {
          const address = response.data.display_name;
          setAddress(address);
          onLocationSelect({ lat, lng }, address);
        } else {
          setAddress("Address not found");
        }
      } catch (error) {
        console.error("Error fetching address:", error);
        setAddress("Error fetching address");
      }
    };

    return position === null ? null : (
      <Marker position={position}>
        <Popup>{address}</Popup>
      </Marker>
    );
  };

  const SearchControl = () => {
    const map = useMap();

    useEffect(() => {
      const searchInput = L.DomUtil.create(
        "input",
        "search-input"
      ) as HTMLInputElement;
      searchInput.type = "text";
      searchInput.placeholder = "Search for a location";
      searchInput.className =
        "search-input h-10 p-2 border rounded-l-md focus:outline-none";

      const searchButton = L.DomUtil.create("button", "search-button");
      searchButton.innerHTML = "Search";
      searchButton.className =
        "search-button h-10 bg-blue-500 text-white p-2 rounded-r-md hover:bg-blue-600 focus:outline-none";

      const searchContainer = L.DomUtil.create("div", "search-container");
      searchContainer.className =
        "search-container flex items-center space-x-2 bg-white p-2 rounded-md shadow-md";
      searchContainer.appendChild(searchInput);
      searchContainer.appendChild(searchButton);

      L.DomUtil.addClass(searchContainer, "leaflet-control");
      L.DomUtil.addClass(searchContainer, "leaflet-bar");
      L.DomUtil.addClass(searchContainer, "leaflet-control-custom");

      const handleSearchClick = (event: MouseEvent) => {
        event.stopPropagation();
        const query = searchInput.value;
        if (query) {
          searchLocation(query);
        }
      };

      const handleSearchKeydown = (event: KeyboardEvent) => {
        event.stopPropagation();
        if (event.key === "Enter") {
          const query = searchInput.value;
          if (query) {
            searchLocation(query);
          }
        }
      };

      L.DomEvent.on(searchButton, "click", handleSearchClick as EventListener);
      L.DomEvent.on(
        searchInput,
        "keydown",
        handleSearchKeydown as EventListener
      );

      L.DomEvent.disableClickPropagation(searchContainer);

      const searchLocation = async (query: string) => {
        try {
          const response = await axios.get(
            `https://nominatim.openstreetmap.org/search?format=json&q=${query}&accept-language=en`
          );
          if (response.data.length > 0) {
            const result = response.data[0];
            const lat = parseFloat(result.lat);
            const lng = parseFloat(result.lon);
            const address = result.display_name;

            setPosition({ lat, lng });
            setAddress(address);
            onLocationSelect({ lat, lng }, address);

            map.setView([lat, lng], 13);
          } else {
            toast.error("Location not found");
          }
        } catch (error) {
          console.error("Error searching for location:", error);
          toast.error("Error searching for location");
        }
      };

      const customControl = L.Control.extend({
        onAdd: () => {
          return searchContainer;
        },
        onRemove: () => {},
      });

      const searchControl = new customControl({ position: "topright" });
      map.addControl(searchControl);

      return () => {
        map.removeControl(searchControl);
      };
    }, [map]);

    return null;
  };

  return (
    <div className="location-selector" onClick={(e) => e.stopPropagation()}>
      <MapContainer
        center={[51.505, -0.09]}
        zoom={13}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationFinder />
        <SearchControl />
      </MapContainer>
      {position && (
        <div className="location-info mt-4">
          <h3 className="text-lg font-semibold">Selected Location</h3>
          <p className="text-sm">
            Latitude: {position.lat}, Longitude: {position.lng}
          </p>
        </div>
      )}
    </div>
  );
};

export default LocationSelector;
