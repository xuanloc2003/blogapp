import { onAuthStateChanged } from "firebase/auth";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { auth, db } from "../firebase-app/firebase-config";

const { createContext, useContext, useState, useEffect } = require("react");
const AuthContext = createContext();

export function AuthProvider(props) {
  const auth = useAuthProvider();
  return (
    <AuthContext.Provider value={auth}>{props.children}</AuthContext.Provider>
  );
}

function useAuthProvider() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    const unregisterAuthObserver = onAuthStateChanged(auth, (user) => {
      if (user) {
        const docRef = query(
          collection(db, "user"),
          where("email", "==", user.email)
        );
        onSnapshot(docRef, (snapshot) => {
          snapshot.forEach((doc) => {
            setUserData({
              ...user,
              ...doc.data(),
            });
          });
        });
        // setUserData(user);
      }
      setLoading(false);
    });
    return () => unregisterAuthObserver();
  }, []);
  return {
    userData,
    loading,
  };
}

export function useAuth() {
  return useContext(AuthContext);
}
