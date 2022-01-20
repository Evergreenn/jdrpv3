import React from "react";
import Cookies from "universal-cookie"
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';


const useCookies = () => {

    const cookies = new Cookies();
    let navigate = useNavigate()


    const getToken = () => {
        const token = cookies.get("token");
        if (undefined === token) {
            toast.error("you are not connected");

            window.setTimeout(() => {
                navigate("/app", { replace: true })
            }, 2000)
        }

        return token;
    }

    const getTokenDecoded = () => {
        const token = cookies.get("token");
        console.log(token)
        if (undefined === token) {
            console.log(token)
            toast.error("you are not connected");
            // removeToken();

            // window.setTimeout(() => {
                navigate("/", { replace: true })
            // }, 2000)
        }else {
            const token_decoded = JSON.parse(atob(token.split('.')[1]));
            return token_decoded;

        }
        

    }

    const setToken = (token, expirationTime) => {
        const date = new Date().getTime();
        const maxAge = (parseInt(expirationTime)) - (parseInt(date / 1000));

        console.log(token, maxAge);

        cookies.set("token", token, {
            sameSite: "lax",
            secure: true,
            maxAge: maxAge,
        });
    }

    const removeToken = () => {
        cookies.remove("token");
    }

    return { getToken, getTokenDecoded, setToken, removeToken };

}

export default useCookies;


