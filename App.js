import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";

import MapView, { Marker, Polyline } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";

import { styles } from "./styles";
import SearchBar from "./SearchBar";
import { useCurrentLocation } from "./hooks/useCurrentLocation";
import { useHeading } from "./hooks/useHeading";
import { useRoute } from "./hooks/useRoute";

const TRAVEL_MODES = [
  { key: "driving", label: "auto", icon: "car" },
  { key: "bicycling", label: "fiets", icon: "bicycle" },
  { key: "walking", label: "lopend", icon: "walk" },
];

export default function App() {
  const [destination, setDestination] = useState(null);
  const [travelMode, setTravelMode] = useState("walking");
  const [navigating, setNavigating] = useState(false);
  const [puckPos, setPuckPos] = useState(null);
  const [mapHeading, setMapHeading] = useState(0);

  const mapRef = useRef(null);

  const { location, errorMsg } = useCurrentLocation();
  const { routeCoords, duration } = useRoute(
    location,
    destination,
    travelMode,
    mapRef
  );
  const heading = useHeading(navigating);

  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  function centerOnUser() {
    mapRef.current?.animateCamera(
      {
        center: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
        heading: heading,
        zoom: 18,
        altitude: 300,
      },
      { duration: 800 }
    );
  }

  function startNavigation() {
    setNavigating(true);
    centerOnUser();
  }

  function stopNavigation() {
    setNavigating(false);
  }

  function updatePuckPosition() {
    if (!navigating || !location || !mapRef.current) return;

    mapRef.current
      .pointForCoordinate({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      })
      .then(setPuckPos)
      .catch(() => {});

    mapRef.current
      .getCamera()
      .then((camera) => setMapHeading(camera.heading))
      .catch(() => {});
  }

  useEffect(() => {
    updatePuckPosition();
  }, [location, navigating]);

  return (
    <View style={styles.container}>
      {location && (
        <MapView
          ref={mapRef}
          style={styles.map}
          showsUserLocation={!navigating}
          showsMyLocationButton={false}
          showsCompass={false}
          onRegionChange={updatePuckPosition}
          onRegionChangeComplete={updatePuckPosition}
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

      {navigating && (
        <View pointerEvents="none" style={styles.puckOverlay}>
          <View
            style={[
              styles.puck,
              {
                position: "absolute",
                left: (puckPos?.x ?? width / 2) - 19,
                top: (puckPos?.y ?? height / 2) - 19,
                transform: [{ rotate: `${heading - mapHeading}deg` }],
              },
            ]}
          >
            <Ionicons
              name="navigate"
              size={22}
              color="#4285F4"
              style={styles.puckArrow}
            />
          </View>
        </View>
      )}

      {!navigating && (
        <SearchBar onSelect={setDestination} isLandscape={isLandscape} />
      )}

      {destination && duration && !navigating && (
        <>
          <View
            style={[styles.modeRow, isLandscape && styles.modeRowLandscape]}
          >
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
          <View
            style={[styles.bottomBar, isLandscape && styles.bottomBarLandscape]}
          >
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

      {navigating && (
        <TouchableOpacity
          style={[
            styles.centerButton,
            isLandscape && styles.centerButtonLandscape,
          ]}
          onPress={centerOnUser}
        >
          <Ionicons name="navigate" size={22} style={styles.puckArrow} />
          <Text style={styles.centerText}>Centreren</Text>
        </TouchableOpacity>
      )}

      {navigating && (
        <View
          style={[styles.bottomBar, isLandscape && styles.bottomBarLandscape]}
        >
          <TouchableOpacity style={styles.stopButton} onPress={stopNavigation}>
            <Ionicons name="close" size={18} color="#e53935" />
            <Text style={styles.stopText}>Stoppen</Text>
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
      )}

      {errorMsg && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{errorMsg}</Text>
        </View>
      )}
    </View>
  );
}
