import React, { createContext, useState, useEffect, useContext } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebase";
import { getUser, updateSession, updateUser } from "../services/api";
import {
  decryptString,
  deriveAndStoreKey,
  encryptString,
  getKey,
} from "../services/encrypt";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);

      if (user) {
        console.log("user is logged in, ckecking key");
        getKey().then((credentials) => {
          console.log("recieved key", credentials);
          if (!credentials) {
            console.log("generating");
            deriveAndStoreKey(user.phoneNumber, user.uid);
          } else {
            console.log("testing encrypt + decrypt");
            const plainText = "Hello, world!";
            encryptString(plainText).then((encrypted) => {
              console.log("encrypted", encrypted);
              decryptString(encrypted).then((decrypted) => {
                console.log("decrypted", decrypted);
              });
            });
          }
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return userCredential.user;
    } catch (error) {
      return error;
    }
  };

  const register = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      return userCredential.user;
    } catch (error) {
      return error;
    }
  };

  const refresh = async () => {
    // fetch userData from db, set it to userData

    // get users token
    const token = await user.getIdToken();

    // fetch additional user info from our backend
    const response = await getUser(token, user.uid);

    // add additional user info
    setUserData(response.data);
  };

  const value = {
    user,
    loading,
    login,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
