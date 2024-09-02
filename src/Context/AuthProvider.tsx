import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAPI, registerAPI } from "../Services/AuthService";
import React from "react";
import axios from "axios";
import { UserProfile } from "../Models/User";
import { toast }  from "react-toastify";
import { auth } from '../firebase/config';
import { Spin } from 'antd';

type UserContextType = {
  user: UserProfile | null;
  token: string | null;
  registerUser: (email: string, username: string, password: string) => void;
  loginUser: (username: string, password: string) => void;
  logout: () => void;
  isLoggedIn: () => boolean;
};

type Props = { children: React.ReactNode };

export const AuthContext = createContext<UserContextType>({} as UserContextType);

export default function AuthProvider({ children }: Props) {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // use for login with account
  useEffect(() => {
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (user && token) {
      setUser(JSON.parse(user));
      setToken(token);
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    }
    setIsLoading(false);
  }, []);


  // Use for login gg and fb via firebase
  React.useEffect(() => {
    const unsubscibed = auth.onAuthStateChanged((userFirebase) => {
      if (userFirebase) {
        const { displayName, email, uid, photoURL, } = userFirebase;
        setUser({
          displayName,
          email,
          uid,
          photoURL,
        }); 
        setIsLoading(false);
        navigate('/');
        console.log("Login Firebase Success")
        return;
      }

      // else if (user){
      //   console.log("User: "  + user)
      //   const { displayName, email, uid, photoURL, } = user;
      //   setUser({
      //     displayName,
      //     email,
      //     uid,
      //     photoURL,
      //   }); 
      //   setIsLoading(false);
      //   navigate('/');
      //   console.log("Login Via API Success")
      //   return;
      // }
      
      // reset user info
      console.log("Authenticate Firebase Fail")
      setUser(null);
      setIsLoading(false);
      navigate('/login');
    });

    // clean function
    return () => {
      unsubscibed();
    };
  }, [navigate]);

  const registerUser = async (
    email: string,
    username: string,
    password: string
  ) => {
    await registerAPI(email, username, password)
      .then((res) => {
        if (res) {
          localStorage.setItem("token", res?.data.token);
          const userObj = {
            uid: "",
            displayName: res?.data.userName,
            email: res?.data.email,
            photoURL: "",
          };
          localStorage.setItem("user", JSON.stringify(userObj));
          setToken(res?.data.token!);
          setUser(userObj!);
          toast.success("Login Success!");
          navigate("/search");
        }
      })
      .catch((e) => toast.warning("Server error occured"));
  };

  const loginUser = async (username: string, password: string) => {
    await loginAPI(username, password)
      .then((res) => {
        if (res) {
          localStorage.setItem("token", res?.data.token);
          const userObj = {
            uid: "",
            displayName: res?.data.userName,
            email: res?.data.email,
            photoURL: "",
          };
          localStorage.setItem("user", JSON.stringify(userObj));
          setToken(res?.data.token!);
          setUser(userObj!);
          toast.success("Login Success!");
          navigate("/");
        }
      })
      .catch((e) => toast.warning("Server error occured"));
  };

  const isLoggedIn = () => {
    return !! user;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken("");
    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{ loginUser, user, token, logout, isLoggedIn, registerUser }}
    >
      {isLoading ? <Spin style={{ position: 'fixed', inset: 0 }} /> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);