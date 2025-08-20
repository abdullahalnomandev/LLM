import { authKey } from "@/constants/storageKey";
import { removedUserInfo } from "@/services/auth.Service";
import deleteCookies from "./action.deteteFromCookie";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export const logOutUser = (router: AppRouterInstance) => {
  removedUserInfo(authKey);
  deleteCookies([authKey, "refreshToken"]);
  router.refresh();
  router.push("/");
};