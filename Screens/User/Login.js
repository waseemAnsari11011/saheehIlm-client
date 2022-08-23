import React, { useEffect, useContext, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import FormContainer from "../../Shared/Form/FormContainer";
import Input from "../../Shared/Form/Input";
import Error from "../../Shared/Error";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
let { height } = Dimensions.get("window");
import { AntDesign } from "@expo/vector-icons";
import { connect } from "react-redux";

// Context
import AuthGlobal from "../../Context/store/AuthGlobal";
import { loginUser } from "../../Context/actions/Auth.actions";

const Login = (props) => {
  const context = useContext(AuthGlobal);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  console.log("props.cartItems--->", props.cartItems);

  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem("jwt")
        .then((res) => {
          if (res !== null) {
            props.cartItems.length !== 0
              ? props.navigation.navigate("CartTab", { screen: "Cart" })
              : props.navigation.navigate("User Profile");
          }
        })
        .catch((error) => console.log(error));
    }, [context.stateUser.isAuthenticated, props.cartItems])
  );

  const handleSubmit = () => {
    const user = {
      email: email.trim().toLowerCase(),
      password: password,
    };

    if (email === "" || password === "") {
      setError("Please fill in your credentials");
    } else {
      loginUser(user, context.dispatch);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#FAFAFA" }}>
      <FormContainer title={"Sign In"}>
        <Input
          placeholder={"Enter Email"}
          name={"email"}
          id={"email"}
          value={email}
          onChangeText={(text) => {
            setEmail(text);
          }}
        />
        <Input
          placeholder={"Enter Password"}
          name={"password"}
          id={"password"}
          secureTextEntry={true}
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        <View style={styles.buttonGroup}>
          {error ? <Error message={error} /> : null}
          <TouchableOpacity
            onPress={() => handleSubmit()}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              width: 85,
            }}
          >
            <AntDesign name="login" size={24} color="#3CB371" />
            <Text
              style={{
                fontSize: 17,
                color: "#3CB371",
                fontWeight: "700",
              }}
            >
              Sign In
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => props.navigation.navigate("Register")}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 10,
            }}
          >
            <Text>New here? </Text>
            <Text
              style={{
                fontSize: 17,
                color: "#3CB371",
                fontWeight: "700",
              }}
            >
              Create an account
            </Text>
          </TouchableOpacity>
        </View>
      </FormContainer>
    </View>
  );
};

const mapStateToProps = (state) => {
  const { cartItems } = state;
  return {
    cartItems: cartItems,
  };
};

const styles = StyleSheet.create({
  buttonGroup: {
    marginTop: height / 2.6,
    width: "80%",
    alignItems: "center",
  },
  middleText: {
    marginBottom: 20,
    alignSelf: "center",
  },
});

export default connect(mapStateToProps)(Login);
