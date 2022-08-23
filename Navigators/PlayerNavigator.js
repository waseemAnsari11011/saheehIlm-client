import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Player from "../Screens/AudioPlayer/Player";
import MyBooks from "../Screens/AudioPlayer/MyBooks";

const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MyBooks"
        component={MyBooks}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="Player"
        component={Player}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

export default function HomeNavigator() {
  return <MyStack />;
}
