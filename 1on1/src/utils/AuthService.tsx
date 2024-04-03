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
  logOut: async () => {},
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

      const response = await fetch(`${host}/accounts/token/`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        return false;
      }

      const { access } = await response.json();

      setLocalStorage("token", access);
      setLocalStorage("username", username);
      setToken(token);
      setUserId(username);

      return true;
    } catch (error) {
      console.error("Error during login request:", error);
      return false;
    }
  };

  const logOut = async () => {
    
    const response = await fetch(`${host}/accounts/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    })

    if (!response.ok) {
      throw new Error(await response.text());
    }
    
    localStorage.removeItem(`1on1.token`);
    setToken(null);
    setUserId(null);
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
