import capacitorPlugin from "helpers/capacitor";
import ky from "ky";
import { toFormData } from "axios";

let baseURL = process.env.BASE_URL;

const toURLEndpoint = (route, newURL) =>
    route && !newURL ? `${baseURL}/api/${route}` : newURL;

const api = ky.extend({
    timeout: false,
    headers: {
        // "Content-Type": "application/json; charset=UTF-8",
        "Access-Control-Allow-Origin": "*",
        "ngrok-skip-browser-warning": true,
    },
    hooks: {
        beforeRequest: [
            async (request) => {
                const savedAccessToken = await capacitorPlugin
                    .localStorage()
                    .get({ key: "access_token" });
                const accessToken = savedAccessToken.value;
                if (accessToken) {
                    request.headers.append(
                        "Authorization",
                        `Bearer ${savedAccessToken.value}`
                    );
                }
            },
        ],
    },
});

const httpsHelper = {
    get: async ({ route, url }) => {
        return await api.get(toURLEndpoint(route, url)).json();
    },
    post: async ({ route, body, url, transform }) => {
        if (transform && transform === "form-data") {
            return await api
                .post(toURLEndpoint(route, url), {
                    body: toFormData(body),
                })
                .json();
        }
        return await api
            .post(toURLEndpoint(route, url), {
                json: body,
            })
            .json();
    },
    delete: async ({ route, body, url }) => {
        return await api
            .delete(toURLEndpoint(route, url), {
                data: body,
            })
            .json();
    },
    toURLSearchParams: (payload) => {
        let queries = [];
        Object.keys(payload).forEach((key) => {
            const value = payload[key];
            if (Array.isArray(value)) {
                if (value) {
                    value.forEach((value, index) =>
                        queries.push(
                            `${key}[${index}]=${encodeURIComponent(
                                value.toString()
                            ).replace(/%20/g, "+")}`
                        )
                    );
                }
            } else {
                if (value) {
                    queries.push(
                        `${key}=${encodeURIComponent(value.toString()).replace(
                            /%20/g,
                            "+"
                        )}`
                    );
                }
            }
        });
        return queries.join("&");
    },
};
export default httpsHelper;
