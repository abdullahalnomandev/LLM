import { authKey } from "@/constants/storageKey";
import apiClient from "@/lib/apiClient";
import { setAccessTokenToCookie } from "@/util/action.setTokenToCookie";
import { decodeToken } from "@/util/jwt";
import { getFromLocalStorage, setToLocalStorage } from "@/util/local-storage";

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  data: {
    accessToken: string;
  };
}

export const loginUser = async (
  credentials: LoginCredentials,
  arg?:{callbackUrl:string}
): Promise<LoginResponse> => {
  try {
    const { data } = await apiClient.post("/auth/login", credentials);

    if (data?.data?.accessToken) {
      setAccessTokenToCookie(data?.data?.accessToken, {
        redirect: arg?.callbackUrl || "/", // use callbackUrl from arg here
      });
      storeUserInfo({accessToken:data?.data?.accessToken})
    }
    return data?.data;
  } catch (error: any) {
    return error.message;
  }
};

export const signUpUser = async (
  credentials: LoginCredentials
): Promise<LoginResponse> => {
  try {
    const { data } = await apiClient.post("/users/create-user", credentials);
    return data?.data;
  } catch (error: any) {
    throw new Error(`Sign up failed: ${error.message}`);
  }
};

// local store
export const storeUserInfo = ({ accessToken }: { accessToken: string }) => {
  return setToLocalStorage(authKey, accessToken);
};

export const getUserInfo = () => {
  const authLocalStorageData = getFromLocalStorage(authKey);
  if (authLocalStorageData) {
    return decodeToken(authLocalStorageData) ?? "";
  }
};

export const isUserLoggedIn = () => {
  return !!getFromLocalStorage(authKey);
};

export const removedUserInfo = (key: string) => {
  return localStorage.removeItem(key);
};
