import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import Loader from "../../components/UI/loader";
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { useNavigate } from 'react-router-dom';
import WebSocketStatus from "../../components/UI/websocketsatuts";
import UserView from "./game/userViem";
import useApiPost from "../../components/ApiCrawler/post";
import AdminView from "./game/adminView";
import { toast } from 'react-toastify';
import useCookies from "../../components/security/cookies";


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

    const { getToken, getTokenDecoded } = useCookies();
    const token = getToken();
    const token_decoded = getTokenDecoded();

    const { postData } = useApiPost();
    const queryParams = {
        'token': token
    };

    const rollMessage = {
        player_id: "",
        stat_rolled: "",
        type: "roll"
    };


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
                toast.info(toaddd.name + " has arrived !")
            } else {
                //Player reload the page
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
            const player = JSON.parse(response.success.player_cs);
            setPlayersDashboard(Prev => Prev.filter(item => item.player_id !== response.success.player_id));
            toast.info(player.name + " left the game !")
        }
    }

    useEffect(() => {

        setPlayersDashboard(playersDashboard);

        setLoaded(true);
    }, [playersDashboard])

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
            setSocketError(true)
        },
        queryParams: queryParams
    }, true);


    useEffect(async () => {
        if (lastMessage !== null) {
            let message = JSON.parse(lastMessage.data);

            // console.log(message)

            if (message.from === "Game") {
                switch (message.scope) {
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

            else {
                const msg = JSON.parse(message.message);

                if (msg.roll_type === "roll") {
                    toast.info(
                        <div className="container">
                            {msg.player_id} has rolled the dice !
                            <div className="card">
                                <div className="row">
                                    <div className="col">
                                        target

                                    </div>
                                    <div className="col">

                                    </div>
                                    <div className="col">
                                        roll result

                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col">
                                        {msg.stat_rolled}

                                    </div>
                                    <div className="col">
                                        →
                                    </div>

                                    {msg.stat_rolled > msg.roll_result ?
                                        <div className="col">
                                            <span className="text-primary">{msg.roll_result}</span>
                                        </div>
                                        :
                                        <div className="col">
                                            <span className="text-error">{msg.roll_result}</span>
                                        </div>
                                    }

                                </div>
                            </div>
                        </div>
                        , {
                            // className: 'card',
                            autoClose: 10000,
                            style: { width: "600px", height: "200px" },

                        });
                }
                // setMessageHistory(prev => prev.concat(message));
            }
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


    const onHandleRolls = (player_id, stat_rolled) => {

        rollMessage.player_id = player_id;
        rollMessage.stat_rolled = stat_rolled;

        const jsoned = JSON.stringify(rollMessage);

        console.log(jsoned);
        sendMessage(jsoned);
    }


    return (
        <>
            <div>
                {readyState != ReadyState.OPEN && !loaded &&
                    <Loader />
                }

                {!loaded &&
                    <Loader />
                }


                {isSocketCreator && loaded &&
                    <AdminView playersDashboard={playersDashboard} onHandleRolls={onHandleRolls} />
                }

                {!isSocketCreator && loaded &&
                    <UserView user_id={token_decoded.user_id} game_id={gameID} onHandleRolls={onHandleRolls} />
                }

                <div className="navigation-right">
                    <a onClick={handledisplayClick} className="button outline dark settings" id="clicker">⚙️
                        {notifications > 0 && <span className="badge">{notifications}</span>}
                    </a>
                    <div className="panel-wrap">
                        <div className="panel card">
                            <WebSocketStatus websocketState={connectionStatus} AdminMsg={adminMessageHistory} handleOnClickClose={handleOnClickClose} />
                        </div>
                    </div>
                </div>

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