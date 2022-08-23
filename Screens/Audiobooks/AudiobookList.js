import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React from "react";
import AudiobookCard from "./AudiobookCard";

let { width } = Dimensions.get("window");

export default function AudiobookList(props) {
  const { item } = props;

  return (
    <TouchableOpacity
      style={{ width: "50%" }}
      onPress={() =>
        props.navigation.navigate("Audiobook Detail", { item: item })
      }
    >
      <View style={{ width: width / 2 }}>
        <AudiobookCard {...item} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({});
