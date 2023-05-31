import React from "react";
import { View, Image } from "react-native";

const TherapistImage = ({ therapist }) => {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        padding: 5,
      }}
    >
      <Image
        style={{
          width: "100%",
          height: "100%",
          aspectRatio: 1,
        }}
        source={therapist?.image}
      />
    </View>
  );
};

export default TherapistImage;
