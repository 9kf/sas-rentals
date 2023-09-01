import firestore from "@react-native-firebase/firestore";
import { TCustomerFormSchemaType } from "./hooks";

export function useCustomerService() {
  const customerDocument = firestore().collection("Customers");

  async function addCustomer(
    data: TCustomerFormSchemaType,
    onSuccessCallback?: () => void,
    onErrorCallback?: (error: any) => void
  ) {
    try {
      const response = await customerDocument.add(data);

      onSuccessCallback?.();
    } catch (error) {
      onErrorCallback?.(error);
    }
  }

  async function updateCustomer(
    docId: string,
    data: TCustomerFormSchemaType,
    onSuccessCallback: () => void,
    onErrorCallback: (error: any) => void
  ) {
    try {
      const response = await customerDocument.doc(docId).update({
        contactNumbers: data.contactNumbers,
        address: data.address,
      });

      onSuccessCallback?.();
    } catch (error) {
      onErrorCallback?.(error);
    }
  }

  async function deleteCustomer(
    docId: string,
    onSuccessCallback: () => void,
    onErrorCallback: (error: any) => void
  ) {
    try {
      const response = await customerDocument.doc(docId).delete();

      onSuccessCallback?.();
    } catch (error) {
      onErrorCallback?.(error);
    }
  }

  return {
    customerDocument,
    addCustomer,
    updateCustomer,
    deleteCustomer,
  };
}
