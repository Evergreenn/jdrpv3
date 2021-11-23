import React, { useState } from "react";
import axios from "axios";
import Cookies from "universal-cookie"
import { useNavigate, NavLink } from 'react-router-dom';

export default function Login({ onHandleRefresh }) {

    const [name, SetName] = useState("");
    const [password, SetPassword] = useState("");
    const [error, SetError] = useState("");
    const [redirect, SetRedirect] = useState(false);

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

        axios.post(process.env.REACT_APP_BASE_UR+"login", {
            "username": name,
            "password": password
        }).then(response => {
            const cookies = new Cookies();

            cookies.set("token", response.data, {
                sameSite: "lax",
                secure: true
            })
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
            <br />
            <div className="container">
                <div className="is-center row">

                    <form onSubmit={handleSubmit}>
                        <label>
                            Nom :
                            <input type="text" value={name} onChange={handleChangeName} /> </label>
                        <label>
                            Password :
                            <input type="password" value={password} onChange={handleChangePassword} /> </label>
                        <input className="pull-right" type="submit" value="Envoyer" />
                    </form>
                </div>
                <div className="is-center row">
                    <p className="text-error">{error}</p>
                </div>


                <div className="row is-center">
                    <NavLink activeclassname='active' to='/create-account'><a>Don't have an account yet ?</a></NavLink>
                </div>
            </div>
        </>
    )
}
