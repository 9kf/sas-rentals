import { Calendar, CalendarProps } from "react-native-calendars";

interface IRNCalendarProps extends CalendarProps {}

export function RNCAlendars(props: IRNCalendarProps) {
  return (
    <Calendar
      theme={{
        calendarBackground: "#transparent",
        backgroundColor: "#transparent",
        arrowColor: "#EC9110",
        todayTextColor: "#EC9110",
      }}
      enableSwipeMonths
      {...props}
    />
  );
}
