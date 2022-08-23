import { StyleSheet, Text, View, Image, Dimensions } from "react-native";
import React from "react";
let { width } = Dimensions.get("window");

const CartItem = (props) => {
  const item = props.item.item.audiobook;
  // console.log("item====", props.item.item.audiobook.route.params.item);
  // console.log("item====>>>>>>>>>>", props.item.item.audiobook);
  return (
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
      <View style={styles.right}>
        <Text style={styles.price}>₹{item.price}</Text>
      </View>
    </View>
  );
};

export default CartItem;

const styles = StyleSheet.create({
  cartItem: {
    flexDirection: "row",
    justifyContent: "flex-start",
    height: 100,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "lightgrey",
    backgroundColor: "#FFF",
  },
  left: {
    // width: "100%",
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
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

  right: {
    flexDirection: "row",
    // backgroundColor: "red",
    paddingLeft: 5,
    alignItems: "center",
  },
  price: {
    fontWeight: "400",
    fontSize: 17,
    marginRight: 25,
  },
});
