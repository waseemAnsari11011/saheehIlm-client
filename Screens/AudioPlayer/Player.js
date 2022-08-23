import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
  ScrollView,
  BackHandler,
} from "react-native";
import React, { useEffect, useState, useContext } from "react";
import { PlayerContext } from "../../Context/playerContext";
import Slider from "@react-native-community/slider";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

let { height } = Dimensions.get("window");

import TrackPlayer, {
  State,
  usePlaybackState,
  useProgress,
  Event,
  useTrackPlayerEvents,
  Capability,
} from "react-native-track-player";
import Modal from "react-native-modal";
import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Player = (props) => {
  const playbackState = usePlaybackState();
  const progress = useProgress();

  const bookImage = props.route.params.bookImage;
  const { setIsPlaying } = useContext(PlayerContext);

  const [chapterIndex, setChapterIndex] = useState(0);
  const [chapters, setChapters] = useState(props.route.params.chapters);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isChapterModalVisible, setChapterModalVisible] = useState(false);

  const narrationSpeed = [
    0.5, 0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2,
  ];

  useEffect(() => {
    (async () => {
      await TrackPlayer.setupPlayer();
      await TrackPlayer.add(props.route.params.chapters);
      await TrackPlayer.updateOptions({
        capabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.Stop,
          Capability.JumpForward,
          Capability.JumpBackward,
        ],
        compactCapabilities: [Capability.Play, Capability.Pause],
      });
      await TrackPlayer.play();

      let trackIndex = await TrackPlayer.getCurrentTrack();

      setIsPlaying(true);
      setChapterIndex(trackIndex);
    })();
    return () => {
      setIsPlaying(false);
      setChapterIndex(0);
    };
  }, []);

  const togglePlayback = async (playbackState) => {
    // console.log("playbackState", playbackState);
    if (chapters !== null) {
      if (playbackState === State.Playing) {
        await TrackPlayer.pause();

        setIsPlaying(true);
      } else {
        await TrackPlayer.play();
        setIsPlaying(false);
      }
    }
  };

  useTrackPlayerEvents([Event.PlaybackTrackChanged], async (event) => {
    if (event.type === Event.PlaybackTrackChanged && event.nextTrack != null) {
      let trackIndex = await TrackPlayer.getCurrentTrack();

      setIsPlaying(true);
      setChapterIndex(trackIndex);
    }
  });

  TrackPlayer.addEventListener(Event.RemoteJumpForward, async () => {
    await TrackPlayer.seekTo(progress.position + 15);
  });
  TrackPlayer.addEventListener(Event.RemoteJumpBackward, async () => {
    await TrackPlayer.seekTo(progress.position - 15);
  });

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const toggleChapterModal = () => {
    setChapterModalVisible(!isChapterModalVisible);
  };

  return (
    <View style={styles.container}>
      <Modal
        isVisible={isModalVisible}
        backdropColor={"black"}
        style={{
          flexDirection: "column",
          justifyContent: "flex-end",
          margin: 0,
        }}
      >
        <View style={styles.modalContent}>
          <View style={{ position: "absolute", right: 10, top: 10 }}>
            <AntDesign
              name="close"
              size={24}
              color="black"
              onPress={toggleModal}
            />
          </View>
          <Text style={{ fontSize: 18, fontWeight: "500" }}>
            Narration Speed
          </Text>
          {narrationSpeed.map((item, index) => (
            <TouchableOpacity
              style={{
                width: "100%",
                marginTop: 10,
                height: 30,
                borderBottomWidth: 0.5,
              }}
              key={index}
              onPress={async () => {
                await TrackPlayer.setRate(item);
                toggleModal();
              }}
            >
              <Text style={{ fontSize: 16 }}>{item}x</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Modal>
      <Modal
        isVisible={isChapterModalVisible}
        backdropColor={"black"}
        style={{
          flexDirection: "column",
          justifyContent: "flex-end",

          margin: 0,
        }}
      >
        <View style={styles.modalContent}>
          <AntDesign
            style={{ position: "absolute", right: 10, top: 10, padding: 5 }}
            name="close"
            size={24}
            color="black"
            onPress={toggleChapterModal}
          />

          <Text style={{ fontSize: 18, fontWeight: "500", marginBottom: 5 }}>
            Chapters
          </Text>
          <ScrollView>
            {chapters.map((item, index) => (
              <TouchableOpacity
                style={{
                  // backgroundColor: "pink",
                  flexDirection: "row",
                  alignItems: "center",
                  height: 55,
                  borderBottomWidth: 0.5,
                }}
                key={index}
                onPress={async () => {
                  await TrackPlayer.skip(index);
                  toggleChapterModal();
                }}
              >
                <Text style={{ fontSize: 15, marginRight: 10 }}>
                  {index + 1}
                </Text>
                <Text style={{ fontSize: 15 }}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>
      <View style={styles.up}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: 15, marginTop: 10 }}>
            Chapter {chapterIndex + 1}/{chapters.length}
          </Text>
        </View>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: 20,
          }}
        >
          <Image
            style={styles.image}
            resizeMode="contain"
            source={{
              uri: bookImage
                ? bookImage
                : "https://cdn.pixabay.com/photo/2012/04/01/17/29/box-23649_960_720.png",
            }}
          />
        </View>
      </View>
      <View style={styles.down}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <Text
            style={{ textAlign: "center", fontSize: 17, fontWeight: "500" }}
          >
            {chapterIndex ? chapters[chapterIndex].title : chapters[0].title}
          </Text>
        </View>
        <Slider
          style={{ height: 10, width: "100%" }}
          value={progress.position}
          minimumValue={0}
          maximumValue={progress.duration}
          minimumTrackTintColor="#3CB371"
          maximumTrackTintColor="#000000"
          thumbTintColor="#3CB371"
          onSlidingComplete={async (value) => {
            await TrackPlayer.seekTo(value);
          }}
        />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            // backgroundColor: "pink",
          }}
        >
          <Text style={styles.seekBartxt}>
            {new Date(progress.position * 1000).toISOString().substr(14, 5)}
          </Text>
          {/* <Text style={styles.seekBartxt}>10h 53m left</Text> */}
          <Text style={styles.seekBartxt}>
            -{" "}
            {new Date((progress.duration - progress.position) * 1000)
              .toISOString()
              .substr(14, 5)}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",

            alignItems: "center",
          }}
        >
          <TouchableOpacity
            disabled={chapterIndex === 0 ? true : false}
            onPress={async () => {
              if (chapterIndex === 0) {
                return null;
              } else {
                await TrackPlayer.skipToPrevious();
              }
            }}
          >
            <Ionicons
              name="play-skip-back-outline"
              size={43}
              color={chapterIndex === 0 ? "#00000090" : "black"}
            />
          </TouchableOpacity>

          <TouchableOpacity>
            <MaterialCommunityIcons
              name="rewind-15"
              size={33}
              color="black"
              onPress={async () => {
                await TrackPlayer.seekTo(progress.position - 15);
              }}
            />
          </TouchableOpacity>

          {playbackState === State.Playing ? (
            <TouchableOpacity>
              <Ionicons
                name="pause-circle"
                size={90}
                color="black"
                onPress={() => togglePlayback(playbackState)}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity>
              <Ionicons
                name="play-circle"
                size={90}
                color="black"
                onPress={() => togglePlayback(playbackState)}
              />
            </TouchableOpacity>
          )}
          <TouchableOpacity>
            <MaterialCommunityIcons
              name="fast-forward-15"
              size={33}
              color="black"
              onPress={async () => {
                await TrackPlayer.seekTo(progress.position + 15);
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons
              name="play-skip-forward-outline"
              size={43}
              color="black"
              onPress={async () => {
                if (chapterIndex === chapters.length - 1) {
                  await TrackPlayer.skip(0);
                } else {
                  await TrackPlayer.skipToNext();
                }
              }}
            />
          </TouchableOpacity>
        </View>
        <View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity
              style={styles.bottom4iconscenter}
              onPress={toggleModal}
            >
              <Ionicons name="speedometer-outline" size={23} color="grey" />
              <Text style={styles.bottom4iconsTxt}>Speed</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.bottom4iconscenter}
              onPress={toggleChapterModal}
            >
              <MaterialCommunityIcons
                name="playlist-play"
                size={23}
                color="grey"
              />
              <Text style={styles.bottom4iconsTxt}>Chapters</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity style={styles.bottom4iconscenter}>
              <MaterialCommunityIcons
                name="note-edit-outline"
                size={23}
                color="grey"
              />
              <Text style={styles.bottom4iconsTxt}>Add Note</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.bottom4iconscenter}>
              <Entypo name="stopwatch" size={23} color="grey" />
              <Text style={styles.bottom4iconsTxt}>sleep</Text>
            </TouchableOpacity> */}
          </View>
        </View>
      </View>
    </View>
  );
};

export default Player;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "white",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 22,
    justifyContent: "center",
    // alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  up: {
    backgroundColor: "#00000009",
    height: height / 2,
    flexDirection: "column",
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: "stretch",
  },
  down: {
    height: height / 2.5,
    flexDirection: "column",
    justifyContent: "space-between",
    paddingTop: 5,
    padding: 15,
    paddingBottom: 2,
    // backgroundColor: "3CB37125",
  },
  seekBartxt: {
    fontSize: 12,
    color: "grey",
  },
  bottom4iconscenter: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  bottom4iconsTxt: {
    fontSize: 11,
    color: "grey",
  },
});
