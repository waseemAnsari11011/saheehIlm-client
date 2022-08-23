import React, { useContext, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  Button,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import axios from "axios";
import baseUrl from "../../assets/common/baseUrl";
import AuthGlobal from "../../Context/store/AuthGlobal";
import { logoutUser } from "../../Context/actions/Auth.actions";
import jwt_decode from "jwt-decode";
import { PlayerContext } from "../../Context/playerContext";
import { FontAwesome } from "@expo/vector-icons";

const UserProfile = (props) => {
  const { myBookIds } = useContext(PlayerContext);
  const context = useContext(AuthGlobal);
  const [userProfile, setUserProfile] = useState();
  // console.log("userProfile=>", userProfile);

  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem("jwt")
        .then((res) => {
          if (res !== null) {
            const decoded = jwt_decode(res);
            const userId = decoded.userId;
            // console.log("userIdL", userId);
            axios
              .get(`${baseUrl}users/${userId}`, {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${res}`,
                },
              })
              .then((user) => {
                // console.log("user--->", user);
                setUserProfile(user.data);
              });
          } else {
            props.navigation.navigate("Login");
          }
        })
        .catch((error) => console.log(error));

      return () => {
        setUserProfile();
      };
    }, [context.stateUser.isAuthenticated])
  );

  return (
    <View style={styles.container}>
      <FontAwesome name="user-circle" size={100} color="#00000070" />
      <Text
        style={{
          fontSize: 25,
          fontWeight: "400",
          marginTop: 10,
        }}
      >
        {userProfile ? userProfile.name : ""}
      </Text>

      <Text
        style={{
          fontSize: 15,
          color: "#00000090",
          textAlign: "center",
        }}
      >
        {userProfile ? userProfile.email : ""}
      </Text>

      <View style={{ marginTop: 50 }}>
        {/* <Button
          title={"Sign Out"}
          onPress={() => [
            AsyncStorage.removeItem("jwt"),

            logoutUser(myBookIds, context.dispatch),
          ]}
        /> */}
        <TouchableOpacity
          onPress={() => [
            AsyncStorage.removeItem("jwt"),

            logoutUser(myBookIds, context.dispatch),
          ]}
        >
          <Text
            style={{
              fontSize: 17,
              color: "#3CB371",
              fontWeight: "700",
            }}
          >
            Sign out
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default UserProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FAFAFA",
  },
});
