import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import Loader from "../../components/UI/loader";
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { useNavigate } from 'react-router-dom';
import WebSocketStatus from "../../components/UI/websocketsatuts";
import Cookies from "universal-cookie"

export default function Game() {

    const { args } = useParams();
    const [messageHistory, setMessageHistory] = useState([]);
    const [adminMessageHistory, setadminMessageHistory] = useState([]);
    const [notifications, setNotifications] = useState(0);
    const ws = atob(args);
    const socketUrl = `ws://${ws}`;
    let navigate = useNavigate()
    const cookies = new Cookies();
    const token = cookies.get("token");

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

            if (message.from == "Admin") {
                console.log(message)
                message.date = new Date(message.date).toISOString().substr(11, 8)
                setadminMessageHistory(prev => prev.concat(message));
                setNotifications(notifications => notifications + 1);
            } else {
                setMessageHistory(prev => prev.concat(message.message));
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
        navigate("/app", { replace: true })
    }, []);

    return (
        <>
            <div>
                <div className="navigation-right">
                    <a onClick={handledisplayClick} className="button outline dark" id="clicker">Admin panel
                        {notifications > 0 && <span className="badge">{notifications}</span>}
                    </a>

                    <div className="panel-wrap">
                        <div className="panel">
                            <WebSocketStatus websocketState={connectionStatus} AdminMsg={adminMessageHistory} handleOnClickClose={handleOnClickClose} />
                        </div>
                    </div>

                    <a className="button dark outline ">Button#1</a>

                </div>

                <br />

                <button onClick={handleOnClick}>test</button>

                {readyState != ReadyState.OPEN &&
                    <Loader />
                }

                {readyState == ReadyState.OPEN &&

                    <ul>
                        {messageHistory
                            .map((message, idx) => <p key={idx}>{message ? message : null}</p>)}
                    </ul>
                }
            </div>
        </>
    )
}