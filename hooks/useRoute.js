import { useEffect, useState } from "react";
import polyline from "@mapbox/polyline";

const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

export function useRoute(location, destination, travelMode, mapRef) {
  const [routeCoords, setRouteCoords] = useState([]);
  const [duration, setDuration] = useState(null);

  useEffect(() => {
    if (!location || !destination) return;
    fetchRoute();
  }, [destination, travelMode]);

  async function fetchRoute() {
    const origin = `${location.coords.latitude},${location.coords.longitude}`;
    const destStr = `${destination.latitude},${destination.longitude}`;
    const url =
      `https://maps.googleapis.com/maps/api/directions/json` +
      `?origin=${origin}&destination=${destStr}` +
      `&mode=${travelMode}&language=nl&key=${GOOGLE_API_KEY}`;

    try {
      const res = await fetch(url);
      const json = await res.json();
      if (json.status === "OK" && json.routes.length) {
        setDuration(json.routes[0].legs[0].duration.text);

        const points = json.routes[0].legs[0].steps.flatMap((step) =>
          polyline.decode(step.polyline.points)
        );
        setRouteCoords(
          points.map((point) => ({ latitude: point[0], longitude: point[1] }))
        );
      } else {
        setDuration(null);
        setRouteCoords([]);
      }
    } catch (e) {
      setDuration(null);
      setRouteCoords([]);
    }

    mapRef.current?.fitToCoordinates(
      [
        {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
        { latitude: destination.latitude, longitude: destination.longitude },
      ],
      {
        edgePadding: { top: 160, right: 60, bottom: 180, left: 60 },
        animated: true,
      }
    );
  }

  return { routeCoords, duration };
}
