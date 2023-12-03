import {
  scheduleNotificationAsync,
  cancelScheduledNotificationAsync,
} from "expo-notifications";

const TARGET_HOUR = 7;
const TARGET_MINUTE = 0;

type TNotificationContentType = {
  targetDate: Date;
  assetName: string;
  assetId: string;
  customerName: string;
};

export function useNotificationService() {
  async function scheduleDeliveryNotification({
    assetId,
    assetName,
    targetDate,
    customerName,
  }: TNotificationContentType) {
    const timeToTarget = new Date(
      targetDate.getFullYear(),
      targetDate.getMonth(),
      targetDate.getDate(),
      TARGET_HOUR,
      TARGET_MINUTE
    );

    const deliveryNotification = await scheduleNotificationAsync({
      content: {
        title: `Rental for ${assetName} today!`,
        body: `${customerName} scheduled a rental for a ${assetName} today. Deliver the asset and set the status to delivered on the app.`,
        autoDismiss: true,
      },
      identifier: `${assetId}${targetDate.toISOString()}rental`,
      trigger: {
        date: timeToTarget,
      },
    });
  }

  async function scheduleReturnNotification({
    assetId,
    assetName,
    targetDate,
    customerName,
  }: TNotificationContentType) {
    const timeToTarget = new Date(
      targetDate.getFullYear(),
      targetDate.getMonth(),
      targetDate.getDate(),
      TARGET_HOUR,
      TARGET_MINUTE
    );
    const returnNotification = await scheduleNotificationAsync({
      content: {
        title: `Retrieval notice for ${assetName} today!`,
        body: `${customerName}\`s rental for a ${assetName} ends today. Retrieve the asset and set the status to returned on the app.`,
        autoDismiss: true,
      },
      identifier: `${assetId}${targetDate.toISOString()}rental`,
      trigger: {
        date: timeToTarget,
      },
    });
  }

  async function schedulePaymentNotification({
    assetId,
    assetName,
    targetDate,
    customerName,
  }: TNotificationContentType) {
    const timeToTarget = new Date(
      targetDate.getFullYear(),
      targetDate.getMonth(),
      targetDate.getDate(),
      TARGET_HOUR,
      TARGET_MINUTE
    );
    const paymentNotification = await scheduleNotificationAsync({
      content: {
        title: `Payment notice for ${assetName} today!`,
        body: `${customerName}\`s rental for a ${assetName} ends today. Remind them of the payment due for the rental and set the payment status to paid in the app.`,
        autoDismiss: true,
      },
      identifier: `${assetId}${targetDate.toISOString()}payment`,
      trigger: {
        date: timeToTarget,
      },
    });
  }

  async function scheduleLatePaymentNotification({
    assetId,
    assetName,
    targetDate,
    customerName,
  }: TNotificationContentType) {
    const timeToTarget = new Date(
      targetDate.getFullYear(),
      targetDate.getMonth(),
      targetDate.getDate(),
      TARGET_HOUR,
      TARGET_MINUTE
    );
    const latePaymentNotification = await scheduleNotificationAsync({
      content: {
        title: `Late payment notice for ${assetName}.`,
        body: `${customerName}\`s rental for a ${assetName} ended a week ago and still hasn't paid. Remind them of the payment due for the rental and set the payment status to paid in the app.`,
        autoDismiss: true,
      },
      identifier: `${assetId}${targetDate.toISOString()}payment`,
      trigger: {
        date: timeToTarget,
      },
    });
  }

  async function removeNotification(identifiers: string | string[]) {
    if (typeof identifiers === "string") {
      await cancelScheduledNotificationAsync(identifiers);
      return;
    }

    for (const identifier of identifiers) {
      await cancelScheduledNotificationAsync(identifier);
    }
  }

  return {
    scheduleDeliveryNotification,
    scheduleReturnNotification,
    schedulePaymentNotification,
    scheduleLatePaymentNotification,
    removeNotification,
  };
}
