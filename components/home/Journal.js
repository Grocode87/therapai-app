import { Text, View } from "react-native";
import { useUserHistory } from "../../hooks/useUserHistory";

const Journal = () => {
  const { history: userHistory, loading: userHistoryLoading } =
    useUserHistory();

  return (
    <View>
      <View style={{ flex: 1, flexDirection: "column", gap: 20 }}>
        {userHistory?.by_month.map((month, idx) => (
          <View key={idx}>
            <Text
              style={{
                fontSize: 20,
                color: "white",
                fontWeight: "300",
                marginBottom: 15,
              }}
            >
              {month.month} {month.year}
            </Text>
            <View style={{ flex: 1, flexDirection: "row" }}>
              <View
                style={{
                  width: 5,
                  borderLeftWidth: 1,
                  borderTopWidth: 1,
                  borderBottomWidth: 1,
                  borderColor: "white",
                  height: "100%",
                  marginRight: 15,
                }}
              />
              <View
                style={{
                  gap: 20,
                }}
              >
                {month.days.map((day, idx) => (
                  <View key={idx} style={{}}>
                    <Text
                      style={{
                        fontSize: 14,
                        color: "white",
                        paddingBottom: 5,
                      }}
                    >
                      {month.month} {day.day}
                    </Text>
                    <View style={{ gap: 2, marginLeft: 5 }}>
                      {day.events.map((event, idx) => (
                        <View key={idx}>
                          {(event.type == "session" ||
                            event.type == "started_session") && (
                            <Text
                              style={{
                                fontSize: 14,
                                color: "white",
                                fontWeight: "300",
                              }}
                            >
                              {event.summary}
                            </Text>
                          )}
                          {event.type == "account_created" && (
                            <Text
                              style={{
                                fontSize: 14,
                                color: "white",
                                fontWeight: "300",
                              }}
                            >
                              You started your Therap Journey 👏
                            </Text>
                          )}
                        </View>
                      ))}
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default Journal;
