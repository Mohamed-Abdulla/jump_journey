import { Alert, Button, ScrollView, StyleSheet, Text, View } from "react-native";
import RNPickerSelect from "react-native-picker-select";

import { useGlobalContext } from "@/context/global-provider";
import { signOut } from "@/lib/appwrite";
import { getFormattedDate } from "@/lib/utils";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { user } = useGlobalContext();
  const formattedDate = getFormattedDate();

  const [setCount, setSetCount] = useState(1);
  const [repCounts, setRepCounts] = useState([10]);
  const [totalCount, setTotalCount] = useState(0);
  const [breakTime, setBreakTime] = useState(30);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [breakTimer, setBreakTimer] = useState(0);

  const breakOptions = [
    { label: "None", value: 0 },
    { label: "30 Sec", value: 30 },
    { label: "1 Min", value: 60 },
    { label: "2 Min", value: 120 },
    { label: "5 Min", value: 300 },
  ];

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

  const handleBreakSelection = (value: any) => {
    setBreakTime(value);
  };

  const handleAddSet = () => {
    setSetCount((prev) => prev + 1);
    setRepCounts((prev) => [...prev, 10]); // Adding default 10 reps for the new set
  };

  const handleRepCountChange = (index: number, value: number) => {
    setRepCounts((prev) => {
      const newRepCounts = [...prev];
      newRepCounts[index] = value;
      return newRepCounts;
    });
  };
  const handleStartBreak = () => {
    if (breakTime) {
      setBreakTimer(breakTime);
      setIsOnBreak(true);
    } else {
      Alert.alert("Select Break Time");
    }
  };
  const handleCreate = () => {};

  useEffect(() => {
    const calculatedTotal = repCounts.reduce((acc, count) => acc + count, 0);
    setTotalCount(calculatedTotal);
  }, [repCounts]);

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
        <Text className="text-2xl font-medium mb-4 text-center">{formattedDate}</Text>
        <View>
          <View className="flex flex-row justify-between items-center">
            <Text>Set Count:</Text>
            <Text>{setCount}</Text>
          </View>
          {repCounts.map((count, index) => (
            <View key={index} className="mb-2 flex flex-row justify-between items-center">
              <Text>Set {index + 1} Rep Count:</Text>
              <RNPickerSelect
                value={count}
                onValueChange={(value) => handleRepCountChange(index, value)}
                items={[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((n) => ({ label: n.toString(), value: n }))}
                disabled={isOnBreak}
              />
            </View>
          ))}
          <Text>Total Count: {totalCount}</Text>

          <Text>Break Timer:</Text>
          <RNPickerSelect
            value={breakTime}
            onValueChange={handleBreakSelection}
            items={breakOptions}
            disabled={isOnBreak}
          />
          {!isOnBreak ? (
            <View className="flex flex-row justify-between items-center">
              <Button title="Take Break" onPress={handleStartBreak} />
              <Button title=" + " onPress={handleAddSet} />
            </View>
          ) : (
            <Text>
              Break Time Remaining: {Math.floor(breakTimer / 60)}:{breakTimer % 60}
            </Text>
          )}

          {/* <Button title="Create" onPress={handleCreate} />s */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
