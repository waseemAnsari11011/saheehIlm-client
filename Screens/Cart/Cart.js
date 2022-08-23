import {
  View,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
} from "react-native";
import { Button } from "native-base";
import React, { useContext, useEffect, useState } from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import { SwipeListView } from "react-native-swipe-list-view";
import { connect } from "react-redux";
import * as actions from "../../Redux/Actions/cartActions";
import CartItem from "./CartItem";
import AuthGlobal from "../../Context/store/AuthGlobal";
import axios from "axios";
import baseUrl from "../../assets/common/baseUrl";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RazorpayCheckout from "react-native-razorpay";
import { RAZORPAY_ID } from "@env";
import { Feather } from "@expo/vector-icons";

var { width } = Dimensions.get("window");

const Cart = (props) => {
  const context = useContext(AuthGlobal);

  const [cartItems, setcartItems] = useState(props.cartItems);
  let total = 0;
  cartItems.forEach((x) => {
    return (total += x.audiobook.price);
  });

  useEffect(() => {
    setcartItems(props.cartItems);

    return () => {
      setcartItems();
    };
  }, [props.cartItems]);

  const checkout = () => {
    AsyncStorage.getItem("jwt")
      .then((res) => {
        res !== null
          ? axios

              .post(`${baseUrl}orders`, {
                orderItems: cartItems,
                user: context.stateUser.user.userId,
              })
              .then((res) => {
                var options = {
                  description: "Credits towards consultation",
                  image: "https://i.imgur.com/3g7nmJC.png",
                  currency: "INR",
                  // key: RAZORPAY_ID, // Your api key
                  key: "rzp_test_wMfhTikhrQNrMr",
                  amount: `${res.data.amount}`,
                  order_id: res.data.id,
                  name: "Islamic Audiobooks",

                  theme: { color: "#3CB371" },
                };
                RazorpayCheckout.open(options)
                  .then((data) => {
                    // handle success
                    console.log("afteroptions", data);
                    axios
                      .post(`${baseUrl}orders/verification`, {
                        razorpay_order_id: data.razorpay_order_id,
                        razorpay_payment_id: data.razorpay_payment_id,
                        razorpay_signature: data.razorpay_signature,
                      })
                      .then((res) => {
                        //When Payment is Verified
                        console.log("payment----==>", res.data);
                        if (res.data.msg === "ok") {
                          props.clearCart();
                          props.navigation.navigate("MyBooksTab", {
                            screen: "MyBooks",
                          });
                          Toast.show({
                            topOffset: 60,
                            type: "success",
                            text1: "Payment Successful",
                            visibilityTime: 3000,
                          });
                        } else {
                          Toast.show({
                            topOffset: 60,
                            type: "error",
                            text1: "Payment not Verified",
                            visibilityTime: 3000,
                          });
                        }
                      });
                  })
                  .catch((error) => {
                    console.log(error.description);
                    // handle failure
                    Toast.show({
                      topOffset: 60,
                      type: "error",
                      text1: `${error.code}`,
                      text2: `${error.description}`,
                      visibilityTime: 2000,
                    });
                    alert(`Error: ${error.code} | ${error.description}`);
                  });
              })

              .catch((error) => {
                console.log("Api call error-->", error);
              })
          : props.navigation.navigate("User", { screen: "Login" });
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      {props.cartItems.length ? (
        <View style={styles.cartContainer}>
          <SwipeListView
            data={props.cartItems}
            renderItem={(data) => <CartItem item={data} />}
            renderHiddenItem={(data) => (
              <View style={styles.hiddenContainer}>
                <TouchableOpacity
                  style={styles.hiddenButton}
                  onPress={() => props.removeFromCart(data.item)}
                >
                  <Icon name="trash" color={"white"} size={30} />
                </TouchableOpacity>
              </View>
            )}
            disableRightSwipe={true}
            previewOpenDelay={3000}
            friction={1000}
            tension={40}
            leftOpenValue={75}
            stopLeftSwipe={75}
            rightOpenValue={-75}
          />
          <View style={styles.bottomContainer}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={styles.price}>Total:</Text>
              <Text style={styles.price}>₹{total}</Text>
            </View>

            <View style={styles.rightBtns}>
              <TouchableOpacity
                style={[styles.buyBtn, { backgroundColor: "#e74c3c" }]}
                onPress={() => props.clearCart()}
              >
                <Text style={styles.BtnTxt}>Clear</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buyBtn} onPress={checkout}>
                <Text style={styles.BtnTxt}>Ckeckout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#FAFAFA",
          }}
        >
          <Feather name="shopping-cart" size={55} color="#00000070" />
          <Text
            style={{
              fontSize: 25,
              fontWeight: "400",
            }}
          >
            Cart is empty
          </Text>
          <Text
            style={{
              fontSize: 15,
              color: "#00000090",
              textAlign: "center",
            }}
          >
            Add Audiobooks to your cart to get started!
          </Text>
        </View>
      )}
    </>
  );
};

const mapStateToProps = (state) => {
  const { cartItems } = state;
  return {
    cartItems: cartItems,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    clearCart: () => dispatch(actions.clearCart()),
    removeFromCart: (item) => dispatch(actions.removeFromCart(item)),
  };
};

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FAFAFA",
  },
  cartContainer: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },

  bottomContainer: {
    flexDirection: "column",
    justifyContent: "center",
    position: "absolute",
    bottom: 0,
    left: 0,
    backgroundColor: "white",
    elevation: 20,
    width: "100%",
    padding: 15,

    // backgroundColor: "pink",
  },
  price: {
    fontWeight: "700",
    fontSize: 20,
  },
  rightBtns: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  buyBtn: {
    marginTop: 15,
    flexDirection: "row",
    backgroundColor: "#3CB371",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    width: width / 2.3,
    // borderRadius: 5,
  },
  BtnTxt: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  hiddenContainer: {
    flex: 1,
    justifyContent: "flex-end",
    flexDirection: "row",
    // backgroundColor: "green",
  },
  hiddenButton: {
    backgroundColor: "#e74c3c",
    justifyContent: "center",
    alignItems: "flex-end",
    paddingRight: 25,

    width: width / 1.4,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
