import { defineStore } from "pinia";

export const useCounterStore = defineStore("counter", {
    state: () => ({
        vehicle: null,
    }),

    actions: {
        async getVehicles() {},
    },
});
