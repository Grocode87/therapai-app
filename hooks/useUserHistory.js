import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useAuth } from "../context/authContext";
import { getUserData, getUserHistory } from "../services/api";

export function useUserHistory() {
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    const getHistory = async () => {
      if (user) {
        const token = await user.getIdToken();
        const response = await getUserHistory(token, user.uid);
        console.log(response);
        console.log(response.by_month);
        setHistory(response);
        setLoading(false);
      }
    };

    getHistory();
  }, [user, userData]);

  return {
    history,
    loading,
  };
}
