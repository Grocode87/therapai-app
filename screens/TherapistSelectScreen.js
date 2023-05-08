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
import TherapistImage from "../components/TherapistImage";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/authContext";
import { getUserData } from "../services/api";

const TherapistCard = ({ therapist, navigation, selected }) => {
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
          borderWidth: selected ? 2 : 0,
          borderColor: "#fff",
        }}
      >
        <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
          <View style={{ flex: 1 }}>
            <TherapistImage therapist={therapist} />
          </View>
          <View
            style={{
              marginLeft: 20,
              flex: 4,
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
              {therapist.name}{" "}
              <Text style={{ fontWeight: "normal" }}>
                {selected && "(Current)"}
              </Text>
            </Text>
            <Text style={{ color: "white" }}>{therapist.tagline}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const TherapistSelectScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { data: userData } = useQuery(["userData"], async () => {
    token = await user.getIdToken();
    return getUserData(token, user.uid);
  });

  return (
    <LinearGradient colors={["#89CFF0", "#2291C5"]} style={{ flex: 1 }}>
      <ScrollView style={{ padding: 20, paddingHorizontal: 10 }}>
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

          <View style={{ gap: 10, marginBottom: 20 }}>
            {therapists.map((therapist, idx) => (
              <TherapistCard
                therapist={therapist}
                key={idx}
                navigation={navigation}
                selected={userData?.therapist === therapist.name}
              />
            ))}
          </View>
        </SafeAreaView>
      </ScrollView>
    </LinearGradient>
  );
};

export default TherapistSelectScreen;
