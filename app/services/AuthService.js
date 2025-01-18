import { router } from "expo-router";
import axios from "../../utils/axios";
import { getToken, setToken } from "./TokenService";

export async function login(credentials) {

        console.log('In AuthService...');

        const response = await axios.post("/login", credentials);

        console.log(response);


        console.log('Response received:', response.data.token);
    
        await setToken(response.data.token);  

}

export async function loadUser() {
    const token = await getToken();

    const {data : user} = await axios.get("/user", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    return user;
}
