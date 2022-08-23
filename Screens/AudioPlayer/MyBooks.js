import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  Image,
} from "react-native";
import React, { useState, useCallback, useContext } from "react";
import baseUrl from "../../assets/common/baseUrl";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import Icon from "react-native-vector-icons/AntDesign";
import { TouchableOpacity } from "react-native-gesture-handler";
import AuthGlobal from "../../Context/store/AuthGlobal";
import { logoutUser } from "../../Context/actions/Auth.actions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt_decode from "jwt-decode";
import { PlayerContext } from "../../Context/playerContext";
import { Feather } from "@expo/vector-icons";

let { width } = Dimensions.get("window");

const MyBooks = (props) => {
  const context = useContext(AuthGlobal);
  const { setmyBookIds, audiobooks, setAudiobooks } = useContext(PlayerContext);
  const [myBooks, setmyBooks] = useState([]);
  const [userid, setuserid] = useState(context.stateUser.user.userId);

  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem("jwt")
        .then((res) => {
          if (res !== null) {
            const decoded = jwt_decode(res);
            const userId = decoded.userId;

            axios
              .get(`${baseUrl}users/${userId}`, {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${res}`,
                },
              })
              .then((user) => {
                // console.log("user--->", user);
                setmyBooks(user.data.myBooks);

                user.data.myBooks.map((id) => {
                  axios
                    .post(`${baseUrl}audiobooks/mybooks`, {
                      ids: user.data.myBooks,
                    })
                    .then((res) => {
                      setAudiobooks(res.data);
                      const ids = res.data.map((item) => item.id);
                      setmyBookIds(ids);
                    })
                    .catch((error) => {
                      console.log("Api call error-->", error);
                    });
                });
              });
          } else {
            props.navigation.navigate("User", { screen: "Login" });
          }
        })
        .catch((error) => console.log(error));

      return () => {
        setAudiobooks([]);
      };
    }, [context.stateUser.isAuthenticated])
  );
  // const ids = audiobooks.map((item) => item.id);
  // console.log("ids", ids);

  return (
    <>
      {myBooks.length ? (
        <ScrollView
          contentContainerStyle={{ flex: 1, backgroundColor: "#FAFAFA" }}
        >
          <View style={{ margin: 10, fontSize: 14 }}>
            <Text style={{ fontSize: 18, fontWeight: "500" }}>My Books</Text>
          </View>
          {audiobooks.map((item, key) => (
            <TouchableOpacity
              key={item.id}
              onPress={() =>
                props.navigation.navigate("Player", {
                  chapters: item.chapters,
                  bookImage: item.image,
                  bookId: item.id,
                })
              }
            >
              <View style={styles.cartItem}>
                <View style={styles.left}>
                  <Image
                    style={styles.image}
                    resizeMode="contain"
                    source={{
                      uri: item.image
                        ? item.image
                        : "https://cdn.pixabay.com/photo/2012/04/01/17/29/box-23649_960_720.png",
                    }}
                  />
                  <View style={styles.writtenNnarrated}>
                    <Text style={styles.title}>
                      {item.title.length > 15
                        ? item.title.substring(0, 65) + "..."
                        : item.title}
                    </Text>
                    <Text style={styles.writtenBy}>By {item.writtenBy}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <View
          style={{
            fontSize: 14,
            padding: 10,
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#FAFAFA",
          }}
        >
          <Feather name="book-open" size={55} color="#00000070" />
          <Text
            style={{
              fontSize: 25,
              fontWeight: "400",
            }}
          >
            Nothing bought yet
          </Text>
          <Text
            style={{
              fontSize: 15,
              color: "#00000090",
              textAlign: "center",
            }}
          >
            When you buy a audiobook to listen, you'll see them here!
          </Text>
        </View>
      )}
    </>
  );
};

export default MyBooks;

const styles = StyleSheet.create({
  cartItem: {
    flexDirection: "row",
    justifyContent: "flex-start",
    height: 100,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "lightgrey",
    // backgroundColor: "#FFFAFA",
  },
  left: {
    // width: "100%",
    flexDirection: "row",
    alignItems: "flex-start",
    flex: 1,
    // backgroundColor: "red",
  },
  image: {
    width: 55,
    height: 55,
    marginRight: 10,
    resizeMode: "stretch",
    borderRadius: 5,
  },
  writtenNnarrated: {
    // flexDirection: "column",
    flex: 1,

    width: width / 1.67,
  },

  title: {
    fontWeight: "400",
    fontSize: 16,
  },
  writtenBy: {
    color: "grey",
    fontSize: 13,
  },
});
