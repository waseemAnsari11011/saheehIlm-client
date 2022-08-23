import React, { useState, useCallback } from "react";
import {
  Image,
  View,
  StyleSheet,
  Text,
  ScrollView,
  Button,
  Dimensions,
  TouchableOpacity,
  FlatList,
} from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import { useFocusEffect } from "@react-navigation/native";

import { connect } from "react-redux";
import * as actions from "../../Redux/Actions/cartActions";
import EasyButton from "../../Shared/StyledComponents/EasyButton";
import Toast from "react-native-toast-message";
import TrackPlayer, {
  State,
  usePlaybackState,
} from "react-native-track-player";
import jwt_decode from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import baseUrl from "../../assets/common/baseUrl";

let { width } = Dimensions.get("window");

const SingleAudiobook = (props) => {
  const playbackState = usePlaybackState();
  const [item, setItem] = useState(props.route.params.item);
  const [readMore, setReadMore] = useState(false);
  const [isPurchased, setisPurchased] = useState(false);

  // console.log("item.price--->", item.price);
  // console.log("item--->", item.id);
  // console.log(myBooks.includes(item.id));
  useFocusEffect(
    useCallback(() => {
      (async () => {
        await TrackPlayer.setupPlayer();
        await TrackPlayer.add(item);
      })();
      AsyncStorage.getItem("jwt")
        .then((res) => {
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
              setisPurchased(user.data.myBooks.includes(item.id));
            });
        })
        .catch((error) => console.log(error));
      return () => {
        setisPurchased(false);
      };
    }, [])
  );

  const getFreeAudiobook = () => {
    AsyncStorage.getItem("jwt")
      .then((res) => {
        const decoded = jwt_decode(res);
        const userId = decoded.userId;

        axios
          .post(`${baseUrl}orders/free`, {
            audiobookId: item.id,
            userId: userId,
          })
          .then((res) => {
            console.log("res--->", res.data);
          });
      })
      .catch((error) => console.log(error));
  };

  const togglePlayback = async (playbackState) => {
    // console.log("playbackState", playbackState);
    if (item !== null) {
      if (playbackState === State.Playing) {
        await TrackPlayer.pause();
      } else {
        await TrackPlayer.play();
      }
    }
  };

  const handleReadMore = () => {
    setReadMore(true);
  };
  const handleReadLess = () => {
    setReadMore(false);
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Image
          style={styles.blurr}
          resizeMode="cover"
          source={{
            uri: item.image
              ? item.image
              : "https://cdn.pixabay.com/photo/2012/04/01/17/29/box-23649_960_720.png",
          }}
          blurRadius={25}
        />
        <Image
          source={{
            uri: item.image
              ? item.image
              : "https://cdn.pixabay.com/photo/2012/04/01/17/29/box-23649_960_720.png",
          }}
          resizeMode="stretch"
          style={styles.image}
        />

        <View style={styles.content}>
          <Text style={styles.title}>{item.title}</Text>
          <View style={styles.rowDetails}>
            <Icon name="clockcircleo" color={"#3CB371"} size={20} />
            <Text style={styles.duration}>{item.duration} Minutes</Text>
          </View>
          {readMore ? (
            <View>
              <Text style={styles.summary}>{item.summary}</Text>
              <TouchableOpacity onPress={handleReadLess}>
                <Text style={styles.readmore}>Read Less</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              <Text style={styles.summary}>
                {item.summary.length > 15
                  ? item.summary.substring(0, 500) + "..."
                  : item.summary}
              </Text>
              <TouchableOpacity onPress={handleReadMore}>
                <Text style={styles.readmore}>Read More</Text>
              </TouchableOpacity>
            </View>
          )}
          <View style={styles.belowSummary}>
            <View style={styles.belowSummaryItem}>
              <Text style={styles.txtKey}>Author: </Text>
              <Text style={styles.txtValue}>{item.writtenBy}</Text>
            </View>
            <View style={styles.belowSummaryItem}>
              <Text style={styles.txtKey}>Read By: </Text>
              <Text style={styles.txtValue}>{item.narratedBy}</Text>
            </View>
            <View style={styles.belowSummaryItem}>
              <Text style={styles.txtKey}>Released: </Text>
              <Text style={{ fontSize: 16, color: "grey", fontWeight: "400" }}>
                {item.releasedDate}
              </Text>
            </View>
          </View>
          {isPurchased || item.price === 0 ? (
            <TouchableOpacity
              style={styles.buyBtn}
              onPress={() => {
                if (item.price === 0) {
                  getFreeAudiobook();
                  setTimeout(() => {
                    props.navigation.navigate("MyBooksTab", {
                      screen: "MyBooks",
                    });
                  }, 1000);
                } else {
                  props.navigation.navigate("MyBooksTab", {
                    screen: "MyBooks",
                  });
                }
              }}
            >
              <Text style={styles.BtnTxt}>Play</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.buyBtn}
              onPress={() => {
                props.addItemToCart(props.route.params.item);
                props.navigation.navigate("CartTab", { screen: "Cart" });
              }}
            >
              <Text style={styles.BtnTxt}>Buy Now</Text>
            </TouchableOpacity>
          )}

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              // backgroundColor: "yellow",
            }}
          >
            <TouchableOpacity
              style={[
                styles.buyBtn,
                {
                  width: width / 2.18,
                  backgroundColor: "white",
                  borderWidth: 1,
                  borderColor: isPurchased ? "grey" : "black",
                },
              ]}
              onPress={() => {
                props.addItemToCart(props.route.params.item);
                Toast.show({
                  topOffset: 60,
                  visibilityTime: 3000,
                  type: "success",
                  text1: `${item.title} added to Cart`,
                  text2: "Go to your cart to complete order",
                });
              }}
              disabled={isPurchased}
            >
              <Text
                style={[
                  styles.BtnTxt,
                  { color: isPurchased ? "grey" : "black" },
                ]}
              >
                Add to cart
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.buyBtn,
                {
                  width: width / 2.18,
                  backgroundColor: "white",
                  borderWidth: 1,
                },
              ]}
              onPress={() => togglePlayback(playbackState)}
            >
              {playbackState === State.Playing ? (
                <Text style={[styles.BtnTxt, { color: "black" }]}>
                  Pause Sample
                </Text>
              ) : (
                <Text style={[styles.BtnTxt, { color: "black" }]}>
                  Play Sample
                </Text>
              )}
            </TouchableOpacity>
          </View>
          <View style={styles.belowbtn}>
            <Text style={styles.heading}>Contents</Text>
            {item.chapters.map((i, key) => (
              <View
                key={key}
                style={{
                  flexDirection: "row",
                  marginTop: 15,
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <View style={{ marginRight: 20, marginLeft: 15 }}>
                  <Text style={{ fontSize: 16, fontWeight: "400" }}>
                    {key + 1}{" "}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "column",
                  }}
                >
                  <Text style={{ fontSize: 16 }}>{i.title}</Text>
                  <Text style={{ fontSize: 12, color: "grey" }}>
                    Audio - {i.duration} mins
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    addItemToCart: (audiobook) => dispatch(actions.addToCart({ audiobook })),
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "white",
  },

  image: {
    width: width / 2 - 20,
    height: width / 1.8,
    marginTop: 15,
    position: "absolute",
    right: width / 3.5,
    zIndex: 1,
    borderRadius: 5,
  },
  blurr: {
    width: "100%",
    height: width / 2.8,
  },
  content: {
    flex: 1,
    width: "100%",
    marginTop: 100,
    padding: 12,
    // backgroundColor: "red",
  },
  rowDetails: {
    flexDirection: "row",
    alignItems: "center",
  },
  duration: {
    fontSize: 16,

    fontWeight: "300",
    color: "grey",
    marginLeft: 8,
  },
  title: {
    // backgroundColor: "red",
    fontSize: 25,
    fontWeight: "400",
  },
  summary: {
    fontSize: 16,
    fontWeight: "300",
    // backgroundColor: "green",
    paddingTop: 10,
    color: "grey",
  },

  readmore: {
    color: "#3CB371",
    fontWeight: "500",
    fontSize: 16,
  },
  belowSummary: {
    marginTop: 10,
  },
  belowSummaryItem: {
    flexDirection: "row",
  },
  txtKey: {
    fontSize: 16,
    fontWeight: "300",
  },
  txtValue: {
    fontSize: 16,
    color: "#3CB371",
    fontWeight: "500",
  },
  buyBtn: {
    marginTop: 20,
    flexDirection: "row",
    backgroundColor: "#3CB371",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    // borderRadius: 5,
  },
  BtnTxt: {
    color: "white",
    fontSize: 18,
    fontWeight: "400",
  },
  heading: {
    fontSize: 18,
    fontWeight: "500",
  },
  belowbtn: {
    marginTop: 20,
  },
});

export default connect(null, mapDispatchToProps)(SingleAudiobook);
