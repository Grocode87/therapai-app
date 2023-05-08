import React, { useEffect, useState, useRef } from "react";
import {
  Alert,
  Animated,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import ChatBubble from "../components/chat/ChatBubble";
import {
  createSession,
  endSession,
  getAIResponse,
  getSession,
  getUserData,
  updateSession,
} from "../services/api";
import { useAuth } from "../context/authContext";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ChatHeader from "../components/chat/ChatHeader";
import TypingIndicator from "../components/chat/TypingIndicator";

import { getCalendars } from "expo-localization";
import { LinearGradient } from "expo-linear-gradient";

const ChatScreen = ({ navigation }) => {
  const [text, onChangeText] = useState("");
  const [messages, setMessages] = useState([]);
  const [aiTyping, setAiTyping] = useState(false);

  const { user } = useAuth();
  const { data: userData } = useQuery(
    ["userData"],
    async () => {
      token = await user.getIdToken();
      return getUserData(token, user.uid);
    },
    {
      onSuccess: (data) => {
        if (data.active_session) {
          setMessages(data.active_session.chat_log);
        }
      },
    }
  );

  const scrollViewRef = useRef(null);
  const textInputRef = useRef(null);

  const inputFontSize = 16;
  const inputLineHeight = inputFontSize * 1.2; // Usually, line height is 1.2 times the font size
  const inputVerticalPadding = 16;
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);
  const [chatBottomSpace, setChatBottomSpace] = useState(
    new Animated.Value(50)
  );

  const queryClient = useQueryClient();

  const createSessionMutation = useMutation(
    async () => {
      const token = await user.getIdToken();
      return createSession(token, user.uid, userData.therapist);
    },
    {
      onSuccess: (sessionData) => {
        queryClient.invalidateQueries("userData");

        queryClient.setQueryData(["userData"], (oldData) => {
          return {
            ...oldData,
            active_session: sessionData,
          };
        });
      },
    }
  );

  const updateSessionMutation = useMutation(async (newData) => {
    const token = await user.getIdToken();

    return updateSession(token, user.uid, userData.active_session.id, newData);
  });

  const handleSendMessage = async (newMessage) => {
    try {
      // add timestamp to message
      newMessage.timestamp = new Date().toISOString();
      // Update session in database
      const token = await user.getIdToken();

      const newMessages = [...messages, newMessage];
      setMessages(newMessages);

      await updateSessionMutation.mutateAsync({
        ...userData.active_session,
        chat_log: newMessages,
      });

      // Update session data in cache
      await queryClient.setQueryData(["userData"], (oldData) => {
        return {
          ...oldData,
          active_session: {
            ...oldData.active_session,
            chat_log: newMessages,
          },
        };
      });

      // Update local state
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (e) => {
        scrollViewRef.current?.scrollToEnd({ animated: true });

        // animate the chat bottom space from 60 to 0
        Animated.timing(chatBottomSpace, {
          toValue: 0,
          duration: Platform.OS === "ios" ? e.duration : 250,
          useNativeDriver: false,
        }).start();
      }
    );

    const keyboardWillHideListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      (e) => {
        // animate the chat bottom space from 0 to 60
        Animated.timing(chatBottomSpace, {
          toValue: 60,
          duration: Platform.OS === "ios" ? e.duration : 250,
          useNativeDriver: false,
        }).start(() => {
          // if scrollview is at the bottom, scroll to end
          scrollViewRef?.current?.scrollToEnd({ animated: true });
        });
      }
    );

    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, []);

  useEffect(() => {
    setTimeout(
      () => scrollViewRef.current.scrollToEnd({ animated: false }),
      10
    );
  }, [messages]);

  const handleScroll = (event) => {};

  const createRespone = async () => {
    setAiTyping(true);
    const response = await getAIResponse(
      messages,
      userData,
      getCalendars()[0].timeZone
    );
    setAiTyping(false);
    handleSendMessage({ author: "Bot", content: response });
  };

  useEffect(() => {
    const createSessionIfNotExists = async () => {
      // Create a new session if user has no current session
      if (userData.active_session == null) {
        // call api and create new session for user
        createSessionMutation.mutate();
      }
    };

    createSessionIfNotExists();
    // if session is loaded and messages are loaded, if there are no messages, create a response
  }, []);

  useEffect(() => {
    if (userData.active_session?.chat_log.length == 0) {
      createRespone();
    }
  }, [userData]);

  useEffect(() => {
    if (messages.length > 0) {
      if (messages.at(-1).author == "Me") {
        // Chat log has been updated, last message is from the user, create a response
        createRespone();
      }
    }
  }, [messages]);

  const sendMessage = () => {
    const temp_text = text;

    handleSendMessage({ author: "Me", content: text });
    onChangeText("");
  };

  const onCloseHandler = () => {
    Alert.alert(
      "End session",
      "Are you sure you want to end the current session",
      [
        { text: "Stay", style: "cancel", onPress: () => {} },
        {
          text: "End Session",
          style: "default",
          // If the user confirmed, then we dispatch the action we blocked earlier
          // This will continue the action that had triggered the removal of the screen
          onPress: () => {
            // call api function to end session

            endSession(user, userData).then(() => {
              queryClient.invalidateQueries(["userData"]);
            });
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    /** a basic chat screen, with the chat messages in 1 container and a keyboard input in the other, the keyboard input is always at the bottom and moves so it is not hidden by the keyboard */
    <KeyboardAvoidingView
      behavior={Platform?.OS == "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={-50}
    >
      <ChatHeader
        onEndSession={onCloseHandler}
        sessionData={userData.active_session}
      ></ChatHeader>
      <View style={{ flex: 1, paddingBottom: 0 }}>
        <LinearGradient colors={["#89CFF0", "#89CFF0"]} style={{ flex: 1 }}>
          <ScrollView
            ref={scrollViewRef}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
            <View
              style={{
                flex: 1,
                flexDirection: "column",
                paddingHorizontal: 10,
                gap: 20,
                paddingTop: 20,
              }}
            >
              {messages.map((message, idx) => (
                <ChatBubble
                  content={message.content}
                  author={
                    message.author == "Bot"
                      ? userData.active_session.therapist
                      : "Me"
                  }
                  key={idx}
                ></ChatBubble>
              ))}
              <TypingIndicator show={aiTyping} />
              <Animated.View
                style={{ height: chatBottomSpace }}
              ></Animated.View>
            </View>
          </ScrollView>
        </LinearGradient>
      </View>
      <View
        style={{
          paddingBottom: 60, //or whatever height richtoolbar is
          borderColor: "#89CFF0",
          borderTopWidth: 1,
          backgroundColor: "#89CFF0",
        }}
      >
        <TextInput
          style={{
            marginHorizontal: 15,
            marginTop: 10,
            borderWidth: 0,
            borderRadius: 20,
            borderColor: "#e8e8e8", // very light grey
            backgroundColor: "#e8e8e8",
            fontSize: inputFontSize,
            lineHeight: inputLineHeight,
            paddingHorizontal: 15,
            paddingTop: inputVerticalPadding / 2,
            paddingBottom: inputVerticalPadding / 2,
            minHeight: inputLineHeight + inputVerticalPadding,
            maxHeight: inputLineHeight * 3 + inputVerticalPadding,
          }}
          ref={textInputRef}
          placeholder="Send a chat"
          multiline
          onChangeText={onChangeText}
          value={text}
          enablesReturnKeyAutomatically={true}
          returnKeyType={"send"}
          blurOnSubmit={true}
          onSubmitEditing={() => {
            sendMessage();
          }}
        ></TextInput>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
  },
  input: {
    height: 40,
    margin: 12,
    padding: 10,
  },
});

export default ChatScreen;
