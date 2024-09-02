export type UserProfileToken = {
    uid: String | null,
    userName: string;
    email: string;
    token: string;
  };


export type UserProfile = {
  displayName: String | null,
  email: String | null,
  uid: String | null | any,
  photoURL: String | null,
};


export type UserContextType = { 
  user: UserProfile | null;
  token: string | null;
  registerUser: (email: string, username: string, password: string) => void;
  loginUser: (username: string, password: string) => void;
  logout: () => void;
  isLoggedIn: () => boolean;
};

export type UserInvite = {
  displayName: String | null,
  email: String | null,
  uid: String | null | any,
  photoURL: String | null,
};