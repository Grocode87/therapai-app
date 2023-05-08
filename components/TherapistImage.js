import React from "react";
import { View, Image } from "react-native";

const TherapistImage = ({ therapist }) => {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        backgroundColor: "white",
        padding: 5,
        borderRadius: 10,
      }}
    >
      <Image
        style={{
          width: "100%",
          height: "100%",
          aspectRatio: 1,
          borderRadius: 50,
        }}
        source={therapist?.image}
      />
    </View>
  );
};

export default TherapistImage;
