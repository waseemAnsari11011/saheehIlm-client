import jwt_decode from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import baseUrl from "../../assets/common/baseUrl";
import { PlayerContext } from "../playerContext";
import { useContext } from "react";
import axios from "axios";

export const SET_CURRENT_USER = "SET_CURRENT_USER";

export const loginUser = (user, dispatch) => {
  // fetch(`${baseUrl}users/login`, {
  //   method: "POST",
  //   body: JSON.stringify(user),
  //   headers: {
  //     Accept: "application/json",
  //     "Content-Type": "application/json",
  //   },
  // })
  //   .then((res) => {
  //     res.json();
  //   })
  //   .then((data) => {
  //     if (data) {
  //       const token = data.token;

  //       const decoded = jwt_decode(token);
  //       AsyncStorage.setItem("jwt", token);
  //       dispatch(setCurrentUser(decoded, user));
  //     } else {
  //       logoutUser(dispatch);
  //     }
  //   })
  //   .catch((err) => {
  //     Toast.show({
  //       topOffset: 60,
  //       type: "error",
  //       text1: "Please provide correct credentials",
  //     });
  //     logoutUser(dispatch);
  //   });

  axios.post(`${baseUrl}users/login`, user).then((res) => {
    // console.log("res.data&&&&&&&", res.data);
    if (res.data.success === true) {
      const token = res.data.token;

      const decoded = jwt_decode(token);
      AsyncStorage.setItem("jwt", token);
      dispatch(setCurrentUser(decoded, user));
    } else if (res.data.msg === "user not found") {
      Toast.show({
        topOffset: 60,
        type: "error",
        text1: "user not found",
        text2: "please provide correct credentials",
      });
    } else if (res.data.msg === "password is wrong") {
      Toast.show({
        topOffset: 60,
        type: "error",
        text1: "password is wrong",
        text2: "please provide correct credentials",
      });
    }
  });
};

export const getUserProfile = (id) => {
  fetch(`${baseUrl}users/${id}`, {
    method: "GET",
    body: JSON.stringify(user),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => console.log("data get user--->", data));
};

export const logoutUser = (myBookIds, dispatch) => {
  // console.log("logout", myBookIds);
  AsyncStorage.removeItem("jwt");
  dispatch(setCurrentUser({}));
};

export const setCurrentUser = (decoded, user) => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded,
    userProfile: user,
  };
};
