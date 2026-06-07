// Breidt app.json uit en injecteert de Google API key uit het .env-bestand.
// Expo laadt .env automatisch, dus process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY
// is hier (build-config) én in de JS-code beschikbaar.
export default ({ config }) => {
  const googleMapsApiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

  return {
    ...config,
    ios: {
      ...config.ios,
      config: {
        ...config.ios?.config,
        googleMapsApiKey,
      },
    },
    android: {
      ...config.android,
      config: {
        ...config.android?.config,
        googleMaps: {
          apiKey: googleMapsApiKey,
        },
      },
    },
  };
};
