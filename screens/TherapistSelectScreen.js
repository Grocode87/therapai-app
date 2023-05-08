import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { therapists, therapist_traits } from "../utils/constants";

const TherapistCard = ({ therapist, navigation }) => {
  const expandedView = () => {
    return (
      <View>
        <Text style={{ color: "white", paddingTop: 10 }}>
          {therapist.description}
        </Text>

        <Text
          style={{
            color: "white",
            fontSize: 16,
            fontWeight: "500",
            marginTop: 20,
          }}
        >
          Traits
        </Text>
        <View
          style={{
            flexDirection: "column",
            gap: 10,
          }}
        >
          {Object.entries(therapist.traits).map(([trait, level], idx) => {
            return (
              <View key={idx} style={{}}>
                <TraitScale trait={therapist_traits[trait]} level={level} />
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("TherapistDetail", { therapist: therapist });
      }}
    >
      <View
        style={{
          backgroundColor: "rgba(5, 0, 255, 0.13)",
          borderRadius: 10,
          padding: 20,
        }}
      >
        <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
          <View style={{ width: "20%" }}>
            <Image
              style={{
                width: "100%",
                aspectRatio: 1,
                borderRadius: 50,
              }}
              source={{
                uri: "https://picsum.photos/200",
              }}
            />
          </View>
          <View
            style={{
              marginLeft: 20,
              flex: 1,
              flexDirection: "column",
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 16,
                fontWeight: "bold",
                paddingBottom: 5,
              }}
            >
              {therapist.name}
            </Text>
            <Text style={{ color: "white" }}>{therapist.tagline}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const TherapistSelectScreen = ({ navigation }) => {
  return (
    <LinearGradient colors={["#89CFF0", "#2291C5"]} style={{ flex: 1 }}>
      <ScrollView style={{ padding: 20 }}>
        <SafeAreaView>
          <View style={{ alignItems: "center" }}>
            <Text
              style={{
                color: "white",
                textAlign: "center",
                fontSize: 16,
                marginBottom: 20,
              }}
            >
              Each therapist has a unique personaliy and style. You can always
              switch to a different therapist.
            </Text>
          </View>

          <View style={{ gap: 20, marginBottom: 20 }}>
            {therapists.map((therapist, idx) => (
              <TherapistCard
                therapist={therapist}
                key={idx}
                navigation={navigation}
              />
            ))}
          </View>
        </SafeAreaView>
      </ScrollView>
    </LinearGradient>
  );
};

export default TherapistSelectScreen;
