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
                setadminMessageHistory(prev => prev.concat(message.message));
                setNotifications(notifications => notifications + 1 );
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
        navigate("/lobby", { replace: true })

    }, []);

    return (
        <>
            {readyState != ReadyState.OPEN &&
                <>
                    <div className="container">
                        <div className="row">
                            <div className="col is-center"><p>Trying to reconnect ...</p></div>
                        </div>
                    </div>
                    <p>{connectionStatus}</p>
                    <Loader />
                </>
            }

            {readyState == ReadyState.OPEN &&
                <div>
                    
                    <button onClick={handledisplayClick} className="button outline dark" id="clicker">Admin panel 
                    {notifications > 0 && <span className="badge">{notifications}</span>}
                    </button>
                    <div className="panel-wrap">
                        <div className="panel">
                            <WebSocketStatus websocketState={connectionStatus} AdminMsg={adminMessageHistory} handleOnClickClose={handleOnClickClose} />
                        </div>
                    </div>

                    <br />


                    <button onClick={handleOnClick}>test</button>
                    {/* <button onClick={handleOnClickClose}>close</button> */}

                    <ul>
                        {messageHistory
                            .map((message, idx) => <p key={idx}>{message ? message : null}</p>)}
                    </ul>
                </div>
            }
        </>
    )
}