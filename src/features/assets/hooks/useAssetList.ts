import { useEffect, useState } from "react";
import { useAssetStore } from "../store";
import { IAssetFirebaseResponse } from "../types";

type TAssetList = IAssetFirebaseResponse & {
  id: string;
};

export default function useAssetList() {
  const [assetList, setAssetList] = useState<TAssetList[]>([]);

  const { assetDocument } = useAssetStore();

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
