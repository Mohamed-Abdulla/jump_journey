import CustomButton from "@/components/custom-button";
import { images } from "@/constants";
import { useGlobalContext } from "@/context/global-provider";
import { Redirect, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const App = () => {
  const { loading, isLogged } = useGlobalContext();

  if (!loading && isLogged) return <Redirect href="/home" />;
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView
        contentContainerStyle={{
          height: "100%",
        }}
      >
        <View className="w-full justify-center items-center h-full px-4">
          <Image source={images.logo} className="w-[130px] h-[84px]" resizeMode="contain" />
          {/* <Image source={images.cards} className="max-w-[380px] w-full h-[300px]" resizeMode="contain" /> */}
          <View className="relative mt-5">
            <Text className="text-3xl font-bold text-white text-center">
              <Text className="text-secondary-200"> Jump Journey</Text>
            </Text>
            {/* <Image source={images.path} className="w-[136px] h-4 absolute -bottom-2 -right-8" resizeMode="contain" /> */}
          </View>
          <Text className="text-sm font-pregular text-gray-100 mt-7 text-center">
            Track Your Skipping Rope Progress and Reach New Heights{" "}
          </Text>
          <CustomButton
            title="Continue with Email"
            handlePress={() => router.push("/sign-in")}
            containerStyles="w-full mt-7"
          />
        </View>
      </ScrollView>
      <StatusBar backgroundColor="#161122" style="light" />
    </SafeAreaView>
  );
};

export default App;
