import React, { useState } from "react";
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
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import axios from "axios";
import baseUrl from "../../assets/common/baseUrl";
import Toast from "react-native-toast-message";
import { AntDesign } from "@expo/vector-icons";

let { height } = Dimensions.get("window");

const Register = (props) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isEmailCorrect, setisEmailCorrect] = useState(false);
  const [isEmptyCorrect, setisEmptyCorrect] = useState(false);

  console.log("error", error);

  const register = () => {
    if (email === "" || name === "" || password === "") {
      setError("Please fill in the form correctly");
      setisEmptyCorrect(false);
    } else {
      setisEmptyCorrect(true);
    }
    let user = {
      name: name,
      email: email,
      passwordHash: password,

      isAdmin: false,
    };
    isEmailCorrect === true && isEmptyCorrect === true
      ? axios.post(`${baseUrl}users/register`, user).then((res) => {
          if (res.data.success === true) {
            Toast.show({
              topOffset: 60,
              type: "success",
              text1: "Registration Succeeded",
              text2: "Please Login into your account",
            });
            setTimeout(() => {
              props.navigation.navigate("Login");
            }, 500);
          } else if (res.data.msg === "user already exist with this email") {
            Toast.show({
              topOffset: 60,
              type: "error",
              text1: "Something went wrong",
              text2: "user already exist with this email",
            });
          } else if (res.data.msg === "the user cannot be created!") {
            Toast.show({
              topOffset: 60,
              type: "error",
              text1: "Something went wrong",
              text2: "the user cannot be created!",
            });
          }
        })
      : null;
  };

  // useEffect(() => {
  //   first

  //   return () => {
  //     second
  //   }
  // }, [third])

  const validate = (text) => {
    console.log(text);
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    console.log(reg.test(text));
    if (reg.test(text) === false) {
      console.log("Email is Not Correct");
      setError("Email is Not Correct");
      setisEmailCorrect(false);
    } else {
      console.log("Email is  Correct");
      setEmail(text);
      setisEmailCorrect(true);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#FAFAFA" }}>
      <KeyboardAwareScrollView
        viewIsInsideTabBar={true}
        extraHeight={200}
        enableOnAndroid={true}
      >
        <FormContainer title={"Register"}>
          <Input
            placeholder={"Name"}
            name={"name"}
            id={"name"}
            onChangeText={(text) => setName(text.trim())}
          />
          <Input
            placeholder={"Email"}
            name={"email"}
            id={"email"}
            // onChangeText={(text) => setEmail(text.toLowerCase())}
            onChangeText={(text) => validate(text.trim().toLowerCase())}
          />
          <Input
            placeholder={"Password"}
            name={"password"}
            id={"password"}
            secureTextEntry={true}
            onChangeText={(text) => setPassword(text)}
          />
          <View style={styles.buttonGroup}>
            <View>
              {(error === "Please fill in the form correctly" &&
                isEmptyCorrect === false) ||
              (error === "Email is Not Correct" && isEmailCorrect === false) ? (
                <Error message={error} />
              ) : null}
            </View>
            {/* <View>
            <Button title="Register" onPress={() => register()} />
          </View>
          <View style={{ marginTop: 40 }}>
            <Button
              title="Back to Login"
              onPress={() => props.navigation.navigate("Login")}
            />
          </View> */}
            <TouchableOpacity
              onPress={() => register()}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                width: 95,
              }}
            >
              <AntDesign name="logout" size={24} color="#3CB371" />
              <Text
                style={{
                  fontSize: 17,
                  color: "#3CB371",
                  fontWeight: "700",
                }}
              >
                Register
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => props.navigation.navigate("Login")}
              style={{
                marginTop: 10,
              }}
            >
              <Text
                style={{
                  fontSize: 17,
                  color: "#3CB371",
                  fontWeight: "700",
                }}
              >
                Back to login screen
              </Text>
            </TouchableOpacity>
          </View>
        </FormContainer>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default Register;

const styles = StyleSheet.create({
  buttonGroup: {
    marginTop: height / 3.5,
    width: "80%",
    alignItems: "center",
  },
});
