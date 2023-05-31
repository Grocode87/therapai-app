import { useQuery } from "@tanstack/react-query";
import { useAlert } from "../context/alertContext";
import { useAuth } from "../context/authContext";
import { getUserData } from "../services/api";

import * as SplashScreen from "expo-splash-screen";

export const useUserData = () => {
  const { user } = useAuth();

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

  return { userData, userDataLoading };
};
