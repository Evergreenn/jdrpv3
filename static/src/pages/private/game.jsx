import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import Loader from "../../components/UI/loader";
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { useNavigate } from 'react-router-dom';
import WebSocketStatus from "../../components/UI/websocketsatuts";
import Cookies from "universal-cookie"
import UserView from "./game/userViem";
import useApiPost from "../../components/ApiCrawler/post";
import Cs from "../../components/game/jdrp/cs";
import AdminView from "./game/adminView";

export default function Game() {

    const { args } = useParams();
    const [messageHistory, setMessageHistory] = useState([]);
    const [isSocketCreator, setIsSocketCreator] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [socketError, setSocketError] = useState(false);
    const [adminMessageHistory, setadminMessageHistory] = useState([]);
    const [playersDashboard, setPlayersDashboard] = useState([]);
    const [notifications, setNotifications] = useState(0);
    const ws = JSON.parse(atob(args));
    const gameID = ws.game_id;
    const socketUrl = `ws://${ws.ws_address}`;
    let navigate = useNavigate()
    const cookies = new Cookies();
    const token = cookies.get("token");
    const token_decoded = JSON.parse(atob(token.split('.')[1]));
    const { postData } = useApiPost();
    const queryParams = {
        'token': token
    };

    const [toSet, setToSet] = useState([]);


    const PlayerConnectionEvent = async message => {
        const data = JSON.parse(message.message);

        //TODO: change this DDOS
        const response = await postData("api/playertokened", {
            "game_id": data.game_id,
            "user_id": data.user_id,
        });

        if (!response.success) {

        } else {

            const toaddd = { ...JSON.parse(response.success.player_cs), player_id: response.success.player_id };

            if (undefined === playersDashboard.find(item => toaddd.player_id === item.player_id)) {
                setPlayersDashboard(Prev => Prev.concat(toaddd));
            }

        }
    }

    const PlayerLeaveEvent = async message => {
        const data = JSON.parse(message.message);

        //TODO: change this DDOS
        const response = await postData("api/playertokened", {
            "game_id": data.game_id,
            "user_id": data.user_id,
        });

        if (!response.success) {

        } else {

            console.log("all players", playersDashboard);
            console.log("id to remove", response.success.player_id);

            const idxToRemove = playersDashboard.findIndex(item => item.player_id === response.success.player_id);
            // console.log("new array of players", NewPlayerDashboard);
            playersDashboard.splice(idxToRemove, 1);
            const toset = playersDashboard;
            console.log(toset)
            setToSet(toset);

            console.log("player dashboard after being set", playersDashboard)
        }
    }

    useEffect(() => {

        setPlayersDashboard(toSet);

    }, [toSet])

    const {
        sendMessage,
        lastMessage,
        readyState,
        getWebSocket
    } = useWebSocket(socketUrl, {
        // onOpen: () => console.log('opened'),
        onError: (e) => { console.log(e) },
        shouldReconnect: (closeEvent) => true,
        onClose: (e) => {
            document.getElementById("main-nav").classList.remove("hide")

            //TODO: add a message for letting the user know that the mj closed the game.
            console.log(e)
            // setSocketError(true)
        },
        queryParams: queryParams
    }, true);

    useEffect(() => {

        if (!isSocketCreator) {
            return (
                <UserView user_id={token_decoded.user_id} game_id={gameID} />
            )
        }
        setLoaded(true);

    }, [isSocketCreator])


    useEffect(async () => {
        if (lastMessage !== null) {
            let message = JSON.parse(lastMessage.data);

            // console.log(message)

            if (message.from === "Game") {
                switch (message.scope){
                    case "PlayerConnection":
                        PlayerConnectionEvent(message)
                    break;
                    case "PlayerLeave":
                        PlayerLeaveEvent(message)
                    break;
                }

            }

            if (message.is_admin == true) {

                if (message.from === "Console") {
                    setIsSocketCreator(true);
                } else {
                    message.date = new Date(message.date).toISOString().substr(11, 8)
                    setadminMessageHistory(prev => prev.concat(message));
                    setNotifications(notifications => notifications + 1);
                }
            } 
            // else {
            //     setMessageHistory(prev => prev.concat(message));
            // }
        }
    }, [lastMessage, setMessageHistory, setadminMessageHistory]);


    useEffect(() => {

        if (socketError !== false) {
            window.setTimeout(() => {
                navigate("/app", { replace: true })
            }, 7000)
        }

    }, [socketError])

    const connectionStatus = {
        [ReadyState.CONNECTING]: 'Connecting',
        [ReadyState.OPEN]: 'Open',
        [ReadyState.CLOSING]: 'Closing',
        [ReadyState.CLOSED]: 'Closed',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    }[readyState];


    const handleOnClick = useCallback(() =>
        sendMessage('Hello'), []
    );

    const handledisplayClick = e => {
        e.preventDefault();
        document.getElementById("clicker").classList.toggle("trigger");
        setNotifications(0);
    }

    const handleOnClickClose = useCallback(() => {
        getWebSocket().close(1000)
        document.getElementById("main-nav").classList.remove("hide")
        navigate("/app", { replace: true })
    }, []);

    return (
        <>
            <div>
                {isSocketCreator &&
                    <AdminView playersDashboard={playersDashboard} />
                }

                {!isSocketCreator &&
                    <UserView user_id={token_decoded.user_id} game_id={gameID} />
                }

                <div className="navigation-right">
                    <a onClick={handledisplayClick} className="button outline dark settings" id="clicker">⚙️
                        {notifications > 0 && <span className="badge">{notifications}</span>}
                    </a>
                    <div className="panel-wrap">
                        <div className="panel">
                            <WebSocketStatus websocketState={connectionStatus} AdminMsg={adminMessageHistory} handleOnClickClose={handleOnClickClose} />
                        </div>
                    </div>
                </div>

                {readyState != ReadyState.OPEN && loaded &&
                    <Loader />
                }

                {readyState == ReadyState.OPEN &&

                    <ul>
                        {messageHistory
                            .map((message, idx) => <p key={idx}>{message.from}: {message ? message.message : null}</p>)}
                    </ul>
                }
            </div>
        </>
    )
}