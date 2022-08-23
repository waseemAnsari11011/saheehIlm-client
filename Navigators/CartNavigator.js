import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import Cart from "../Screens/Cart/Cart";
import CheckoutNavigator from "./CheckoutNavigator";
import Checkout from "../Screens/Cart/Checkout/Checkout";
import Confirm from "../Screens/Cart/Checkout/Confirm";

import MyBooks from "../Screens/AudioPlayer/MyBooks";

const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Cart"
        component={Cart}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="MyBooks"
        component={MyBooks}
        options={{
          headerShown: false,
        }}
      />

      {/* <Stack.Screen
        name="CheckoutNavigator"
        component={CheckoutNavigator}
        options={{
          headerShown: false,
        }}
      /> */}
    </Stack.Navigator>
  );
}

export default function CartNavigator() {
  return <MyStack />;
}
