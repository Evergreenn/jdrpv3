import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import useCookies from "../components/security/cookies";


export default function AccountCreation({ onHandleRefresh }) {

    const [name, SetName] = useState("");
    const [password, SetPassword] = useState("");
    const [passwordrepeat, SetPasswordRepeat] = useState("");
    const [error, SetError] = useState("");
    const [redirect, SetRedirect] = useState(false);
    const { setToken } = useCookies();


    let navigate = useNavigate()

    const handleChangeName = (e) => {
        SetName(e.target.value);
    }
    const handleChangePassword = (e) => {
        SetPassword(e.target.value);
    }
    const handleChangePasswordRepeat = (e) => {
        SetPasswordRepeat(e.target.value);
    }
    const handleRefresh = (bool) => {
        onHandleRefresh(bool)
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        if (password !== passwordrepeat) {
            SetError("Password don't match")
            return false;
        }

        if (name === "") {
            SetError("You must specify a username");
            return false;
        }

        axios.post(process.env.REACT_APP_BASE_URL + "register", {
            "username": name,
            "password": password
        }).then(response => {

            setToken(response.data.jwt, response.data.expiration_time);
            SetRedirect(true);
            handleRefresh(true);

        }).catch(error => {
            console.log(error);
        })

    }

    return (

        <>
            {redirect &&
                navigate("/", { replace: true })
            }

            <div className="container">
                <div className="is-center row">

                    <form onSubmit={handleSubmit}>
                        <label>
                            Username :
                            <input type="text" value={name} onChange={handleChangeName} /> </label>
                        <label>
                            Password :
                            <input type="password" value={password} onChange={handleChangePassword} /> </label>
                        <label>
                            Repeat Password :
                            <input type="password" value={passwordrepeat} onChange={handleChangePasswordRepeat} /> </label>
                        <input className="pull-right" type="submit" value="Submit" />
                    </form>
                </div>
                <div className="is-center row">
                    <p className="text-error">{error}</p>
                </div>
            </div>
        </>
    )
}

// export default <AccountCreation />