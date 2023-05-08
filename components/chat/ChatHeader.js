import { Image, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
        <Image
          style={{
            aspectRatio: 1,
            width: 40,
            borderRadius: 20,
          }}
          source={{
            uri: "https://picsum.photos/200",
          }}
        />
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            marginLeft: 20,
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
