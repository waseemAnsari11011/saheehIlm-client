import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Badge } from "native-base";

import { connect } from "react-redux";

const CartIcon = (props) => {
  const uniqueIds = [];

  const unique = props.cartItems.filter((element) => {
    const isDuplicate = uniqueIds.includes(element.audiobook.id);

    if (!isDuplicate) {
      uniqueIds.push(element.audiobook.id);

      return true;
    }

    return false;
  });
  return (
    <>
      {props.cartItems.length ? (
        <View style={styles.badge}>
          <Text style={styles.text}>{unique.length}</Text>
        </View>
      ) : null}
    </>
  );
};

const mapStateToProps = (state) => {
  const { cartItems } = state;
  return {
    cartItems: cartItems,
  };
};

const styles = StyleSheet.create({
  badge: {
    width: 20,
    height: 20,
    position: "absolute",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    top: -2,
    right: -15,
    backgroundColor: "red",
    borderRadius: 80,
    zIndex: 1,
  },
  text: {
    fontSize: 12,

    fontWeight: "bold",
    color: "white",
  },
});

export default connect(mapStateToProps)(CartIcon);
