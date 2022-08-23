import { StyleSheet, Text, View, SafeAreaView, StatusBar } from "react-native";
import { NativeBaseProvider } from "native-base";
import { NavigationContainer } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { PlayerProvider } from "./Context/playerContext";
import SafeViewAndroid from "./SafeViewAndroid ";
// Redux
import { Provider } from "react-redux";
import store from "./Redux/store";

// Context API
import Auth from "./Context/store/Auth";


// Navigatiors
import Main from "./Navigators/Main";

export default function App() {
  return (
    <PlayerProvider>
      <Auth>
        <Provider store={store}>
          <NavigationContainer>
            <NativeBaseProvider>
              <SafeAreaView style={SafeViewAndroid.AndroidSafeArea}>
                <StatusBar
                  translucent
                  backgroundColor="#3CB371"
                  barStyle="light-content"
                />
                <Main />
                <Toast />
              </SafeAreaView>
            </NativeBaseProvider>
          </NavigationContainer>
        </Provider>
      </Auth>
    </PlayerProvider>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
  },
});
