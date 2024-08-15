import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import RNPickerSelect from "react-native-picker-select";

import { useGlobalContext } from "@/context/global-provider";
import { addActivity, signOut, updateActivity } from "@/lib/appwrite";
import { getCalendarFormat } from "@/lib/utils";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { user, fetchActivities, activities } = useGlobalContext();
  const formattedDate = getCalendarFormat();

  const [setCount, setSetCount] = useState(0);
  const [repCount, setRepCount] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [breakTime, setBreakTime] = useState(30);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [breakTimer, setBreakTimer] = useState(0);
  const [loading, setLoading] = useState(false);

  const breakOptions = [
    { label: "None", value: 0 },
    { label: "30 Sec", value: 30 },
    { label: "1 Min", value: 60 },
    { label: "2 Min", value: 120 },
    { label: "5 Min", value: 300 },
  ];

  useEffect(() => {
    fetchActivities(formattedDate, user);
  }, []);

  useEffect(() => {
    if (isOnBreak) {
      const interval = setInterval(() => {
        setBreakTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsOnBreak(false);
            setBreakTimer(0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isOnBreak]);

  const handleStartBreak = () => {
    setBreakTimer(breakTime);
    setIsOnBreak(true);
  };
  const handleBreakSelection = (value: any) => {
    setBreakTime(value);
  };

  const handleIncrementSetCount = async () => {
    setSetCount((prevSetCount) => {
      const newTotalCount = totalCount + repCount;
      setTotalCount(newTotalCount);
      return prevSetCount + 1;
    });

    try {
      setLoading(true);

      await updateActivity(
        activities?.$id as string,
        user?.$id,
        formattedDate,
        totalCount + repCount,
        setCount + 1,
        repCount
      );
      alert("Workout updated successfully!");
    } catch (error) {
      console.log("Error updating activity:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWorkout = async () => {
    try {
      setLoading(true);
      await addActivity(user?.$id, formattedDate, totalCount, setCount, repCount);
      alert("Workout created successfully!");
    } catch (error) {
      console.log("Error creating user:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="h-full p-4">
      <ScrollView>
        <View className="flex flex-row justify-between items-center">
          <Text className="text-2xl font-medium mb-4 text-center">
            Howdy
            <Text className="text-3xl font-semibold text-secondary-100 text-center"> {user?.username} </Text>
            🙋🏻‍♂️
          </Text>
          <Ionicons
            name="log-out-outline"
            size={35}
            color="black"
            onPress={() =>
              Alert.alert(
                "Sign Out",
                "Are you sure you want to sign out?",
                [
                  {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel",
                  },
                  { text: "OK", onPress: () => signOut() },
                ],
                { cancelable: false }
              )
            }
          />
        </View>
        <Text className="text-2xl font-semibold mb-4 text-center">{formattedDate}</Text>
        <View className="space-y-4">
          <View className="flex flex-row justify-between items-center">
            <Text>Set Count:</Text>
            <Text>{setCount}</Text>
          </View>
          <Text>Rep Count:</Text>
          <RNPickerSelect
            value={repCount}
            onValueChange={(value) => setRepCount(value)}
            items={[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((n) => ({ label: n.toString(), value: n }))}
            disabled={isOnBreak}
          />
          <View className="flex flex-row justify-between items-center">
            <Text>Total Count:</Text>
            <Text>{totalCount}</Text>
          </View>
          <Text>Break Timer:</Text>
          <RNPickerSelect
            value={breakTime}
            onValueChange={handleBreakSelection}
            items={breakOptions}
            disabled={isOnBreak}
          />
          {!isOnBreak ? (
            <View className="flex flex-row justify-between items-center">
              <TouchableOpacity onPress={handleStartBreak} className=" bg-secondary-100 p-2 rounded-full">
                <Text className="text-white px-2">Take Break</Text>
              </TouchableOpacity>
              {!activities ? (
                <TouchableOpacity onPress={handleCreateWorkout} className=" bg-secondary-100 p-2 rounded-full">
                  {loading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text className="text-white px-2">Create Workout</Text>
                  )}
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={handleIncrementSetCount} className=" bg-secondary-100 p-2 rounded-full">
                  <Ionicons name="add" size={22} color="white" />
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <Text className="text-center">
              Break Time Remaining: {Math.floor(breakTimer / 60)}:{breakTimer % 60}
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
