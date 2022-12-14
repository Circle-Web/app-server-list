import { defineStore } from "pinia";
import { store } from "@/store";
import { userType } from "./types";
import { routerArrays } from "@/layout/types";
import { router, resetRouter } from "@/router";
import { storageSession } from "@pureadmin/utils";
import { getLogin } from "@/api/user";
import { UserResult } from "@/api/user";
import { useMultiTagsStoreHook } from "@/store/modules/multiTags";
import { type DataInfo, setToken, removeToken, sessionKey } from "@/utils/auth";
import { IResponse } from "@/api/app";

export const useUserStore = defineStore({
  id: "pure-user",
  state: (): userType => ({
    // 用户名
    username: storageSession.getItem<DataInfo>(sessionKey)?.username ?? "",
    // 页面级别权限
    roles: storageSession.getItem<DataInfo>(sessionKey)?.roleId ?? 0,
    // 前端生成的验证码（按实际需求替换）
    verifyCode: "",
    // 判断登录页面显示哪个组件（0：登录（默认）、1：手机登录、2：二维码登录、3：注册、4：忘记密码）
    currentPage: 0,
    /** 头像url */
    avatarUrl: "https://avatars.githubusercontent.com/u/30518686?s=40&v=4"
  }),
  actions: {
    /** 存储用户名和头像 */
    SET_USERNAME(username: string, avatarUrl?: string) {
      this.username = username;
      if (avatarUrl) this.avatarUrl = avatarUrl;
    },
    /** 存储角色 */
    SET_ROLES(roles: number) {
      this.roles = roles;
    },
    /** 存储前端生成的验证码 */
    SET_VERIFYCODE(verifyCode: string) {
      this.verifyCode = verifyCode;
    },
    /** 存储登录页面显示哪个组件 */
    SET_CURRENTPAGE(value: number) {
      this.currentPage = value;
    },
    /** 登入 */
    async loginByUsername(data) {
      return new Promise<IResponse<UserResult>>((resolve, reject) => {
        getLogin(data)
          .then(data => {
            if (data) {
              setToken(data.value);
              resolve(data);
            }
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    /** 前端登出（不调用接口） */
    logOut() {
      this.username = "";
      this.roles = [];
      removeToken();
      router.push("/login");
      useMultiTagsStoreHook().handleTags("equal", [...routerArrays]);
      resetRouter();
    }
  }
});

export function useUserStoreHook() {
  return useUserStore(store);
}
