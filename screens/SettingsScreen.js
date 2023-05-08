import { useQuery } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/authContext";
import { getUserData } from "../services/api";
import { formatDate } from "../utils/utils";

const SettingsItemInfo = ({ contentLeft, contentRight, onPress }) => {
  return (
    <SettingsItem onPress={onPress}>
      <View style={styles.settingsItemInfo}>
        <Text style={styles.settingsItemInfoText}>{contentLeft}</Text>
        <Text style={styles.settingsItemInfoTextDark}>{contentRight}</Text>
      </View>
    </SettingsItem>
  );
};

const SettingsItemArrow = ({ content, onPress }) => {
  return (
    <SettingsItem onPress={onPress}>
      <View style={styles.settingsItemArrow}>
        <Text style={styles.settingsItemArrowText}>{content}</Text>
        <Ionicons name="ios-arrow-forward" size={24} color="#f2f2f2" />
      </View>
    </SettingsItem>
  );
};

const SettingsItem = ({ children, onPress }) => {
  return (
    <View>
      {onPress ? (
        <TouchableOpacity onPress={onPress}>
          <View style={styles.settingsItem}>{children}</View>
        </TouchableOpacity>
      ) : (
        <View style={styles.settingsItem}>{children}</View>
      )}
    </View>
  );
};

const SettingsSection = ({ title, children }) => {
  return (
    <View>
      <Text style={styles.sectionHeader}>{title}</Text>
      <View style={styles.sectionChildrenWrapper}>{children}</View>
    </View>
  );
};

const SettingsScreen = () => {
  const { user, logout } = useAuth();
  const { data: userData } = useQuery(["userData"], async () => {
    token = await user.getIdToken();
    return getUserData(token, user.uid);
  });

  const handlePrivacyPolicyPress = () => {
    Linking.openURL("https://www.therapai.ca/privacy-policy");
  };
  const handleToSPress = () => {
    Linking.openURL("https://www.therapai.ca/terms-of-service");
  };
  const handleFeedbackPress = () => {
    Linking.openURL("https://wp6snie0e0s.typeform.com/to/VAFQVe5m");
  };
  const handleContactSupportPress = () => {
    Linking.openURL("mailto:support@therapai.ca");
  };

  const handleSignOutPress = () => {
    logout();
  };

  return (
    <LinearGradient colors={["#89CFF0", "#89CFF0"]} style={{ flex: 1 }}>
      <ScrollView>
        <SafeAreaView style={styles.container}>
          <SettingsSection title="Account Information">
            <SettingsItemInfo
              contentLeft="First Name"
              contentRight={userData.first_name}
            />
            <SettingsItemInfo
              contentLeft="Last Name"
              contentRight={userData.last_name}
            />
            <SettingsItemInfo
              contentLeft="Birthday"
              contentRight={formatDate(new Date(userData.birthday))}
            />
          </SettingsSection>

          <SettingsSection title="Feedback">
            <SettingsItem>
              <Text style={styles.settingsItemInfoText}>
                We're in beta right now. This app is a work in progress and we
                genuinely want and value your feedback. Here's how:
              </Text>
            </SettingsItem>
            <SettingsItemInfo
              contentLeft="Submit Feedback"
              contentRight="Go to form"
              onPress={handleFeedbackPress}
            />
            <SettingsItemInfo
              contentLeft="Something's Wrong"
              contentRight="Contact support"
              onPress={handleContactSupportPress}
            />
          </SettingsSection>

          <SettingsSection title="About">
            <SettingsItemArrow
              content="Privacy Policy"
              onPress={handlePrivacyPolicyPress}
            />
            <SettingsItemArrow
              content="Terms of Service"
              onPress={handleToSPress}
            />
          </SettingsSection>

          <SettingsSection title="Leave">
            <SettingsItemInfo
              contentLeft="Sign Out"
              onPress={handleSignOutPress}
            />
          </SettingsSection>
        </SafeAreaView>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 110,
    paddingHorizontal: 5,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
    marginTop: 20,
    paddingLeft: 10,
  },
  sectionChildrenWrapper: {
    gap: 3,
  },
  settingsItem: {
    backgroundColor: "#57A0E4",
    padding: 20,
    paddingVertical: 15,
    borderRadius: 10,
  },
  settingsItemInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  settingsItemInfoText: {
    fontSize: 16,
    color: "white",
  },
  settingsItemInfoTextDark: {
    fontSize: 16,
    color: "#f2f2f2",
  },
  settingsItemArrow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  settingsItemArrowText: {
    fontSize: 16,
    color: "white",
  },
});

export default SettingsScreen;
