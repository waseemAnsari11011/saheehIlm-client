import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  Button,
} from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import { connect } from "react-redux";
import * as actions from "../../Redux/Actions/cartActions";
import Toast from "react-native-toast-message";

let { width } = Dimensions.get("window");

const AudiobookCard = (props) => {
  // console.log("AudiobookCard props-->", props);
  const { title, price, image, summary, duration } = props;
  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        resizeMode="contain"
        source={{
          uri: image
            ? image
            : "https://cdn.pixabay.com/photo/2012/04/01/17/29/box-23649_960_720.png",
        }}
      />
      <View style={styles.detail}>
        <Text style={styles.title}>
          {title.length > 15 ? title.substring(0, 18) + "..." : title}
        </Text>
        <Text style={styles.summary}>
          {summary.length > 15 ? summary.substring(0, 30) + "..." : summary}
        </Text>
        <View style={styles.priceNrating}>
          <Text style={styles.duration}>{duration} min</Text>
          {price === 0 ? (
            <Text style={styles.price}>Free</Text>
          ) : (
            <Text style={styles.price}>₹ {price}</Text>
          )}
        </View>
      </View>
    </View>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    addItemToCart: (audiobook) => dispatch(actions.addToCart({ audiobook })),
  };
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    width: width / 2 - 20,
    height: width / 1.7,
    borderRadius: 5,
    marginTop: 20,
    marginBottom: 5,
    marginLeft: 10,
    elevation: 2.5,
    backgroundColor: "white",
  },
  icon: {
    position: "absolute",
    top: 5,
    left: width / 2.28 - 35,
    zIndex: 1,
    backgroundColor: "#3CB371",
    padding: 10,
    borderRadius: 50,
    elevation: 4,
  },
  image: {
    width: width / 2 - 20,
    height: width / 2.35,
    resizeMode: "stretch",
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  detail: {
    padding: 5,
  },

  title: {
    fontSize: 13,
  },
  summary: {
    fontWeight: "300",
    fontSize: 11,
    color: "grey",
  },
  priceNrating: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  duration: {
    marginTop: 6,
    fontWeight: "300",
    fontSize: 10,
    color: "grey",
  },
  price: {
    fontSize: 10,
    // marginTop: 3,
    backgroundColor: "#3CB371",
    color: "white",
    padding: 3,
    borderRadius: 5,
  },
});

export default connect(null, mapDispatchToProps)(AudiobookCard);
