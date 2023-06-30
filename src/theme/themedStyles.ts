import { StyleService } from "@ui-kitten/components";
import { Dimensions, StyleSheet } from "react-native";

export const ThemedContainerStyles = StyleService.create({
  defaultPageStyle: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "neutral",
    height: "100%",
    padding: 16,
  },
  verticalCenterAlign: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  rowCenterAlign: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  centerAll: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  twoColumnRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  twoColumnCol: {
    flexBasis: "48%",
    flexShrink: 0,
    zIndex: 10,
  },
  cardContainer: {
    width: "100%",
    padding: 12,
    borderRadius: 8,
    overflow: "hidden",
    elevation: 4,
  },
  defaultModalBackdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  defaultModalContainer: {
    backgroundColor: "white",
    width: "100%",
    padding: 12,
    borderRadius: 4,
  },
  toastLayoutContainer: {
    position: "absolute",
    width: "100%",
    paddingHorizontal: 32,
    bottom: Dimensions.get("screen").height * 0.08,
  },
  toastContainer: {
    backgroundColor: "white",
    borderRadius: 8,
    elevation: 8,
    padding: 12,
  },
});

export const ThemedTextStyles = StyleService.create({
  title: {
    fontWeight: "normal",
    color: "shade1",
    fontSize: 32,
    lineHeight: 37.5,
  },
  fieldLabel: {
    fontWeight: "300",
    color: "primary",
    fontSize: 12,
    lineHeight: 16,
  },
  fieldError: {
    fontWeight: "300",
    color: "red",
    fontSize: 12,
    lineHeight: 16,
  },
  required: {
    fontWeight: "300",
    color: "red",
    fontSize: 12,
    lineHeight: 16,
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  cardTitle: {
    fontWeight: "500",
    fontSize: 16,
    lineHeight: 18,
    color: "primary",
  },
  cardFieldLabel: {
    fontWeight: "300",
    fontSize: 12,
    lineHeight: 14,
    color: "primary",
  },
  cardFieldValue: {
    fontWeight: "500",
    fontSize: 12,
    lineHeight: 14,
    color: "primary",
  },
  largeTitle: {
    fontWeight: "500",
    fontSize: 24,
    lineHeight: 28,
    color: "primary",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "400",
    lineHeight: 20,
    color: "primary",
  },
  modalDescription: {
    fontSize: 12,
    fontWeight: "normal",
    lineHeight: 12,
    color: "primary",
  },
  toastTitle: {
    fontWeight: "600",
    fontSize: 16,
    lineHeight: 16,
    color: "white",
  },
  toastMessage: {
    fontWeight: "normal",
    fontSize: 10,
    lineHeight: 10,
    color: "white",
  },
});

export const ThemedInputStyles = StyleService.create({
  textInput: {
    height: 40,
    borderWidth: 1,
    borderColor: "primary",
    borderRadius: 8,
    width: "100%",
    padding: 8,
    fontWeight: "normal",
    color: "black",
    fontSize: 14,
    lineHeight: 14,
  },
  multilineTextInput: {
    minHeight: 100,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: "primary",
    borderRadius: 8,
    width: "100%",
    padding: 8,
    fontWeight: "normal",
    color: "black",
    fontSize: 14,
    lineHeight: 14,
  },
  dropdownInput: {
    height: 40,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderWidth: 1,
    borderColor: "primary",
    borderRadius: 8,
    padding: 8,
  },
});

export const ThemedButtonStyles = StyleService.create({
  uploadButton: {
    backgroundColor: "upload",
    borderRadius: 8,
    paddingVertical: 8,
    height: 40,
  },
  cta: {
    backgroundColor: "cta",
    borderRadius: 8,
    paddingVertical: 8,
    height: 40,
  },
  destructive: {
    backgroundColor: "destructive",
    borderRadius: 8,
    paddingVertical: 8,
    height: 40,
  },
  cancel: {
    backgroundColor: "darkgray",
    borderRadius: 8,
    paddingVertical: 8,
    height: 40,
  },
  disabled: {
    backgroundColor: "lightgray",
    borderRadius: 8,
    paddingVertical: 8,
    height: 40,
  },
});

// const styles = StyleSheet.create({
//     verticalAlign: {
//         al
//     }
// })
