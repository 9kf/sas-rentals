import {
  TouchableWithoutFeedback,
  View,
  Text,
  TouchableNativeFeedback,
} from "react-native";
import { StatusBar } from "expo-status-bar";

import useTheme from "../../theme/useTheme";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamsList } from "../../utils/types";
import { StackNavigationProp } from "@react-navigation/stack";
import { useState } from "react";

export interface IConfirmDeleteModalProps {
  route: RouteProp<RootStackParamsList, "confirm-delete-modal">;
  navigation: StackNavigationProp<RootStackParamsList, "confirm-delete-modal">;
}

export default function ConfirmDeleteModal({
  route,
  navigation,
}: IConfirmDeleteModalProps) {
  const { containerStyles, textStyles, buttonStyles } = useTheme();
  const {
    params: { confirmationMessage, onPressDelete, title },
  } = route;

  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleDelete() {
    setIsSubmitting(true);
    onPressDelete?.();
    setIsSubmitting(false);
  }

  return (
    <TouchableWithoutFeedback onPress={navigation.goBack}>
      <View style={containerStyles.defaultModalBackdrop}>
        <StatusBar style="auto" />
        <View style={containerStyles.defaultModalContainer}>
          <Text style={textStyles.modalTitle}>{title}</Text>
          <View style={{ marginVertical: 6 }} />
          <Text style={textStyles.modalDescription}>{confirmationMessage}</Text>
          <View style={{ marginVertical: 16 }} />
          <TouchableNativeFeedback
            onPress={handleDelete}
            disabled={isSubmitting}
          >
            <View
              style={{
                ...containerStyles.centerAll,
                ...(isSubmitting
                  ? buttonStyles.disabled
                  : buttonStyles.destructive),
              }}
            >
              <Text style={textStyles.buttonText}>Delete</Text>
            </View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback
            onPress={navigation.goBack}
            disabled={isSubmitting}
          >
            <View
              style={{
                ...containerStyles.centerAll,
                ...(isSubmitting ? buttonStyles.disabled : buttonStyles.cancel),
                marginTop: 8,
              }}
            >
              <Text style={textStyles.buttonText}>Cancel</Text>
            </View>
          </TouchableNativeFeedback>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
