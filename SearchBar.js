import { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, Keyboard } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

import { searchStyles as s } from "./searchStyles";

const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
const RECENT_KEY = "recentSearches";
const MAX_RECENT = 5;

export default function SearchBar({ onSelect, isLandscape }) {
  const ref = useRef(null);
  const [recents, setRecents] = useState([]);
  const [active, setActive] = useState(false);

  useEffect(() => {
    loadRecents();
  }, []);

  useEffect(() => {
    if (active) {
      const t = setTimeout(() => ref.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [active]);

  async function loadRecents() {
    try {
      const raw = await AsyncStorage.getItem(RECENT_KEY);
      if (raw) setRecents(JSON.parse(raw));
    } catch (e) {}
  }

  async function saveRecent(place) {
    const next = [
      place,
      ...recents.filter((r) => r.description !== place.description),
    ].slice(0, MAX_RECENT);
    setRecents(next);
    try {
      await AsyncStorage.setItem(RECENT_KEY, JSON.stringify(next));
    } catch (e) {}
  }

  function exitSearch() {
    ref.current?.clear();
    ref.current?.blur();
    setActive(false);
    Keyboard.dismiss();
  }

  const predefined = recents.map((r, i) => ({
    ...r,
    isRecent: true,
    showHeader: i === 0,
  }));

  function handlePress(data, details) {
    const loc = details?.geometry?.location || data.geometry?.location;
    if (!loc) return;

    const place = {
      description: data.description || data.structured_formatting?.main_text,
      structured_formatting: data.structured_formatting || {
        main_text: data.description,
        secondary_text: "",
      },
      geometry: { location: { lat: loc.lat, lng: loc.lng } },
    };

    saveRecent(place);
    onSelect({
      latitude: loc.lat,
      longitude: loc.lng,
      name: place.description,
    });
    exitSearch();
  }

  return (
    <View
      style={[
        s.wrap,
        isLandscape && !active && s.wrapLandscape,
        active && s.wrapActive,
      ]}
    >
      <GooglePlacesAutocomplete
        ref={ref}
        placeholder="Zoek hier"
        fetchDetails={true}
        keyboardShouldPersistTaps="handled"
        onPress={handlePress}
        predefinedPlaces={predefined}
        query={{
          key: GOOGLE_API_KEY,
          language: "nl",
          components: "country:nl",
        }}
        enablePoweredByContainer={false}
        textInputProps={{
          onFocus: () => setActive(true),
        }}
        renderLeftButton={() => (
          <TouchableOpacity
            style={s.leftButton}
            onPress={exitSearch}
            disabled={!active}
          >
            <Ionicons
              name={active ? "arrow-back" : "location-sharp"}
              size={22}
              color={active ? "#444" : "#000000"}
            />
          </TouchableOpacity>
        )}
        renderRow={(data) => {
          const main =
            data.structured_formatting?.main_text || data.description;
          const secondary = data.structured_formatting?.secondary_text;
          return (
            <View>
              {data.showHeader && <Text style={s.recentHeader}>Recent</Text>}
              <View style={s.row}>
                <Ionicons
                  name={data.isRecent ? "time-outline" : "location-outline"}
                  size={20}
                  color="#777"
                  style={s.rowIcon}
                />
                <View style={s.rowText}>
                  <Text style={s.rowMain} numberOfLines={1}>
                    {main}
                  </Text>
                  {!!secondary && (
                    <Text style={s.rowSecondary} numberOfLines={1}>
                      {secondary}
                    </Text>
                  )}
                </View>
              </View>
            </View>
          );
        }}
        styles={{
          container: { flex: active ? 1 : 0 },
          textInputContainer: [
            s.textInputContainer,
            active && s.textInputContainerActive,
          ],
          textInput: s.textInput,
          listView: [s.listView, active && s.listViewActive],
          row: s.rowContainer,
          separator: s.separator,
        }}
      />
    </View>
  );
}
