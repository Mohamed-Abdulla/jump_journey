import { StyleSheet, Text, View } from "react-native";
import CalendarPicker from "react-native-calendar-picker";

import { useGlobalContext } from "@/context/global-provider";
import { getQuote } from "@/lib/utils";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TabTwoScreen() {
  const { user, fetchActivities, activities, loading } = useGlobalContext();

  const quote = getQuote(Number(activities?.totalCount) || 0);

  return (
    <SafeAreaView className="h-full p-4 space-y-4">
      <Text className="text-3xl font-bold mb-6 text-center">Jump Rope Activities</Text>
      <CalendarPicker
        selectedDayColor="#FF9C01"
        selectedDayTextColor="#ffffff"
        onDateChange={(date) => {
          fetchActivities(date.toDateString(), user);
        }}
      />
      {loading ? (
        <Text className="text-base font-pregular py-2 text-center">Loading...</Text>
      ) : (
        <View className="">
          {!activities ? (
            <Text className="text-base font-pregular py-2 text-center">
              No activities found for the selected date 😕
            </Text>
          ) : (
            <>
              <View className="w-full border rounded-md border-slate-200 p-4 space-y-2">
                <View className="flex flex-row justify-between">
                  <Text className="text-base font-medium">Total Count</Text>
                  <Text className="text-base">{activities?.totalCount || 0}</Text>
                </View>
                <View className="flex flex-row justify-between">
                  <Text className="text-base font-medium">Set Count</Text>
                  <Text className="text-base">{activities?.setCount || 0}</Text>
                </View>
                <View className="flex flex-row justify-between">
                  <Text className="text-base font-medium">Rep Count</Text>
                  <Text className="text-base">{activities?.repCount || 0}</Text>
                </View>
              </View>
              <Text className="text-base font-pregular text-center pt-4">{quote}</Text>
            </>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});
