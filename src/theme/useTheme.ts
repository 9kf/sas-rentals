import { useStyleSheet } from "@ui-kitten/components";
import {
  ThemedContainerStyles,
  ThemedTextStyles,
  ThemedInputStyles,
  ThemedButtonStyles,
} from "./themedStyles";

export default function useTheme() {
  const containerStyles = useStyleSheet(ThemedContainerStyles);
  const textStyles = useStyleSheet(ThemedTextStyles);
  const inputStyles = useStyleSheet(ThemedInputStyles);
  const buttonStyles = useStyleSheet(ThemedButtonStyles);

  return {
    containerStyles,
    textStyles,
    inputStyles,
    buttonStyles,
  };
}
