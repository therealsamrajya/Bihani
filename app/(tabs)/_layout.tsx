import FontAwesome from "@expo/vector-icons/FontAwesome";
import React from "react";
import { Tabs } from "expo-router";
import Header from "@/components/ui/Header";

const _layout = () => {
  return (
    <>
      <Header />
      <Tabs
        screenOptions={{ tabBarActiveTintColor: "blue", headerShown: false }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => (
              <FontAwesome size={28} name="home" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="reminder"
          options={{
            title: "Reminder",
            tabBarIcon: ({ color }) => (
              <FontAwesome size={28} name="bell" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color }) => (
              <FontAwesome size={28} name="user" color={color} />
            ),
          }}
        />
      </Tabs>
    </>
  );
};

export default _layout;
