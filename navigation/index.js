import * as React from "react";

import { useQuery } from "@tanstack/react-query";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import ChatScreen from "../screens/ChatScreen";
import RegisterScreen from "../screens/RegisterScreen";
import LoginScreen from "../screens/LoginScreen";
import { useAuth } from "../context/authContext";
import OnboardScreen from "../screens/OnboardScreen";
import { getUserData } from "../services/api";
import LandingScreen from "../screens/LandingScreen";
import VerifyScreen from "../screens/VerifyScreen";
import { View } from "react-native";
import SplashScreen from "../screens/SplashScreen";
import TherapistSelectScreen from "../screens/TherapistSelectScreen";
import TherapistDetailScreen from "../screens/TherapistDetailScren";
import SettingsScreen from "../screens/SettingsScreen";

const RootStack = createNativeStackNavigator();
const PublicStack = createNativeStackNavigator();
const PrivateStack = createNativeStackNavigator();
const OnboardingStack = createNativeStackNavigator();

function PublicNavigator() {
  return (
    <PublicStack.Navigator>
      <PublicStack.Screen
        name="Landing"
        component={LandingScreen}
        options={{ headerShown: false }}
      />
      <PublicStack.Screen
        name="Registration"
        component={RegisterScreen}
        options={{
          headerTransparent: true,
          headerBackTitleVisible: false,
          headerTitle: "",
          headerTintColor: "white",
        }}
      />
      <PublicStack.Screen
        name="Verify"
        component={VerifyScreen}
        options={{
          headerTransparent: true,
          headerBackTitleVisible: false,
          headerTitle: "",
          headerTintColor: "white",
        }}
      />
      <PublicStack.Screen name="Login" component={LoginScreen} />
    </PublicStack.Navigator>
  );
}
function OnboardingNavigator() {
  return (
    <OnboardingStack.Navigator
      screenOptions={{
        contentStyle: {
          backgroundColor: "#89CFF0",
        },
        headerTintColor: "white",
      }}
    >
      <OnboardingStack.Screen
        name="Welcome"
        component={OnboardScreen}
        options={{ headerShown: true, headerTransparent: true }}
        initialParams={{ currPage: 0 }}
      />
    </OnboardingStack.Navigator>
  );
}

function PrivateNavigator({ userData }) {
  return (
    <PrivateStack.Navigator
      screenOptions={{
        contentStyle: {
          backgroundColor: "#2291C5",
        },
      }}
      initialRouteName={userData.therapist ? "Home" : "TherapistSelect"}
    >
      <PrivateStack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "Home",
          headerShown: false,
        }}
      />
      <PrivateStack.Screen
        name="TherapistSelect"
        component={TherapistSelectScreen}
        options={{
          title: "Select a Therapist",
          headerTintColor: "white",
          headerBackground: () => {
            return (
              <View
                style={{
                  flex: 1,
                  backgroundColor: "#89CFF0",
                }}
              />
            );
          },
        }}
      />

      <PrivateStack.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          headerShown: false,
        }}
      />

      <PrivateStack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          headerLargeTitle: true,
          headerLargeTitleShadowVisible: false,
          headerTintColor: "white",
          headerStyle: {
            backgroundColor: "#89CFF0",
          },
        }}
      />

      <PrivateStack.Group screenOptions={{ presentation: "modal" }}>
        <PrivateStack.Screen
          name="TherapistDetail"
          component={TherapistDetailScreen}
          options={{
            headerShown: false,
          }}
        />
      </PrivateStack.Group>
    </PrivateStack.Navigator>
  );
}

const RootNavigator = () => {
  const { user, loading } = useAuth();
  const { data: userData, isLoading: userDataLoading } = useQuery(
    ["userData"],
    async () => {
      const token = await user.getIdToken();
      return getUserData(token, user.uid);
    },
    {
      enabled: user != null,
    }
  );

  let onboardingComplete =
    userData?.first_name && userData?.last_name && userData?.birthday;

  return (
    <RootStack.Navigator headerMode="none" headerShown={false}>
      {loading ? (
        <RootStack.Screen
          name="Splash"
          component={SplashScreen}
          options={{ headerShown: false }}
        />
      ) : //
      user && userData && !userDataLoading ? (
        onboardingComplete ? (
          <RootStack.Screen
            name="Private"
            children={() => <PrivateNavigator userData={userData} />}
            options={{ headerShown: false }}
          />
        ) : (
          <RootStack.Screen
            name="Onboarding"
            component={OnboardingNavigator}
            options={{ headerShown: false }}
          />
        )
      ) : (
        <RootStack.Screen
          name="Public"
          component={PublicNavigator}
          options={{ headerShown: false }}
        />
      )}
    </RootStack.Navigator>

    // logging in
    // display public stack until user, userData, and isLoading = false

    // sign up
    // display private stack unil user, userData, and isLoading = false, then if ()
  );
};

export default function Navigation() {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}
