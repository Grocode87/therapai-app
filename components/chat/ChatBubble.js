/** a component that renders a single chat message, takes in author and content */

import { StyleSheet, Text, View } from "react-native";

const ChatBubble = ({ author, content }) => {
  return (
    <View style={styles.chatBubble}>
      <Text style={styles.chatBubbleAuthor}>{author}</Text>
      <Text style={styles.chatBubbleContent}>{content}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  chatBubble: {
    backgroundColor: "#e6e6e6",
    borderRadius: 10,
    padding: 10,
    maxWidth: "80%",
    alignSelf: "flex-start",
  },
  chatBubbleAuthor: {
    fontWeight: "bold",
  },
  chatBubbleContent: {},
});

export default ChatBubble;
