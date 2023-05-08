import { useEffect, useRef } from "react";
import {
  Animated,
  PanResponder,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAlert } from "../context/alertContext";

const SlidingAlert = () => {
  const insets = useSafeAreaInsets();

  const { alert, setAlert } = useAlert();
  const animation = useRef(new Animated.Value(-70)).current;
  let initialY = useRef(0).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (event, gestureState) => {
        initialY = gestureState.y0;
      },
      onPanResponderMove: (event, gestureState) => {
        let deltaY = gestureState.moveY - initialY;
        if (deltaY > 0) deltaY /= 6;
        animation.setValue(deltaY + insets.top);
      },
      onPanResponderRelease: (e, { vy }) => {
        if (vy < -0.3) {
          // based on vy, use current animation value and the end spot (-150) to calculate the duration of disappearing
          const distToMove = animation._value + 150;
          const timeToDestination = Math.abs(distToMove / vy);
          Animated.timing(animation, {
            toValue: -150,
            duration: timeToDestination,
            useNativeDriver: true,
          }).start(() => {
            setAlert({ show: false, title: "", message: "", type: "" });
          });
        } else {
          showAlert();
        }
      },
    })
  ).current;

  const showAlert = () => {
    Animated.timing(animation, {
      toValue: insets.top, // animate to the top inset
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(hideAlert, 5000); // auto-hide after 5 seconds
    });
  };

  const hideAlert = () => {
    Animated.timing(animation, {
      toValue: -150,
      duration: 100,
      useNativeDriver: true,
    }).start(() => {
      setAlert({ show: false, title: "", message: "", type: "" });
    });
  };

  useEffect(() => {
    if (alert.show) {
      showAlert();
    } else {
      hideAlert();
    }
  }, [alert.show]);

  if (!alert.show) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.errorContainer,
        {
          transform: [
            {
              translateY: animation,
            },
          ],
        },
      ]}
      {...panResponder.panHandlers}
    >
      <View style={styles.errorContent}>
        <View style={styles.errorColor}></View>
        <View style={styles.errorTextContent}>
          <Text style={styles.errorTitle}>{alert.title}</Text>
          <Text style={styles.errorMessage}>{alert.message}</Text>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  errorContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    paddingHorizontal: 10,
    zIndex: 2,
  },
  errorContent: {
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
  },

  errorColor: {
    width: 12,
    height: "100%",
    borderRadius: 15,
    backgroundColor: "red",
  },
  errorTextContent: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  errorTitle: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
    paddingBottom: 2,
  },
  errorMessage: {
    color: "black",
    fontSize: 16,
  },
});

export default SlidingAlert;
