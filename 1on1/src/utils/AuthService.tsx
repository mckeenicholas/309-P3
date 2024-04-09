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
  refresh: string | null;
  userId: string | null;
  logIn: (username: string, password: string) => Promise<boolean>;
  logOut: () => void;
  refreshToken: () => void;
}

const AuthContext = React.createContext<IAuthContext>({
  token: null,
  refresh: null,
  userId: null,
  logIn: async () => false,
  logOut: async () => {},
  refreshToken: async () => false,
});

const AuthProvider = ({ children }: any) => {
  const [token, setToken] = React.useState<string | null>(
    getLocalStorage("token"),
  );
  const [userId, setUserId] = React.useState<string | null>(
    getLocalStorage("userId"),
  );
  const [refresh, setRefresh] = React.useState<string | null>(
    getLocalStorage("refresh"),
  );

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

      const { access, refresh } = await response.json();

      setLocalStorage("token", access);
      setLocalStorage("refresh", refresh);
      setLocalStorage("username", username);
      setToken(access);
      setRefresh(refresh);
      setUserId(username);

      return true;
    } catch (error) {
      console.error("Error during login request:", error);
      return false;
    }
  };

  const logOut = async () => {
    try {
      const response = await fetch(`${host}/accounts/logout/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ refresh: refresh }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      localStorage.removeItem(`1on1.token`);

      response.text().then(() => {
        setToken(null);
        setUserId(null);
      });
    } catch (error) {
      console.error("Logout failed:", error);
    }

    return true;
  };

  const refreshToken = async () => {

    if (token === null || refresh === null) {
      return false;
    }

    try {
      const response = await fetch(`${host}/accounts/token/refresh/`, {
        method: "POST",
        body: JSON.stringify({ refresh: refresh }),
        headers: new Headers({
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }),
      });
      if (response.status === 401) {
        return false;
      } else if (!response.ok) {
          throw new Error(await response.text());
        } else {
          const data = await response.json();
          setToken(data.access);
          setLocalStorage("token", data.access)
          return true;
        }
    } catch (error) {
      console.error("Token refresh failed", error);
    }
  };

  const value = {
    token,
    refresh,
    userId,
    logIn,
    logOut,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return React.useContext(AuthContext);
};

export default AuthProvider;
