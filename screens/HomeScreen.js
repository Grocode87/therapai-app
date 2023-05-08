import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Button,
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/authContext";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { getUserData, processSession } from "../services/api";
import moment from "moment/moment";
import { useUserHistory } from "../hooks/useUserHistory";
import Journal from "../components/home/Journal";

const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { data: userData } = useQuery(
    ["userData"],
    async () => {
      token = await user.getIdToken();
      return getUserData(token, user.uid);
    },
    {
      enabled: user != null,
    }
  );

  // for the animated header
  const scrollY = useRef(new Animated.Value(0)).current;
  const HEADER_MAX_HEIGHT = 180;
  const HEADER_MIN_HEIGHT = 140;
  const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

  // For the continue conversation button
  const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);
  const continueConvoTranslateY = useRef(new Animated.Value(0)).current;
  const [scrollDirection, setScrollDirection] = useState("up");

  useEffect(() => {
    // Animate the continue conversation button based on scroll direction
    // Disappear when scrolling down, reappear when scrolling up
    Animated.timing(continueConvoTranslateY, {
      toValue: scrollDirection === "down" ? 300 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [scrollDirection, continueConvoTranslateY]);

  const handleOnScroll = (event) => {
    /**
     * sets scroll direction and updates scrollY value
     */
    Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
      useNativeDriver: false,
    })(event);

    // Handle the new scroll direction
    const currentOffset = event.nativeEvent.contentOffset.y;
    const direction = currentOffset > 1 ? "down" : "up";
    setScrollDirection(direction);
  };

  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: "clamp",
  });

  const separatorOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const blurIntensity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 80],
    extrapolate: "clamp",
  });

  const headerStyle = {
    height: headerHeight,
    blurRadius: 10,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  };

  const separatorStyle = {
    opacity: 0,
    height: 1,
    backgroundColor: "white",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  };

  useEffect(() => {
    console.log("PROCESSING SESSIONS");
    userData?.sessions.forEach((session) => {
      if (session.end_time && !session.processed) {
        console.log("FOUND SESSION TO PROCESS");
        processSession(user, userData, session);
      }
    });
  }, [userData]);

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient colors={["#89CFF0", "#2291C5"]} style={{ flex: 1 }}>
        <ScrollView
          style={styles.scrollView}
          scrollEventThrottle={16}
          onScroll={handleOnScroll}
        >
          <View style={{ height: HEADER_MAX_HEIGHT }} />
          <View style={styles.content}>
            <View style={styles.card}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={styles.card_title}>Your AI Therapist</Text>
                <Pressable
                  onPress={() => navigation.navigate("TherapistSelect")}
                >
                  <Text style={{ color: "white" }}>Switch</Text>
                </Pressable>
              </View>
              <View style={{ flex: 1, flexDirection: "row", marginTop: 20 }}>
                <View style={{ width: "35%" }}>
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
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={{ fontSize: 20, color: "white" }}>
                    {userData.therapist || "None"}
                  </Text>
                  <Pressable
                    onPress={() =>
                      navigation.navigate("Chat", { name: "Jane" })
                    }
                    style={{
                      height: 40,
                      backgroundColor: "#F5A623",
                      color: "white",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 10,
                    }}
                  >
                    <Text style={{ fontSize: 16, color: "white" }}>
                      Chat Now
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.card_title}>Your Journal</Text>
              <Journal />
            </View>
          </View>
        </ScrollView>
      </LinearGradient>

      {userData?.active_session && (
        <Animated.View
          style={{
            position: "absolute",
            bottom: 80,
            width: "100%",
            paddingHorizontal: 40,
            transform: [{ translateY: continueConvoTranslateY }],
          }}
        >
          <Pressable
            onPress={() => {
              navigation.navigate("Chat");
            }}
            style={{
              borderRadius: 20,
              overflow: "hidden",
              borderWidth: 1,
              borderColor: "rgba(30, 30, 150, 0.3)",
            }}
          >
            <BlurView
              intensity={80}
              tint="light"
              style={{
                padding: 15,
                flexDirection: "row",
              }}
            >
              <Image
                style={{
                  height: "100%",
                  aspectRatio: 1,
                  borderRadius: 50,
                }}
                source={{
                  uri: "https://picsum.photos/200",
                }}
              />
              <View style={{ paddingLeft: 15 }}>
                <Text style={{ fontWeight: "500", fontSize: 16 }}>
                  Continue Conversation?
                </Text>
                <Text style={{ paddingTop: 10 }}>
                  From {moment(userData.active_session.start_time).fromNow()}
                </Text>
              </View>
            </BlurView>
          </Pressable>
        </Animated.View>
      )}

      <Animated.View style={headerStyle}>
        <AnimatedBlurView
          style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "flex-end",
            paddingBottom: 20,
            paddingHorizontal: 20,
          }}
          intensity={blurIntensity} // You can adjust the intensity of the blur effect
          tint={"default"}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={styles.intro_line_1}>Hey {userData.first_name},</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate("Settings")}
            >
              <Ionicons name="ios-settings-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>
          <Text style={styles.intro_line_2}>Let's make today a good day</Text>
        </AnimatedBlurView>
        <Animated.View style={separatorStyle} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 25,
  },
  headerText: {
    marginTop: 50,
    fontSize: 20,
    textAlign: "center",
  },
  intro_container: {},
  intro_line_1: {
    fontSize: 40,
    fontWeight: "600",
    color: "white",
  },
  intro_line_2: {
    paddingTop: 5,
    fontSize: 20,
    fontWeight: "400",
    color: "white",
  },

  card: {
    backgroundColor: "rgba(5, 0, 255, 0.13)",
    borderRadius: 10,
    padding: 20,
    marginBottom: 40,
  },
  card_title: {
    fontSize: 20,
    fontWeight: "500",
    color: "white",
  },
});

export default HomeScreen;
