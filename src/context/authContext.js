import { onAuthStateChanged } from "firebase/auth";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../index";
import { auth } from "../config/firebase";

export function useAuth() {
  return useContext(AuthContext);
}

export default function AuthProvider({ children }) {
  const [user, setCurrentUser] = useState(null);
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        if (user.uid.length > 5) {
          setIsLogged(true);
          localStorage.setItem("uid", user.uid);
        }
      } else {
        setIsLogged(false);
        localStorage.setItem("uid", "");
      }
    });
    return unsub;
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLogged }}>
      {children}
    </AuthContext.Provider>
  );
}
