import axios from 'axios';


export const inventario = axios.create({
    baseURL: "http://localhost:8080/inventario",
    headers:{
        "Content-Type":"application/json",
        
    },
});