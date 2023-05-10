import { useQuery } from "@tanstack/react-query";
import { useAlert } from "../context/alertContext";
import { useAuth } from "../context/authContext";
import { getUserData } from "../services/api";

export const useUserData = () => {

    const { user } = useAuth();

  const { data: userData, isLoading: userDataLoading } = useQuery(
    ["userData"],
    async () => {
      console.log("fetching user data")
      const token = await user.getIdToken();
      return getUserData(token, user.uid);    
    },
    {
      enabled: user != null,
    }
  );

  return { userData, userDataLoading}
}