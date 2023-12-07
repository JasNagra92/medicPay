import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../config/firebase";

export const signUp = async (email: string, password: string) => {
  try {
    let user = await createUserWithEmailAndPassword(auth, email, password);
    return user;
  } catch (error: any) {
    throw { errorCode: error.code, errorMessage: error.message };
  }
};
