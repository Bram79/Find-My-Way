import { useState, useEffect, useRef } from "react";
import {
  Platform,
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";

import * as Device from "expo-device";
import * as Location from "expo-location";
import MapView, { Marker, Polyline } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import polyline from "@mapbox/polyline";

import { styles } from "./styles";
import SearchBar from "./SearchBar";

const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

const TRAVEL_MODES = [
  { key: "driving", label: "auto", icon: "car" },
  { key: "bicycling", label: "fiets", icon: "bicycle" },
  { key: "walking", label: "lopend", icon: "walk" },
];

export default function App() {
  const [location, setLocation] = useState(null);
  const [destination, setDestination] = useState(null);
  const [duration, setDuration] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);
  const [travelMode, setTravelMode] = useState("walking");

  const mapRef = useRef(null);

  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (destination && location) {
      fetchRoute(destination);
    }
  }, [destination, travelMode]);

  async function getCurrentLocation() {
    if (Platform.OS === "android" && !Device.isDevice) {
      setErrorMsg(
        "Oops, this will not work on Snack in an Android Emulator. Try it on your device!"
      );
      return;
    }
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }

    let current = await Location.getCurrentPositionAsync({});
    setLocation(current);
  }

  async function fetchRoute(dest) {
    const origin = `${location.coords.latitude},${location.coords.longitude}`;
    const destStr = `${dest.latitude},${dest.longitude}`;
    const url =
      `https://maps.googleapis.com/maps/api/directions/json` +
      `?origin=${origin}&destination=${destStr}` +
      `&mode=${travelMode}&language=nl&key=${GOOGLE_API_KEY}`;

    try {
      const res = await fetch(url);
      const json = await res.json();
      if (json.status === "OK" && json.routes.length) {
        setDuration(json.routes[0].legs[0].duration.text);

        const points = polyline.decode(json.routes[0].overview_polyline.points);
        const coords = points.map((point) => ({
          latitude: point[0],
          longitude: point[1],
        }));
        setRouteCoords(coords);
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
        { latitude: dest.latitude, longitude: dest.longitude },
      ],
      {
        edgePadding: { top: 160, right: 60, bottom: 180, left: 60 },
        animated: true,
      }
    );
  }

  function startNavigation() {
    // TODO: hier komt later de echte stap-voor-stap navigatie.
  }

  return (
    <View style={styles.container}>
      {location && (
        <MapView
          ref={mapRef}
          style={styles.map}
          showsUserLocation={true}
          showsMyLocationButton={false}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
        >
          {destination && (
            <Marker
              coordinate={{
                latitude: destination.latitude,
                longitude: destination.longitude,
              }}
              title={destination.name}
            />
          )}

          {routeCoords.length > 0 && (
            <Polyline
              coordinates={routeCoords}
              strokeColor="#4285F4"
              strokeWidth={5}
            />
          )}
        </MapView>
      )}

      <SearchBar onSelect={setDestination} isLandscape={isLandscape} />

      {destination && duration && (
        <>
          <View style={[styles.modeRow, isLandscape && styles.modeRowLandscape]}>
            {TRAVEL_MODES.map((mode) => {
              const active = travelMode === mode.key;
              return (
                <TouchableOpacity
                  key={mode.key}
                  style={[styles.pill, active && styles.pillActive]}
                  onPress={() => setTravelMode(mode.key)}
                >
                  <Text
                    style={[styles.pillText, active && styles.pillTextActive]}
                  >
                    {mode.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={[styles.bottomBar, isLandscape && styles.bottomBarLandscape]}>
            <TouchableOpacity
              style={styles.startButton}
              onPress={startNavigation}
            >
              <Ionicons name="navigate" size={18} color="#000000" />
              <Text style={styles.startText}>Starten</Text>
            </TouchableOpacity>
            <View style={styles.durationBox}>
              <Ionicons
                name={
                  TRAVEL_MODES.find((m) => m.key === travelMode)?.icon ?? "walk"
                }
                size={22}
                color="#444"
              />
              <Text style={styles.durationText}>{duration}</Text>
            </View>
          </View>
        </>
      )}

      {errorMsg && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{errorMsg}</Text>
        </View>
      )}
    </View>
  );
}
