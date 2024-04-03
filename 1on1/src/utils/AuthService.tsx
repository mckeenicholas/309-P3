import React from "react";
import host from "./links";

const setLocalStorage = (key: string, value: string) => {
  localStorage.setItem(`1on1.${key}`, value);
};

const getLocalStorage = (key: string) => {
  return localStorage.getItem(`1on1.${key}`);
};

interface IAuthContext {
  token: string | null;
  userId: string | null;
  valid: boolean;
  logIn: (username: string, password: string) => Promise<boolean>;
  logOut: () => void;
}

const AuthContext = React.createContext<IAuthContext>({
  token: null,
  userId: null,
  valid: false,
  logIn: async () => false,
  logOut: () => {},
});

const AuthProvider = ({ children }) => {
  const [token, setToken] = React.useState<string | null>(
    getLocalStorage("token"),
  );
  const [userId, setUserId] = React.useState<string | null>(
    getLocalStorage("userId"),
  );
  const [expiration, setExpiration] = React.useState<string | null>(
    getLocalStorage("expiration"),
  );

  const valid = React.useMemo(() => {
    return (userId &&
      expiration &&
      Date.now() < new Date(expiration).getTime()) as boolean;
  }, [userId, expiration]);

  const logIn = async (username: string, password: string) => {
    try {
      const data = { username: username, password: password };

      const response = await fetch(`${host}/accounts/login`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        return false;
      }

      const { token } = await response.json();
      setLocalStorage("token", token);
      setToken(token);

      return true;
    } catch (error) {
      console.error("Error during login request:", error);
      return false;
    }
  };

  const logOut = () => {
    // Send a request to invalidate the token as well
    localStorage.removeItem(`1on1.token`);
    setToken("");
  };

  const value = {
    token,
    userId,
    valid,
    logIn,
    logOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return React.useContext(AuthContext);
};

export default AuthProvider;
