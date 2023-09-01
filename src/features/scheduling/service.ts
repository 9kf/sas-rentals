import firestore from "@react-native-firebase/firestore";
import { RentalFormSchemaType } from "./hooks";
import { calculateExpectedPayment } from "./helpers";
import { useCustomerService } from "../customers";
import {
  PAYMENT_STATUS_OPTIONS,
  RENTAL_STATUS_OPTIONS,
} from "../../utils/contstants";
import { IRentalScheduleFirebaseResponse } from "./types";
import { useAssetService } from "../assets";

export function useRentalSchedulingService() {
  const rentalScheduleDocument = firestore().collection("Rental Schedule");
  const { customerDocument } = useCustomerService();
  const { assetDocument } = useAssetService();

  async function getMonthsRental(startDate: Date, endDate: Date) {
    return await rentalScheduleDocument
      .orderBy("startDate")
      .orderBy("endDate")
      .startAt(firestore.Timestamp.fromDate(new Date(startDate)))
      .endAt(firestore.Timestamp.fromDate(new Date(endDate)))
      .get();
  }

  async function getRentalByAssetId(assetId: string) {
    try {
      return await rentalScheduleDocument
        .where("asset.id", "==", assetId)
        .get();
    } catch (error) {
      return undefined;
    }
  }

  async function getRentalByCustomerID(customerId: string, limit?: number) {
    try {
      if (limit) {
        return await rentalScheduleDocument
          .where("customer.id", "==", customerId)
          .limit(limit)
          .get();
      }

      return await rentalScheduleDocument
        .where("customer.id", "==", customerId)
        .get();
    } catch (error) {
      return undefined;
    }
  }

  async function scheduleRental(
    data: RentalFormSchemaType,
    onSuccessCallback?: () => void,
    onErrorCallback?: (error: any) => void,
    rentalDocId?: string
  ) {
    let rate;
    switch (data.rateInterval) {
      case "1":
        rate = data.dailyRate;
        break;
      case "2":
        rate = data.weeklyRate;
        break;
      case "3":
        rate = data.monthlyRate;
        break;
      case "4":
        rate = data.yearlyRate;
        break;
    }

    const expectedPayment = calculateExpectedPayment(
      data.rateInterval,
      data.includeSundays,
      new Date(data.startDate),
      new Date(data.endDate),
      parseFloat(data.dailyRate),
      parseFloat(data?.weeklyRate || "0"),
      parseFloat(data?.monthlyRate || "0"),
      parseFloat(data?.yearlyRate || "0"),
      parseFloat(data.mobilizationFee || "0")
    );

    const totalExpenses = data.expenses.reduce(
      (acc, expense) => (acc += parseFloat(expense.value)),
      0
    );
    const netProfit = expectedPayment - totalExpenses;

    try {
      /**
       * Customer document to be saved (Check if name already exists)
       * name
       * contact numbers: string[]
       * address: string
       */

      let customerDoc;

      const response = await customerDocument
        .where("name", "==", data.customerName)
        .get();

      if (response.size === 0) {
        customerDoc = await customerDocument.add({
          name: data.customerName,
          contactNumbers: data.contactNumbers,
          address: data.address,
        });
      } else {
        customerDoc = response.docs[0];
      }

      /**
       * Rental Schedule document to be saved
       * {
       *  asset Id
       *  start date
       *  end date
       *  customer { customer id, customer name, customer contact numbers: string[] }
       *  rate
       *  rate interval
       *  payment status
       *  rental status
       *  expenses
       *  comments
       *  expected payment
       *  net profit
       *  safety deposit
       *  mobilization fee
       *  created date
       *  modified date
       * }
       */

      if (!rentalDocId) {
        const rentalScheduleDoc = await rentalScheduleDocument.add({
          asset: {
            id: data.assetId,
            name: data.assetName,
            color: data.assetColor,
          },
          startDate: firestore.Timestamp.fromDate(new Date(data.startDate)),
          endDate: firestore.Timestamp.fromDate(new Date(data.endDate)),
          customer: {
            id: customerDoc.id,
            name: data.customerName,
            contactNumbers: data.contactNumbers,
          },
          address: data.address,
          dailyRate: data.dailyRate,
          rate,
          rateInterval: data.rateInterval,
          paymentStatus: PAYMENT_STATUS_OPTIONS[0],
          rentalStatus: RENTAL_STATUS_OPTIONS[0],
          expenses: data.expenses,
          comments: data.comments,
          expectedPayment,
          netProfit,
          safetyDeposit: data.safetyDeposit,
          mobilizationFee: data.mobilizationFee,
          createdDate: firestore.FieldValue.serverTimestamp(),
          modifiedDate: firestore.FieldValue.serverTimestamp(),
          includeSundays: data.includeSundays,
        });
      } else {
        const updatedRental = await rentalScheduleDocument
          .doc(rentalDocId)
          .update({
            asset: {
              id: data.assetId,
              name: data.assetName,
              color: data.assetColor,
            },
            startDate: firestore.Timestamp.fromDate(new Date(data.startDate)),
            endDate: firestore.Timestamp.fromDate(new Date(data.endDate)),
            customer: {
              id: customerDoc.id,
              name: data.customerName,
              contactNumbers: data.contactNumbers,
            },
            address: data.address,
            dailyRate: data.dailyRate,
            rate,
            rateInterval: data.rateInterval,
            expenses: data.expenses,
            comments: data.comments,
            expectedPayment,
            netProfit,
            safetyDeposit: data.safetyDeposit,
            mobilizationFee: data.mobilizationFee,
            modifiedDate: firestore.FieldValue.serverTimestamp(),
            includeSundays: data.includeSundays,
          });
      }

      onSuccessCallback?.();
    } catch (error) {
      onErrorCallback?.(error);
    }
  }

  async function updatePaymentStatus(
    rentalId: string,
    paymentStatusId: string,
    onSuccessCallback: () => void,
    onErrorCallback: (error: any) => void
  ) {
    try {
      const paymentStatus = PAYMENT_STATUS_OPTIONS.find(
        (option) => option.id === paymentStatusId
      );
      if (paymentStatus) {
        const response = await rentalScheduleDocument.doc(rentalId).update({
          paymentStatus: paymentStatus,
        });

        onSuccessCallback?.();
      }
    } catch (error) {
      onErrorCallback?.(error);
    }
  }

  async function updateRentalStatus(
    rentalId: string,
    rentalStatusId: string,
    onSuccessCallback: () => void,
    onErrorCallback: (error: any) => void
  ) {
    try {
      const rentalStatus = RENTAL_STATUS_OPTIONS.find(
        (option) => option.id === rentalStatusId
      );
      if (rentalStatus) {
        const response = await rentalScheduleDocument.doc(rentalId).update({
          rentalStatus: rentalStatus,
        });

        onSuccessCallback?.();
      }
    } catch (error) {
      onErrorCallback?.(error);
    }
  }

  async function updateOverallProfit(assetId: string) {
    try {
      const response = await getRentalByAssetId(assetId);
      if (response) {
        const overallProfit = response.docs.reduce((accValue, doc) => {
          const data = doc.data() as IRentalScheduleFirebaseResponse;
          return (accValue += data.netProfit);
        }, 0);

        const updateResponse = await assetDocument.doc(assetId).update({
          overallProfit,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteRental(
    rentalId: string,
    onSuccessCallback?: () => void,
    onErrorCallback?: (error: any) => void
  ) {
    try {
      const response = await rentalScheduleDocument.doc(rentalId).delete();
      onSuccessCallback?.();
    } catch (error) {
      onErrorCallback?.(error);
    }
  }

  return {
    rentalScheduleDocument,
    scheduleRental,
    updatePaymentStatus,
    updateRentalStatus,
    deleteRental,
    getRentalByAssetId,
    getRentalByCustomerID,
    updateOverallProfit,
  };
}
