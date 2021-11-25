import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useApiPost from "../../components/ApiCrawler/post";

export default function GameCreator({ authenticated }) {

    const [name, SetName] = useState(null);
    const [password, SetPassword] = useState(null);
    const [customRules, SetCustomRules] = useState(false);
    const [customGameRules, setCustomGameRules] = useState({});
    const [socketAddress, SetSocketAddress] = useState("");
    const [error, SetError] = useState("");
    const { postData } = useApiPost();

    const navigate = useNavigate();


    const handleSubmit = async e => {
        e.preventDefault();

        const response = await postData("api/create-game", {
            "gamename": name,
            "password": password,
            "have_custom_rules": customRules
        });

        SetSocketAddress(response.success.ws_address)

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

    const handleCustomRules = e => {

        const toto = e.target.name;
        setCustomGameRules({
            [toto]: `${e.target.checked}`
        });
        console.log(customGameRules);
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
                                <div>
                                    <label>
                                        Custom Rules
                                        <span class="switch pull-right">
                                            <input type="checkbox" onChange={handleChangeCustomRules} />
                                            <span class="slider round"></span>
                                        </span>
                                    </label>
                                </div>
                                {customRules &&
                                    <>
                                        <div>
                                            <label>
                                            Automated combat calculator
                                                <span class="switch pull-right">
                                                    <input type="checkbox" onChange={handleCustomRules} />
                                                    <span class="slider round"></span>
                                                </span>
                                            </label>
                                        </div>
                                        <div>
                                            <label>
                                                Generated items
                                                <span class="switch pull-right">
                                                    <input type="checkbox" onChange={handleCustomRules} />
                                                    <span class="slider round"></span>
                                                </span>
                                            </label>
                                        </div>
                                        <div>
                                            <label>
                                                Generated monsters
                                                <span class="switch pull-right">
                                                    <input type="checkbox" onChange={handleCustomRules} />
                                                    <span class="slider round"></span>
                                                </span>
                                            </label>
                                        </div>
                                        <div>
                                            <label>
                                                Generated classes
                                                <span class="switch pull-right">
                                                    <input type="checkbox" onChange={handleCustomRules} />
                                                    <span class="slider round"></span>
                                                </span>
                                            </label>
                                        </div>
                                        <div>
                                            <label>
                                                Generated races
                                                <span class="switch pull-right">
                                                    <input type="checkbox" onChange={handleCustomRules} />
                                                    <span class="slider round"></span>
                                                </span>
                                            </label>
                                        </div>
                                    </>
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