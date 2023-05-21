import { ActivityIndicator, Button, Pressable, Text, View } from "react-native";

const CustomButton = ({
  text,
  onPress,
  isLoading = false,
  disabled = false,
}) => {
  return (
    <Pressable
      style={(pressed) => ({
        width: "100%",
        height: 45,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 5,
        opacity: disabled || isLoading ? 0.5 : 1,
        backgroundColor: "#3f3f3f",
      })}
      onPress={onPress}
    >
      <View style={{ paddingHorizontal: 30 }}>
        <Text style={{ color: "white" }}>{text}</Text>
        {isLoading && (
          <ActivityIndicator
            size="small"
            color="#ffffff"
            style={{ position: "absolute", right: 0, top: 0, bottom: 0 }} // Add this line
          />
        )}
      </View>
    </Pressable>
  );
};

export default CustomButton;
