import { router } from "expo-router";
import axios from "../../utils/axios";
import { getToken, setToken } from "./TokenService";

export async function login(credentials) {

    // try {
        console.log('In AuthService...');

        const response = await axios.post("/login", credentials);

        console.log(response);


        console.log('Response received:', response.data.token);

        //router.push("/LibraryScreen");
    
        await setToken(response.data.token);  

    
    // } catch (error) {
    //     console.error('Login request failed:', error.message);
    // }
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
