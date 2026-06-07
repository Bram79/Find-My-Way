import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },

  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 28,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: -2 },
  },
  startButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 26,
    paddingVertical: 11,
    paddingHorizontal: 22,
  },
  startText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
    marginLeft: 8,
  },
  durationBox: {
    flexDirection: "row",
    alignItems: "center",
  },
  durationText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#222",
    marginLeft: 6,
  },
  errorBox: {
    position: "absolute",
    top: 60,
    left: 20,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 12,
    borderRadius: 8,
  },
  errorText: {
    color: "white",
    textAlign: "center",
  },
});
