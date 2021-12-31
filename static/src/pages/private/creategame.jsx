import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useApiPost from "../../components/ApiCrawler/post";

export default function GameCreator({ authenticated }) {

    const defaultValue = {
        Automated_combat_calculator: false,
        Generated_items: false,
        Generated_monsters: false,
        Generated_classes: false,
        Generated_races: false,
    }

    const [name, SetName] = useState(null);
    const [password, SetPassword] = useState(null);
    const [cst, SetCst] = useState(null);
    const [customRules, SetCustomRules] = useState(false);
    const [customGameRules, setCustomGameRules] = useState(defaultValue);
    const [error, SetError] = useState("");
    const { postData } = useApiPost();
    const navigate = useNavigate();
    const defaultvalue = 'Dd3';


    const handleSubmit = async e => {
        e.preventDefault();

        const response = await postData("api/create-game", {
            "gamename": name,
            "password": password,
            "have_custom_rules": customRules,
            "cst": cst ?? defaultvalue
        });

        if (response.success == undefined || response.error == undefined) {
            SetError("Something really wrong happened");
            return false;
        }

        if (response.error) {
            SetError(response.error);
        } else {

            console.log(response.success)

            const to64 = btoa(JSON.stringify(response.success));

            navigate({
                pathname: `/game/${to64}`,
                //   search: `?args=`,
            });
            // SetSocketAddress(response.success.ws_address)
        }

    }

    const handleChangeName = e => {
        SetName(e.target.value);
    }

    const handleChangePassword = e => {
        SetPassword(e.target.value);
    }

    const handleChangeCst = e => {
        SetCst(e.target.value);
    }

    const handleChangeCustomRules = e => {
        SetCustomRules(e.target.checked);
        setCustomGameRules(defaultValue);

    }

    const handleCustomRules = e => {

        const toto = e.target.name;

        customGameRules[toto] = `${e.target.checked}`
        setCustomGameRules(customGameRules);

        console.log(customGameRules);
    }

    return (
        <>
            {authenticated &&
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
                                <label>
                                    Character Sheets Template:
                                    <select autoComplete="off" defaultValue={defaultvalue} onChange={handleChangeCst}>
                                        <option selected value={defaultvalue}>D&amp;D 3</option>
                                        <option value="Dd5">D&amp;D 5</option>
                                    </select>
                                </label>
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
                                                    <input type="checkbox" name="Automated_combat_calculator" onChange={handleCustomRules} />
                                                    <span class="slider round"></span>
                                                </span>
                                            </label>
                                        </div>
                                        <div>
                                            <label>
                                                Generated items
                                                <span class="switch pull-right">
                                                    <input type="checkbox" name="Generated_items" onChange={handleCustomRules} />
                                                    <span class="slider round"></span>
                                                </span>
                                            </label>
                                        </div>
                                        <div>
                                            <label>
                                                Generated monsters
                                                <span class="switch pull-right">
                                                    <input type="checkbox" name="Generated_monsters" onChange={handleCustomRules} />
                                                    <span class="slider round"></span>
                                                </span>
                                            </label>
                                        </div>
                                        <div>
                                            <label>
                                                Generated classes
                                                <span class="switch pull-right">
                                                    <input type="checkbox" name="Generated_classes" onChange={handleCustomRules} />
                                                    <span class="slider round"></span>
                                                </span>
                                            </label>
                                        </div>
                                        <div>
                                            <label>
                                                Generated races
                                                <span class="switch pull-right">
                                                    <input type="checkbox" name="Generated_races" onChange={handleCustomRules} />
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
        </>

    )
}