import { StyleSheet } from "react-native";

export const searchStyles = StyleSheet.create({
  // Zwevende balk bovenaan (niet-actief).
  wrap: {
    position: "absolute",
    top: 60,
    left: 16,
    right: 16,
  },
  // Volledig scherm (actief: tijdens zoeken/typen).
  wrapActive: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: 50,
    paddingHorizontal: 10,
    backgroundColor: "white",
    zIndex: 10,
    elevation: 10,
  },
  textInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    paddingLeft: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  // In actieve modus: vlak, geen schaduw, met een lijntje onderaan.
  textInputContainerActive: {
    borderRadius: 0,
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingLeft: 4,
  },
  leftButton: {
    paddingHorizontal: 6,
    height: 50,
    justifyContent: "center",
  },
  clearButton: {
    paddingHorizontal: 12,
    height: 50,
    justifyContent: "center",
  },
  textInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    backgroundColor: "transparent",
    color: "#222",
  },
  listView: {
    backgroundColor: "white",
    borderRadius: 12,
    marginTop: 8,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  // In actieve modus: lijst vult de rest van het scherm.
  listViewActive: {
    flex: 1,
    marginTop: 0,
    borderRadius: 0,
    elevation: 0,
    shadowOpacity: 0,
  },
  rowContainer: {
    padding: 0,
    backgroundColor: "transparent",
  },
  recentHeader: {
    fontSize: 13,
    color: "#999",
    fontWeight: "600",
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  rowIcon: {
    marginRight: 14,
  },
  rowText: {
    flex: 1,
  },
  rowMain: {
    fontSize: 16,
    color: "#222",
    fontWeight: "500",
  },
  rowSecondary: {
    fontSize: 13,
    color: "#888",
    marginTop: 2,
  },
  separator: {
    height: 1,
    backgroundColor: "#eee",
    marginLeft: 50,
  },
});
