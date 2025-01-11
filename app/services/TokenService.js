import * as SecureStore from "expo-secure-store";

let token = null;

export async function setToken(newToken) {
    try {
        token = newToken;
        if (token !== null) {
            await SecureStore.setItemAsync("token", token);
        } else {
            await SecureStore.deleteItemAsync("token");
        }
    } catch (error) {
        console.error("Error setting or deleting token:", error);
    }
}

export async function getToken() {
    if (token !== null) {
        return token;
    }
    try {
        token = await SecureStore.getItemAsync("token");
        return token;
    } catch (error) {
        console.error("Error getting token:", error);
        return null;
    }
}
