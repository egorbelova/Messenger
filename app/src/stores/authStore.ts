// src/stores/authStore.ts
import { createContext } from 'react';

type AuthStoreType = {
  loggedIn: boolean;
  setLoggedIn: (value: boolean) => void;
};

export const authStore = {
  loggedIn: true,
  setLoggedIn: (value: boolean) => {
    authStore.loggedIn = value;
  },
};
