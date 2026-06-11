import { useState, useEffect, useContext, createContext } from "react";
import axios from "axios";
import { usePostHog } from "posthog-js/react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    token: "",
  });

  const posthog = usePostHog();

  axios.defaults.headers.common["Authorization"] = auth?.token;

  useEffect(() => {
    const data = localStorage.getItem("authToken");
    if (data) {
      try {
        const parsedData = JSON.parse(data);
        setAuth({
          ...auth,
          user: parsedData.user,
          token: parsedData.token,
        });
  
        if (posthog && parsedData.user) {
          posthog.identify(parsedData.user.userId, {
            email: parsedData.user.email,
            name: parsedData.user.name,
          });
        }
      } catch (error) {
        console.error("Error parsing authToken:", error);
        localStorage.removeItem("authToken");
      }
    }
    //eslint-disable-next-line
  }, [posthog]);
  

  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export { useAuth, AuthProvider };
