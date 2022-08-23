import React, { useState, useEffect } from "react";

import { Image, StyleSheet, Dimensions, View, ScrollView } from "react-native";
import Swiper from "react-native-swiper/src";
import axios from "axios";
import baseUrl from "../assets/common/baseUrl";

var { width } = Dimensions.get("window");

const Banner = () => {
  const [bannerData, setBannerData] = useState([]);
  useEffect(() => {
    //Banner
    axios
      .get(`${baseUrl}audiobooks/banner`)
      .then((res) => {
        setBannerData(res.data.map((i) => i.url));
      })
      .catch((error) => {
        console.log("Api call error-->", error);
      });

    return () => {
      setBannerData([]);
    };
  }, []);

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.swiper}>
          <Swiper
            style={{ height: width / 1.8 }}
            showButtons={false}
            autoplay={true}
            autoplayTimeout={3}
          >
            {bannerData.map((item) => {
              return (
                <Image
                  key={item}
                  style={styles.imageBanner}
                  resizeMode="stretch"
                  source={{ uri: item }}
                />
              );
            })}
          </Swiper>
          <View style={{ height: 20 }}></View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  swiper: {
    width: width,
    alignItems: "center",
    marginTop: 10,
    marginLeft: 15,
  },
  imageBanner: {
    height: width / 1.8,
    width: width - 30,
    borderRadius: 5,
  },
});

export default Banner;
