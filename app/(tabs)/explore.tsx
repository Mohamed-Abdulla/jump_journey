import Ionicons from "@expo/vector-icons/Ionicons";
import { Image, Platform, StyleSheet, Text, View } from "react-native";
import CalendarPicker from "react-native-calendar-picker";

import { Collapsible } from "@/components/Collapsible";
import { ExternalLink } from "@/components/ExternalLink";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useGlobalContext } from "@/context/global-provider";
import { addActivity, getActivities } from "@/lib/appwrite";
import { useState } from "react";
import { Models } from "react-native-appwrite";
import { Activities } from "@/types/types";
import { SafeAreaView } from "react-native-safe-area-context";
import { getQuote } from "@/lib/utils";

export default function TabTwoScreen() {
  const { user } = useGlobalContext();

  const [activities, setActivities] = useState<Activities>();
  const [loading, setLoading] = useState(false);

  const quote = getQuote(Number(activities?.totalCount) || 0);

  const fetchActivities = async (date: string) => {
    try {
      setLoading(true);
      const res = await getActivities(user?.accountId, date);
      if (res?.total !== 0) {
        setActivities(res?.documents[0] as Activities);
      } else {
        setActivities(undefined);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="h-full p-4 space-y-4">
      <Text className="text-3xl font-bold mb-6 text-center">Jump Rope Activities</Text>
      <CalendarPicker
        selectedDayColor="#FF9C01"
        selectedDayTextColor="#ffffff"
        onDateChange={(date) => {
          fetchActivities(date.toString());
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
