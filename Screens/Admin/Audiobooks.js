import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  Button,
} from "react-native";
import { Header, Item, Input, Icon, VStack, Heading } from "native-base";
// import Icon from "react-native-vector-icons/FontAwesome";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import baseUrl from "../../assets/common/baseUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ListItem from "./ListItem";
import EasyButton from "../../Shared/StyledComponents/EasyButton";

var { height, width } = Dimensions.get("window");

const ListHeader = () => {
  return (
    <View elevation={1} style={styles.listHeader}>
      <View style={styles.headerItem}></View>
      <View style={styles.headerItem}>
        <Text style={{ fontWeight: "600" }}>Image</Text>
      </View>
      <View style={styles.headerItem}>
        <Text style={{ fontWeight: "600" }}>Title</Text>
      </View>
      <View style={styles.headerItem}>
        <Text style={{ fontWeight: "600" }}>Category</Text>
      </View>
      <View style={styles.headerItem}>
        <Text style={{ fontWeight: "600" }}>Price</Text>
      </View>
    </View>
  );
};

const Audiobooks = (props) => {
  const [audiobookList, setAudiobookList] = useState();
  const [audiobookFilter, setAudiobookFilter] = useState();
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState();

  useFocusEffect(
    useCallback(() => {
      // Get Token
      AsyncStorage.getItem("jwt")
        .then((res) => {
          setToken(res);
        })
        .catch((error) => console.log(error));

      axios.get(`${baseUrl}audiobooks`).then((res) => {
        setAudiobookList(res.data);
        setAudiobookFilter(res.data);
        setLoading(false);
      });

      return () => {
        setAudiobookList();
        setAudiobookFilter();
        setLoading(true);
      };
    }, [])
  );

  const searchAudiobook = (text) => {
    if (text == "") {
      setAudiobookFilter(audiobookList);
    }
    setAudiobookFilter(
      audiobookList.filter((i) =>
        i.title.toLowerCase().includes(text.toLowerCase())
      )
    );
  };

  const deleteAudiobook = (id) => {
    axios
      .delete(`${baseUrl}audiobooks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const audiobooks = audiobookFilter.filter((item) => item.id !== id);
        setAudiobookFilter(audiobooks);
      })
      .catch((error) => console.log(error));
  };

  return (
    <View>
      <View style={styles.buttonContainer}>
        <EasyButton
          secondary
          medium
          onPress={() => props.navigation.navigate("Orders")}
        >
          <MaterialIcons name="shopping-bag" size={18} color="white" />
          <Text style={styles.buttonText}>Orders</Text>
        </EasyButton>
        <EasyButton
          secondary
          medium
          onPress={() => props.navigation.navigate("AudiobookForm")}
        >
          <MaterialIcons name="add" size={18} color="white" />
          <Text style={styles.buttonText}>Products</Text>
        </EasyButton>
        <EasyButton
          secondary
          medium
          onPress={() => props.navigation.navigate("Categories")}
        >
          <MaterialIcons name="add" size={18} color="white" />
          <Text style={styles.buttonText}>Categories</Text>
        </EasyButton>
      </View>
      <Input
        onChangeText={(text) => searchAudiobook(text)}
        placeholder="Search Audiobooks"
        borderRadius="4"
        py="3"
        px="1"
        m="3"
        alignSelf="center"
        fontSize="14"
        backgroundColor="white"
        InputLeftElement={
          <Icon
            m="2"
            ml="3"
            size="6"
            color="gray.400"
            as={<MaterialIcons name="search" />}
          />
        }
      />
      {loading ? (
        <View style={styles.spinner}>
          <ActivityIndicator size="large" color="red" />
        </View>
      ) : (
        <FlatList
          data={audiobookFilter}
          ListHeaderComponent={ListHeader}
          renderItem={({ item, index }) => (
            <ListItem
              {...item}
              navigation={props.navigation}
              index={index}
              delete={deleteAudiobook}
            />
          )}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
};

export default Audiobooks;

const styles = StyleSheet.create({
  listHeader: {
    flexDirection: "row",
    padding: 5,
    backgroundColor: "gainsboro",
  },
  headerItem: {
    margin: 3,
    width: width / 6,
  },
  spinner: {
    height: height / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    marginBottom: 160,
    backgroundColor: "white",
  },
  buttonContainer: {
    margin: 20,
    alignSelf: "center",
    flexDirection: "row",
  },
  buttonText: {
    marginLeft: 4,
    color: "white",
  },
});
