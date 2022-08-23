import {
  StyleSheet,
  View,
  ActivityIndicator,
  FlatList,
  ScrollView,
  Dimensions,
} from "react-native";
import React, { useState, useCallback, useContext } from "react";
import { useFocusEffect } from "@react-navigation/native";
import AudiobookList from "./AudiobookList";
import {
  VStack,
  Input,
  Button,
  IconButton,
  Icon,
  Text,
  NativeBaseProvider,
  Center,
  Box,
  Divider,
  Heading,
} from "native-base";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import SearchedAudiobooks from "./SearchedAudiobooks";
import Banner from "../../Shared/Banner";
import CategoryFilter from "./CategoryFilter";
import { PlayerContext } from "../../Context/playerContext";

import baseUrl from "../../assets/common/baseUrl";
import axios from "axios";

let { height } = Dimensions.get("window");

export default function AudiobookContainer(props) {
  const [searchtxt, setSearchtxt] = useState();
  const [audiobooks, setAudiobooks] = useState([]);
  const [audiobooksFiltered, setAudiobooksFiltered] = useState([]);
  const [focus, setFocus] = useState();
  const [categories, setCategories] = useState([]);
  const [active, setActive] = useState();
  const [initialState, setInitialState] = useState([]);
  const [audiobooksCtg, setAudiobooksCtg] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      setFocus(false);

      setActive(-1);

      // Audiobooks
      axios
        .get(`${baseUrl}audiobooks`)
        .then((res) => {
          // console.log("res-->", res.data);
          setAudiobooks(res.data);
          setAudiobooksFiltered(res.data);
          setAudiobooksCtg(res.data);
          setInitialState(res.data);
          setLoading(false);
        })
        .catch((error) => {
          console.log("Api call error-->", error);
        });

      // Categories
      axios
        .get(`${baseUrl}categories`)
        .then((res) => {
          setCategories(res.data);
        })
        .catch((error) => {
          console.log("Api call error");
        });

      return () => {
        setAudiobooks([]);
        setAudiobooksFiltered([]);
        setFocus();
        setCategories([]);
        setActive();
        setInitialState();
      };
    }, [])
  );

  // Audiobook Methods
  const searchAudiobook = (text) => {
    setFocus(true);
    setAudiobooksFiltered(
      audiobooks.filter((i) =>
        i.title.toLowerCase().includes(text.toLowerCase())
      )
    );
  };

  const openList = () => {
    setAudiobooksFiltered(audiobooks);
    setFocus(true);
  };

  const onBlur = () => {
    setSearchtxt();
    setFocus(false);
  };

  // Categories
  const changeCtg = (ctg) => {
    // console.log("ctg====", ctg);
    // console.log("audiobooks-->", audiobooks);
    {
      ctg === "all"
        ? [setAudiobooksCtg(initialState), setActive(true)]
        : [
            setAudiobooksCtg(audiobooks.filter((i) => i.category === ctg)),
            setActive(true),
          ];
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#FAFAFA" }}>
      {loading == false ? (
        <>
          <View style={{ elevation: 3 }}>
            <Input
              value={searchtxt}
              onChangeText={(text) => {
                [searchAudiobook(text), setSearchtxt(text)];
              }}
              onFocus={openList}
              placeholder="Search Audiobooks"
              borderRadius="3"
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
              InputRightElement={
                focus == true ? (
                  <Icon
                    mr="2"
                    size="5"
                    color="gray"
                    onPress={onBlur}
                    as={<MaterialIcons name="close" />}
                  />
                ) : null
              }
            />
          </View>

          {focus == true ? (
            audiobooksFiltered.length > 0 ? (
              <ScrollView>
                <View style={styles.listContainer}>
                  {audiobooksFiltered.map((item) => {
                    return (
                      <AudiobookList
                        navigation={props.navigation}
                        key={item.id}
                        item={item}
                      />
                    );
                  })}
                </View>
              </ScrollView>
            ) : (
              <View style={[styles.center, { height: height / 2 }]}>
                <Text>No audiobooks match the selected criteria</Text>
              </View>
            )
          ) : (
            <ScrollView horizontal={false}>
              <View>
                <Banner />
              </View>
              <View>
                <CategoryFilter
                  categories={categories}
                  categoryFilter={changeCtg}
                  audiobooksCtg={audiobooksCtg}
                  active={active}
                  setActive={setActive}
                />
              </View>
              {audiobooksCtg.length > 0 ? (
                <View style={styles.listContainer}>
                  {audiobooksCtg.map((item) => {
                    return (
                      <AudiobookList
                        navigation={props.navigation}
                        key={item.id}
                        item={item}
                      />
                    );
                  })}
                </View>
              ) : (
                <View style={[styles.center, { height: height / 2 }]}>
                  <Text>No audiobooks found</Text>
                </View>
              )}
            </ScrollView>
          )}
        </>
      ) : (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="red" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexWrap: "wrap",
  },
  listContainer: {
    // height: height + 100,
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    flexWrap: "wrap",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
