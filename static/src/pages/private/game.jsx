import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import Loader from "../../components/UI/loader";
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { useNavigate } from 'react-router-dom';
import WebSocketStatus from "../../components/UI/websocketsatuts";
import Cookies from "universal-cookie"
import UserView from "./game/userViem";

export default function Game() {

    const { args } = useParams();
    const [messageHistory, setMessageHistory] = useState([]);
    const [isSocketCreator, setIsSocketCreator] = useState(false);
    const [adminMessageHistory, setadminMessageHistory] = useState([]);
    const [notifications, setNotifications] = useState(0);
    const ws = atob(args);
    const socketUrl = `ws://${ws}`;
    let navigate = useNavigate()
    const cookies = new Cookies();
    const token = cookies.get("token");
    const token_decoded = JSON.parse(atob(token.split('.')[1]));

    const queryParams = {
        'token': token
    };

    const {
        sendMessage,
        lastMessage,
        readyState,
        getWebSocket
    } = useWebSocket(socketUrl, {
        // onOpen: () => console.log('opened'),
        onError: (e) => { console.log(e) },
        shouldReconnect: (closeEvent) => true,
        queryParams: queryParams
    }, true);

    useEffect(() => {
        if (lastMessage !== null) {
            let message = JSON.parse(lastMessage.data);

            if (message.is_admin == true) {

                if (message.from === "Console") {
                    setIsSocketCreator(true);
                } else {
                    message.date = new Date(message.date).toISOString().substr(11, 8)
                    setadminMessageHistory(prev => prev.concat(message));
                    setNotifications(notifications => notifications + 1);
                }
            } else {
                setMessageHistory(prev => prev.concat(message));
            }
        }
    }, [lastMessage, setMessageHistory, setadminMessageHistory]);

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
                <div className="navigation-right">
                    {isSocketCreator &&
                        <>
                            <a className="button dark outline ">Button#1</a>
                            <a className="button dark outline ">Button#1</a>
                            <a className="button dark outline ">Button#1</a>
                        </>
                    }
                    <a onClick={handledisplayClick} className="button outline dark" id="clicker">⚙️
                        {notifications > 0 && <span className="badge">{notifications}</span>}
                    </a>
                    <div className="panel-wrap">
                        <div className="panel">
                            <WebSocketStatus websocketState={connectionStatus} AdminMsg={adminMessageHistory} handleOnClickClose={handleOnClickClose} />
                        </div>
                    </div>

                </div>

                {isSocketCreator &&
                    <p>admin</p>}

                {/* <button onClick={handleOnClick}>test</button> */}

                {!isSocketCreator &&
                    <UserView username={token_decoded.username} />
                }

                {readyState != ReadyState.OPEN &&
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