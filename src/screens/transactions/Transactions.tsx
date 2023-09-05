import { View, Text, ScrollView } from "react-native";
import useTheme from "../../theme/useTheme";
import { useTransactions } from "../../features/transactions";
import { RentalCard } from "../../features/scheduling";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamsList } from "../../utils/types";
import { StackNavigationProp } from "@react-navigation/stack";

export interface ITransactionProps {
  route: RouteProp<RootStackParamsList, "transactions">;
  navigation: StackNavigationProp<RootStackParamsList, "transactions">;
}

export default function Transactions({ navigation, route }: ITransactionProps) {
  const { containerStyles, textStyles } = useTheme();
  const {
    transactionList,
    overallGrossProfit,
    overallNetProfit,
    overallExpenses,
  } = useTransactions();

  return (
    <View style={containerStyles.defaultPageStyle}>
      <View style={{ gap: 8, marginBottom: 24 }}>
        <Text
          style={textStyles.formSection}
        >{`Overall Gross Profit: ${overallGrossProfit}`}</Text>
        <Text
          style={textStyles.formSection}
        >{`Overall Expenses: ${overallExpenses}`}</Text>
        <Text
          style={textStyles.formSection}
        >{`Overall Net Profit: ${overallNetProfit}`}</Text>
      </View>
      <ScrollView>
        {transactionList.map((transaction) => (
          <RentalCard
            key={transaction.id}
            {...transaction}
            onClickCard={() =>
              navigation.push("rental-details", {
                rentalDetails: transaction,
              })
            }
          />
        ))}
      </ScrollView>
    </View>
  );
}
