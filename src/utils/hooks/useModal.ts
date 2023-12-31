import { useState } from "react";

export function useModal() {
  const [isVisible, setIsVisible] = useState(false);

  const toggleModal = () => {
    setIsVisible(!isVisible);
  };

  const showModal = () => {
    setIsVisible(true);
  };

  const onBackdropPress = () => {
    setIsVisible(false);
  };

  return {
    isVisible,
    toggleModal,
    showModal,
    onBackdropPress,
  };
}
