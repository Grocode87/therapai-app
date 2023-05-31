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
import { CommonActions } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { therapists, therapist_traits } from "../utils/constants";
import CustomButton from "../components/CustomButton";
import { endSession, updateUserData } from "../services/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/authContext";
import TherapistImage from "../components/TherapistImage";
import { useUserData } from "../hooks/useUserData";

const TraitScale = ({ trait, level }) => {
  return (
    <View style={{ width: "100%" }}>
      <Text
        style={{
          textAlign: "center",
          color: "white",
          marginBottom: 5,
          fontWeight: "500",
        }}
      >
        {trait?.name}
      </Text>
      <View
        style={{
          width: "100%",
          height: 15,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: (level * 10 - 1).toString() + "%",
            height: "100%",
            backgroundColor: "white",
            borderTopLeftRadius: 10,
            borderBottomLeftRadius: 10,
          }}
        />
        <View
          style={{ width: 4, height: "100%", backgroundColor: "#3f3f3f" }}
        />
        <View
          style={{
            width: ((10 - level) * 10 - 1).toString() + "%",
            height: "100%",
            backgroundColor: "white",
            borderTopRightRadius: 10,
            borderBottomRightRadius: 10,
          }}
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingTop: 5,
        }}
      >
        <Text style={{ color: "white" }}>{trait?.high}</Text>
        <Text style={{ color: "white" }}>{trait?.low}</Text>
      </View>
    </View>
  );
};

const TherapistDetailScreen = ({ navigation, route }) => {
  // get the therapist from the navigation params
  const { therapist } = route.params;
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { userData } = useUserData();

  const updateUserMutation = useMutation(
    async (newData) => {
      const token = await user.getIdToken();

      return updateUserData(token, user.uid, newData);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["userData"]);
      },
    }
  );

  const onSelect = async () => {
    // set this as user's therapist
    setLoading(true);
    if (userData && userData.active_session) {
      await endSession(user, userData);
    }
    await updateUserMutation.mutateAsync({ therapist: therapist.name });
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Home" }],
      })
    );
    setLoading(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ padding: 20 }}>
        <SafeAreaView>
          <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
            <View style={{ width: "20%" }}>
              <TherapistImage therapist={therapist} />
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

          <View>
            <Text style={{ color: "white", paddingTop: 20 }}>
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
        </SafeAreaView>
      </ScrollView>
      <View
        style={{
          position: "absolute",
          bottom: 50,
          width: "100%",
          height: 50,
        }}
      >
        <View style={{ paddingHorizontal: 20 }}>
          <CustomButton
            text={"Select This Therapist"}
            onPress={onSelect}
            isLoading={loading}
          />
        </View>
      </View>
    </View>
  );
};

export default TherapistDetailScreen;
