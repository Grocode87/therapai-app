import { Image, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { therapists } from "../../utils/constants";
import TherapistImage from "../TherapistImage";

const ChatHeader = ({ onEndSession, sessionData }) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        height: insets.top + 60,
        borderColor: "#d1eeff",
        borderBottomWidth: 1,
        backgroundColor: "#89CFF0",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingTop: insets.top,

        paddingHorizontal: 20,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          height: "100%",
        }}
      >
        <View style={{ width: 40, height: 40 }}>
          <TherapistImage
            therapist={therapists.find(
              (therapist) => therapist.name === sessionData?.therapist
            )}
          />
        </View>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            marginLeft: 10,
            color: "white",
          }}
        >
          {sessionData?.therapist}
        </Text>
      </View>
      <TouchableOpacity
        style={{ flexDirection: "row", alignItems: "center" }}
        onPress={() => onEndSession()}
      >
        {/**<Ionicons name="close-outline" size={30} color="white" /> */}
        <Text style={{ color: "white" }}>End Session</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ChatHeader;
