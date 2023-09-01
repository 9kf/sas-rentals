import { useEffect, useState } from "react";
import { isAvailableAsync, sendSMSAsync } from "expo-sms";

import { useRentalSchedulingService } from "../../scheduling/service";
import { IRentalScheduleFirebaseResponse } from "../../scheduling/types";
import { TCustomer } from "../types";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamsList } from "../../../utils/types";
import { useCustomerService } from "../service";
import { useToast } from "../../../components";

export function useCustomerCard({
  id,
  address,
  contactNumbers,
  name,
  navigation,
}: TCustomer & {
  navigation: StackNavigationProp<RootStackParamsList, "customers">;
}) {
  const { getRentalByCustomerID } = useRentalSchedulingService();
  const { deleteCustomer } = useCustomerService();
  const showToast = useToast((state) => state.showToast);

  const [customerRentals, setCustomerRentals] = useState<
    IRentalScheduleFirebaseResponse[]
  >([]);
  const [canDelete, setCanDelete] = useState(false);

  useEffect(() => {
    getCustomerRentals();
    determineCanDelete();
  }, []);

  async function getCustomerRentals() {
    const response = await getRentalByCustomerID(id!, 3);

    if (response) {
      const rentals = response.docs.map(
        (doc) =>
          ({ ...doc.data(), id: doc.id } as IRentalScheduleFirebaseResponse)
      );
      setCustomerRentals(rentals);
    }
  }

  async function determineCanDelete() {
    const response = await getRentalByCustomerID(id!);

    if (response?.docs.length === 0) {
      setCanDelete(true);
      return;
    }

    setCanDelete(false);
  }

  async function handleMessageClick() {
    const isAvailable = await isAvailableAsync();
    if (isAvailable) {
      const result = await sendSMSAsync(contactNumbers, "");
    }
  }

  function handleScheduleClick() {
    navigation.push("rental-form", {
      isFromCustomer: true,
      customerDetails: { id, name, address, contactNumbers },
    });
  }

  function handlePencilClick() {
    navigation.push("customer-modal", {
      isUpdate: true,
      customerDetails: { address, name, id, contactNumbers },
    });
  }

  function handleDeleteClick() {
    navigation.push("confirm-delete-modal", {
      confirmationMessage: "Are you sure you want to delete this customer?",
      title: "Confirmation",
      onPressDelete: () => {
        deleteCustomer(
          id || "",
          () => {
            showToast({
              title: "Success",
              message: "Customer has been deleted.",
              type: "success",
            });
            navigation.popToTop();
          },
          (error) => {
            showToast({
              title: "Error",
              message: error,
              type: "error",
            });
            navigation.popToTop();
          }
        );
      },
    });
  }

  return {
    customerRentals,
    canDelete,
    handleMessageClick,
    handleScheduleClick,
    handlePencilClick,
    handleDeleteClick,
  };
}
