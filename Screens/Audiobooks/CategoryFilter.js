import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  FlatList,
} from "react-native";
import { ListItem, Badge, Text } from "native-base";
let { width } = Dimensions.get("window");

const CategoryFilter = (props) => {
  return (
    <ScrollView bounces={true} horizontal={true}>
      <TouchableOpacity
        key={1}
        onPress={() => {
          props.categoryFilter("all"), props.setActive(-1);
        }}
      >
        <Badge
          style={[
            styles.badge,
            props.active == -1 ? styles.active : styles.inactive,
          ]}
        >
          <Text style={{ color: "white" }}>All Audiobooks</Text>
        </Badge>
      </TouchableOpacity>

      {props.categories.map((item) => {
        return (
          <TouchableOpacity
            key={item.id}
            onPress={() => {
              props.categoryFilter(item.id),
                props.setActive(props.categories.indexOf(item));
            }}
          >
            <Badge
              style={[
                styles.badge,

                props.active == props.categories.indexOf(item)
                  ? styles.active
                  : styles.inactive,
              ]}
            >
              <Text style={{ color: "white" }}>{item.name}</Text>
            </Badge>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  active: {
    backgroundColor: "#3CB371",
  },
  inactive: {
    backgroundColor: "#3CB37180",
  },
  badge: {
    borderRadius: 50,
    marginRight: 3,
    height: width / 10,
    margin: 10,
  },
});

export default CategoryFilter;
