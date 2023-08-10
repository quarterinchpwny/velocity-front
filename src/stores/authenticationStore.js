import { defineStore } from "pinia";
import httpsHelper from "helpers/https";
import objectHelper from "helpers/object";

import capacitorPlugin from "helpers/capacitor";
import trimPayload from "helpers/trimPayload";

const useAuthenticationStore = defineStore("authentication", {
    state: () => {
        return {
            isAuthenticated: false,
            user: null,
            accessToken: null,
        };
    },

    getters: {
        validAuthentication: (state) =>
            state.isAuthenticated && state.user && state.accessToken,
    },

    actions: {
        async login(payload) {
            try {
                const response = await httpsHelper.post({
                    route: "login",
                    body: trimPayload(payload, ["password"]),
                });

                this.user = Object.assign(response.data);
                this.accessToken = response.token;
                this.isAuthenticated = true;
                await capacitorPlugin
                    .localStorage()
                    .set({ key: "user", value: JSON.stringify(this.user) });
                await capacitorPlugin
                    .localStorage()
                    .set({ key: "access_token", value: this.accessToken });

                return response;
            } catch (error) {
                return objectHelper.hasValue(error.response)
                    ? error.response.json()
                    : error;
            }
        },

        async register(payload) {
            try {
                return await httpsHelper.post({
                    route: "/register",
                    body: trimPayload(payload),
                });
            } catch (error) {
                return await error.response.json();
            }
        },

        async logout() {
            try {
                await capacitorPlugin.localStorage().remove({ key: "user" });
                await capacitorPlugin
                    .localStorage()
                    .remove({ key: "delivery_area" });
                await capacitorPlugin
                    .localStorage()
                    .remove({ key: "access_token" });
                this.accessToken = null;
                this.user = null;
                this.isAuthenticated = false;
            } catch (error) {
                return await error.response.json();
            }
        },

        async generateOTP(payload) {
            try {
                return await httpsHelper.post({
                    route: "authentication/verification-code/send",
                    body: trimPayload(payload),
                });
            } catch (error) {
                return await error.response.json();
            }
        },

        async verifyOTP(payload) {
            try {
                return await httpsHelper.post({
                    route: "authentication/verification-code/verify",
                    body: trimPayload(payload),
                });
            } catch (error) {
                return await error.response.json();
            }
        },
        async updatePassword(payload) {
            try {
                payload._method = "PUT";
                return await httpsHelper.post({
                    route: "authentication/password",
                    body: trimPayload(payload),
                });
            } catch (error) {
                return await error.response.json();
            }
        },
        async resetPassword(payload) {
            try {
                return await httpsHelper.post({
                    route: "authentication/reset-password",
                    body: trimPayload(payload),
                });
            } catch (error) {
                return await error.response.json();
            }
        },
        async checkAuthentication() {
            let accessToken =
                (
                    await capacitorPlugin
                        .localStorage()
                        .get({ key: "access_token" })
                ).value || "null";
            let user =
                (await capacitorPlugin.localStorage().get({ key: "user" }))
                    .value || "null";
            user = JSON.parse(user);
            if (accessToken && user) {
                this.accessToken = accessToken;
                this.user = Object.assign({}, user);
                this.isAuthenticated = true;
            }
        },
        async setUser(payload) {
            this.user = Object.assign(
                {},
                {
                    ...payload,
                }
            );
            await capacitorPlugin
                .localStorage()
                .set({ key: "user", value: JSON.stringify(this.user) });

            return this.user;
        },
    },
});

export default useAuthenticationStore;
