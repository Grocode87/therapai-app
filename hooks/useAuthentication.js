import React from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebase";

export function useAuthentication() {
  const [user, setUser] = React.useState();

  React.useEffect(() => {
    const unsubscribeFromAuthStatuChanged = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        setUser(user);

        // Query backend for additional user info
        const { uid, email } = user;
        fetch(`http://localhost:3000/users/${uid}`).then((response) =>
          response.json()
        );
      } else {
        // User is signed out
        setUser(undefined);
      }
    });

    return unsubscribeFromAuthStatuChanged;
  }, []);

  return {
    user,
  };
}
