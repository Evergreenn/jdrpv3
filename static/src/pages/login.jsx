import React, { useState } from "react";
import axios from "axios";
// import Cookies from "universal-cookie"
import { useNavigate, NavLink } from 'react-router-dom';
import useCookies from "../components/security/cookies";


export default function Login({ onHandleRefresh }) {

    const [name, SetName] = useState("");
    const [password, SetPassword] = useState("");
    const [error, SetError] = useState("");

    const { setToken } = useCookies();

    let navigate = useNavigate()

    const handleChangeName = (e) => {
        SetName(e.target.value);
    }
    const handleChangePassword = (e) => {
        SetPassword(e.target.value);
    }
    const handleRefresh = (bool) => {
        onHandleRefresh(bool)
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        if (name === "") {
            SetError("You must specify a username");
            return false;
        }

        axios.post(process.env.REACT_APP_BASE_URL + "login", {
            "username": name,
            "password": password
        }).then(response => {

            setToken(response.data.jwt, response.data.expiration_time);

            handleRefresh(true);
            navigate("/", { replace: true })

        }).catch(error => {
            console.log(error);
        })

    }

    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col is-center"><h1>Login</h1></div>
                </div>
                <div className="container">
                    <div className="is-center row">
                        <div className="card">
                            <form onSubmit={handleSubmit}>
                                <label>
                                    Username :
                                    <input type="text" value={name} onChange={handleChangeName} /> </label>
                                <label>
                                    Password :
                                    <input type="password" value={password} onChange={handleChangePassword} /> </label>
                                <input className="pull-right" type="submit" value="Submit" />
                            </form>
                        </div>
                    </div>
                    <div className="is-center row">
                        <p className="text-error">{error}</p>
                    </div>
                    <div className="row is-center">
                        <NavLink activeclassname='active' to='/create-account'><a>Don't have an account yet ?</a></NavLink>
                    </div>
                </div>
            </div>
        </>
    )
}
