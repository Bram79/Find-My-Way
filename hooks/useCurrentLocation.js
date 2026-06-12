import { useEffect, useState } from "react";
import { Platform } from "react-native";
import * as Device from "expo-device";
import * as Location from "expo-location";

export function useCurrentLocation() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    let subscription = null;

    async function run() {
      if (Platform.OS === "android" && !Device.isDevice) {
        setErrorMsg(
          "Oops, this will not work on Snack in an Android Emulator. Try it on your device!"
        );
        return;
      }

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          distanceInterval: 2,
        },
        setLocation
      );
    }

    run();
    return () => {
      subscription?.remove();
    };
  }, []);

  return { location, errorMsg };
}
