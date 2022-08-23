import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import Orders from "../Screens/Admin/Orders";
import Audiobooks from "../Screens/Admin/Audiobooks";
import AudiobookForm from "../Screens/Admin/AudiobookForm";
import Categories from "../Screens/Admin/Categories";

const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Audiobooks"
        component={Audiobooks}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Categories"
        options={{
          headerShown: false,
        }}
        component={Categories}
      />
      <Stack.Screen
        name="Orders"
        options={{
          headerShown: false,
        }}
        component={Orders}
      />
      <Stack.Screen
        name="AudiobookForm"
        options={{
          headerShown: false,
        }}
        component={AudiobookForm}
      />
    </Stack.Navigator>
  );
}
export default function AdminNavigator() {
  return <MyStack />;
}
