import { useEffect, useMemo, useState } from "react";
import { IRentalScheduleFirebaseResponse } from "../../scheduling/types";
import { useRentalSchedulingService } from "../../scheduling/service";
import { PAYMENT_STATUS_OPTIONS } from "../../../utils/contstants";

export function useTransactions() {
  const { rentalScheduleDocument } = useRentalSchedulingService();

  const [transactionList, setTransacactionList] = useState<
    IRentalScheduleFirebaseResponse[]
  >([]);

  const overallNetProfit = useMemo(() => {
    const value = transactionList.reduce((acc, transaction) => {
      if (transaction.paymentStatus.id === PAYMENT_STATUS_OPTIONS[1].id) {
        return (acc += transaction.netProfit);
      }

      return acc;
    }, 0);

    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "PHP",
    }).format(value);
  }, [transactionList]);

  const overallGrossProfit = useMemo(() => {
    const value = transactionList.reduce((acc, transaction) => {
      if (transaction.paymentStatus.id === PAYMENT_STATUS_OPTIONS[1].id) {
        return (acc += transaction.expectedPayment);
      }

      return acc;
    }, 0);

    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "PHP",
    }).format(value);
  }, [transactionList]);

  const overallExpenses = useMemo(() => {
    const value = transactionList.reduce((accTransaction, transaction) => {
      const totalExpenseInThisTransaction = transaction.expenses.reduce(
        (accExpenses, expense) => (accExpenses += parseFloat(expense.value)),
        0
      );

      return (accTransaction += totalExpenseInThisTransaction);
    }, 0);

    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "PHP",
    }).format(value);
  }, [transactionList]);

  useEffect(() => {
    const subscriber = rentalScheduleDocument.onSnapshot({
      next(snapshot) {
        const newTransactionList = snapshot.docs.map((doc) => ({
          ...(doc.data() as IRentalScheduleFirebaseResponse),
          id: doc.id,
        })) as IRentalScheduleFirebaseResponse[];

        setTransacactionList(newTransactionList);
      },
    });

    return () => subscriber();
  }, []);

  return {
    transactionList,
    overallNetProfit,
    overallExpenses,
    overallGrossProfit,
  };
}
