import axiosLib from "axios";


//Add your laravel url api here. Use your local ip address as the url 
// When starting laravel server use: php artisan serve --host=0.0.0.0 --port="8000"
const axios = axiosLib.create({
    // baseURL: "http://172.16.95.134:8000/api",
    
    // baseURL: "http://192.168.1.4:8000/api", 
    baseURL: "http://172.16.86.46:8000/api",
    timeout: 20000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
})

export default axios;