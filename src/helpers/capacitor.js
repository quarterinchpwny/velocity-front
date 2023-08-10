import { Preferences } from "@capacitor/preferences";
import { Geolocation } from "@capacitor/geolocation";
import { Device } from "@capacitor/device";
import { Network } from "@capacitor/network";
import { SplashScreen } from "@capacitor/splash-screen";
import { Keyboard } from "@capacitor/keyboard";

const capacitorPlugin = {
    localStorage: () => Preferences,
    geoLocation: () => Geolocation,
    device: () => Device,
    network: () => Network,
    splashScreen: () => SplashScreen,
    keyboard: async () => {
        const { platform } = await Device.getInfo();
        if (platform !== "web") {
            return Keyboard;
        }
        return {
            hide: () => {},
            show: () => {},
        };
    },

    extension: {
        geoLocation: {
            isGranted: async () => {
                const { location } = await Geolocation.checkPermissions();
                return location === "granted";
            },
        },
    },
};

export default capacitorPlugin;
