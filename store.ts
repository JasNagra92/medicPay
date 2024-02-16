import {
  User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { Store } from "pullstate";
import { auth } from "./config/firebase";

interface IAuthStore {
  isLoggedIn: boolean;
  initialized: boolean;
  user: User | null;
}

export const AuthStore = new Store<IAuthStore>({
  isLoggedIn: false,
  initialized: false,
  user: null,
});

const unsub = onAuthStateChanged(auth, (user) => {
  console.log("onAuthStateChange", user);
  AuthStore.update((store) => {
    store.user = user;
    store.isLoggedIn = user ? true : false;
    store.initialized = true;
  });
});

export const appSignIn = async (email: string, password: string) => {
  try {
    const resp = await signInWithEmailAndPassword(auth, email, password);
    AuthStore.update((store) => {
      store.user = resp.user;
      store.isLoggedIn = resp.user ? true : false;
    });
    return { user: resp.user };
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const appSignUp = async (email: string, password: string) => {
  try {
    const resp = await createUserWithEmailAndPassword(auth, email, password);

    AuthStore.update((store) => {
      store.user = auth.currentUser;
      store.isLoggedIn = true;
    });

    return { user: auth.currentUser };
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const appSignOut = async () => {
  try {
    await signOut(auth);
    AuthStore.update((store) => {
      store.user = null;
      store.isLoggedIn = false;
    });
    return { user: null };
  } catch (error) {
    throw { error };
  }
};
