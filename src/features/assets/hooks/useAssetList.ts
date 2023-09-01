import { useEffect, useState } from "react";
import { useAssetService } from "../service";
import { IAssetFirebaseResponse } from "../types";

export type TAssetList = IAssetFirebaseResponse & {
  id: string;
};

export function useAssetList() {
  const [assetList, setAssetList] = useState<TAssetList[]>([]);

  const { assetDocument } = useAssetService();

  useEffect(() => {
    const subscriber = assetDocument.orderBy("createdDate", "asc").onSnapshot({
      next(snapshot) {
        const newAssetList = snapshot.docs.map((doc) => {
          return { ...(doc.data() as IAssetFirebaseResponse), id: doc.id };
        }) as TAssetList[];

        setAssetList(newAssetList);
      },
    });

    return () => subscriber();
  }, []);

  return {
    assetList,
  };
}
