import React from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { VStack, Left, Body, Text } from "native-base";

var { width } = Dimensions.get("window");

const SearchedAudiobooks = (props) => {
  // console.log("SearchedAudiobooks props-->", props);
  const { audiobooksFiltered } = props;
  return (
    <>
      {audiobooksFiltered.length > 0 ? (
        <FlatList
          numColumns={2}
          data={audiobooksFiltered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={(audiobooksFiltered) => {
                props.navigation.navigate("Audiobook Detail", {
                  item: item,
                });
              }}
            >
              <View style={styles.container}>
                <Image
                  style={styles.stretch}
                  source={{
                    uri: item.image
                      ? item.image
                      : "https://cdn.pixabay.com/photo/2012/04/01/17/29/box-23649_960_720.png",
                  }}
                />
                <Text>{item.title}</Text>
                <Text>{item.summary}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      ) : (
        <View style={styles.center}>
          <Text style={{ alignSelf: "center" }}>
            No audiobooks match the selected criteria
          </Text>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  center: {
    justifyContent: "center",
    alignItems: "center",
    height: 100,
  },
  container: {
    width: width / 2 - 20,
    height: width / 1.7,
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    marginBottom: 5,
    marginLeft: 10,
    alignItems: "center",
    elevation: 8,
    backgroundColor: "white",
  },
  stretch: {
    width: 70,
    height: 70,
    resizeMode: "contain",
  },
});

export default SearchedAudiobooks;
