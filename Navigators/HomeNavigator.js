import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import AudiobookContainer from "../Screens/Audiobooks/AudiobookContainer";
import SingleAudiobook from "../Screens/Audiobooks/SingleAudiobook";

const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={AudiobookContainer}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Audiobook Detail"
        component={SingleAudiobook}
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
