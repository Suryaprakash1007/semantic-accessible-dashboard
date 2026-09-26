
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext(null);

const USERS_KEY = "rabtech-auth-users";
const SESSION_KEY = "rabtech-auth-session";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedSession = localStorage.getItem(SESSION_KEY);
      return savedSession ? JSON.parse(savedSession) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  function getRegisteredUsers() {
    try {
      return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
    } catch {
      return [];
    }
  }

  function register(name, email, password) {
    const users = getRegisteredUsers();

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = users.find(
      (item) => item.email === normalizedEmail
    );

    if (existingUser) {
      return {
        success: false,
        message: "An account with this email already exists.",
      };
    }

    const newUser = {
      id: crypto.randomUUID(),
      name: name.trim(),
      email: normalizedEmail,
      password,
    };

    try {
      localStorage.setItem(
        USERS_KEY,
        JSON.stringify([...users, newUser])
      );

      return {
  success: true,
  message: "Account created successfully. Please log in.",
};
    } catch {
      return {
        success: false,
        message: "Unable to save your account. Please try again.",
      };
    }
  }

  function login(email, password) {
    const users = getRegisteredUsers();

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = users.find(
      (item) =>
        item.email === normalizedEmail &&
        item.password === password
    );

    if (!existingUser) {
      return {
        success: false,
        message: "Invalid email or password.",
      };
    }

    const sessionUser = {
      id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email,
    };

    try {
      localStorage.setItem(
        SESSION_KEY,
        JSON.stringify(sessionUser)
      );

      setUser(sessionUser);

      return { success: true };
    } catch {
      return {
        success: false,
        message: "Unable to save your session. Please try again.",
      };
    }
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}