import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/UI/loader";
import useApiPost from "../../components/ApiCrawler/post";

export default function Lobby({ authenticated }) {

    const [gameaddress, SetGameAddress] = useState("");
    const [gamepwd, SetGamepwd] = useState("");
    const [error, SetError] = useState("");
    const [loaded, setLoaded] = useState(false);
    const { postData } = useApiPost();
    const navigate = useNavigate();


    useEffect(() => {
        setLoaded(true);
    }, [])

    const handleChangeName = e => {
        e.preventDefault();
        SetGameAddress(e.target.value);
    }

    const handleChangePassword = e => {
        e.preventDefault();
        SetGamepwd(e.target.value);
    }

    const handleSubmit = async e => {
        e.preventDefault();
        setLoaded(false);

        const response = await postData("api/player", {
            "game_id": gameaddress,
            // "password": password,
        });

        if (response.success === undefined || response.error === undefined) {
            SetError("Something really wrong happened");
            return false;
        }

        if (response.error) {
            SetError(response.error);
        } else {
            if (response.success === null) {
                //TODO: redirect to charecter creation 

            } else {

                //TODO: get socket address and redirect to game

                // navigate({
                //   pathname: `/game/${gameaddress}`,
                // //   search: `?args=`,
                // });

            }
        }
    }

    if (loaded === false) {
        return (
            <Loader />
        )
    }

    return (
        <>{authenticated &&
            <div className="container">
                <div className="row">
                    <div className="col is-center"><h1>Join a game</h1></div>
                </div>
                <div className="container">
                    <div className="is-center row">
                        <form onSubmit={handleSubmit} autoComplete="off">
                            <label>
                                Game name :
                                <input type="text" autoComplete="off" value={gameaddress} onChange={handleChangeName} /> </label>
                            {/* <input className="pull-right" type="submit" value="Submit" /> */}
                            <label>
                                Game Password :
                                <input type="text" autoComplete="off" value={gamepwd} onChange={handleChangePassword} /> </label>
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