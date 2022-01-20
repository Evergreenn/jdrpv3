import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/UI/loader";
import useApiPost from "../../components/ApiCrawler/post";
import CreatePlayer from "./createplayer";


export default function Lobby({ authenticated }) {

    const [gameId, SetGameId] = useState("");
    const [haveAPlayer, setHaveAPlayer] = useState("");
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
        SetGameId(e.target.value);
    }

    const handleChangePassword = e => {
        e.preventDefault();
        SetGamepwd(e.target.value);
    }

    const handleSubmit = async e => {
        e.preventDefault();
        setLoaded(false);

        const response = await postData("api/player", {
            "game_id": gameId,
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
                setLoaded(true);
                setHaveAPlayer(false)

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

    if (haveAPlayer === false) {
        return (
            <CreatePlayer gameId={gameId} />
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
                        <div className="card">
                            <form onSubmit={handleSubmit} autoComplete="off">
                                <label>
                                    Game Id :
                                    <input type="text" autoComplete="off" value={gameId} onChange={handleChangeName} /> </label>
                                {/* <input className="pull-right" type="submit" value="Submit" /> */}
                                <label>
                                    Game Password :
                                    <input type="text" autoComplete="off" value={gamepwd} onChange={handleChangePassword} /> </label>
                                <input className="pull-right" type="submit" value="Submit" />
                            </form>
                        </div>
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