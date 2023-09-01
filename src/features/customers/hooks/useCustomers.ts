import { useEffect, useState } from "react";
import { TCustomer } from "../types";
import { useCustomerService } from "../service";

export function useCustomers() {
  const [customerList, setCustomerList] = useState<TCustomer[]>([]);

  const { customerDocument } = useCustomerService();

  useEffect(() => {
    const subscriber = customerDocument.onSnapshot({
      next(snapshot) {
        const newAssetList = snapshot.docs.map((doc) => {
          return { ...(doc.data() as TCustomer), id: doc.id };
        }) as TCustomer[];

        setCustomerList(newAssetList);
      },
    });

    return () => subscriber();
  }, []);

  return {
    customerList,
  };
}
