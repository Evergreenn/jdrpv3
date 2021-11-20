import React, { useState } from "react";
import axios from "axios";
import dotenv from "dotenv"

const AccountCreation = () => {

    const [name, SetName] = useState("");
    const [password, SetPassword] = useState("");
    const [passwordrepeat, SetPasswordRepeat] = useState("");
    const [error, SetError] = useState("");

    // dotenv.config();

    const handleChangeName = (e) => {
        SetName(e.target.value);
    }
    const handleChangePassword = (e) => {
        SetPassword(e.target.value);
    }
    const handleChangePasswordRepeat = (e) => {
        SetPasswordRepeat(e.target.value);
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        if (password !== passwordrepeat) {
            SetError("Password don't match")
            return false;
        }

        console.log(name);

        axios.post("http://localhost:8081/token", {
            "username": name,
            "permissions": ["OP_GET_SECURED_INFO", "ROLE_ADMIN"]
        }).then(response => {
            console.log(response.data);
        }).catch(error => {
            console.log(error);
        })

    }

    return (
        <div className="container">
            <div className="is-center row">
                <form onSubmit={handleSubmit}>
                    <label>
                        Nom :
                        <input type="text" value={name} onChange={handleChangeName} /> </label>
                    <label>
                        Password :
                        <input type="password" value={password} onChange={handleChangePassword} /> </label>
                    <label>
                        Repeat Password :
                        <input type="password" value={passwordrepeat} onChange={handleChangePasswordRepeat} /> </label>
                    <input className="pull-right" type="submit" value="Envoyer" />
                </form>
            </div>
            <div className="is-center row">
                <p className="text-error">{error}</p>
            </div>
        </div>
    )
}

export default <AccountCreation />