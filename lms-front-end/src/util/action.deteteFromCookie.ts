"use server";
import { cookies } from "next/headers";

const deleteCookies = (keys: string[]) => {
  const cookieStore = cookies();
  keys.forEach((key) => {
    cookieStore.delete(key);
  });
};

export default deleteCookies;