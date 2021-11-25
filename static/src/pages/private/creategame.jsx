import React, { useState } from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";

export default function GameCreator({ authenticated }) {

    const [name, SetName] = useState(null);
    const [password, SetPassword] = useState(null);
    const [customRules, SetCustomRules] = useState(false);
    const [socketAddress, SetSocketAddress] = useState("");
    const [error, SetError] = useState("");

    const cookies = new Cookies();
    const navigate = useNavigate();


    const handleSubmit = e => {
        e.preventDefault();

        const token = cookies.get("token");

        axios.post(process.env.REACT_APP_BASE_UR+"api/create-game", {
            "gamename": name,
            "password": password,
            "have_custom_rules": customRules
        },{
            headers:{
                'Authorization': `Bearer ${token}`
            }
        }).then(response => {
            // console.log(response.data)
            SetSocketAddress(response.data.ws_address);
            navigate("/game", { replace: true, state:response.data.ws_address })

        }).catch(error => {
            if([403, 401].includes(error.response.status)){
                SetError("You don't have the right to do that")
            }
            console.log(error);
        })

    }

    const handleChangeName = e => {
        SetName(e.target.value);
    }

    const handleChangePassword = e => {
        SetPassword(e.target.value);
    }

    const handleChangeCustomRules = e => {
        SetCustomRules(e.target.checked)
    }

    return (
        <>
            {authenticated && !socketAddress &&
                <div className="container">
                    <div className="row">
                        <div className="col is-center"><h1>Game creation</h1></div>
                    </div>
                    <div className="container">
                        <div className="is-center row">
                            <form onSubmit={handleSubmit} autoComplete="off">
                                <label>
                                    Game name :
                                    <input type="text" autoComplete="off" value={name} onChange={handleChangeName} /> </label>
                                <label>
                                    Game Password :
                                    <input type="password" autoComplete="off" value={password} onChange={handleChangePassword} /> </label>
                                <div className="">
                                    <label className="">
                                        Custom Rules
                                        <span class="switch pull-right">
                                            <input type="checkbox"  onChange={handleChangeCustomRules} />
                                            <span class="slider round"></span>
                                        </span>
                                    </label>
                                </div>
                                {customRules && 
                                    <p>TODO</p>
                                    
                                }
                                <input className="pull-right" type="submit" value="Submit" />
                            </form>
                        </div>
                        <div className="is-center row">
                            <p className="text-error">{error}</p>
                        </div>
                    </div>
                </div>
            }

            {authenticated && socketAddress && 
                <p>{socketAddress}</p>
            }
        </>

    )
}