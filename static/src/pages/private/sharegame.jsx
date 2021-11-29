import React, { useState, useEffect, useCallback } from "react";
import Loader from "../../components/UI/loader";
import { useParams } from "react-router-dom";
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { useNavigate } from 'react-router-dom';
import WebSocketStatus from "../../components/UI/websocketsatuts";


export default function ShareGame() {

    const { args } = useParams();
    const ws = atob(args);
    const socketUrl = `ws://${ws}`;
    const [messageHistory, setMessageHistory] = useState([]);
    const [adminMessageHistory, setadminMessageHistory] = useState([]);
    let navigate = useNavigate()

    const {
        sendMessage,
        lastMessage,
        readyState,
        getWebSocket
    } = useWebSocket(socketUrl, {
        // share: true,
        // onOpen: e => console.log(e),
        onError: (e) => { console.log(e) },
        shouldReconnect: (closeEvent) => true,
    });


    useEffect(() => {
        if (lastMessage !== null) {
            let message = JSON.parse(lastMessage.data);

            if(message.from == "Admin"){
                setadminMessageHistory(prev => prev.concat(message.message));
            }else{
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
                    <Loader />
                </>
            }

            {readyState == ReadyState.OPEN &&
                <div>
                    <h1>Slave</h1>
                    <WebSocketStatus websocketState={connectionStatus} AdminMsg={adminMessageHistory} />

                    {/* <span>The WebSocket is currently {connectionStatus}</span><br /> */}
                    {/* {lastMessage ? <span>Last message: {lastMessage.data}</span> : null} */}
                    <button onClick={handleOnClick}>test</button>
                    <button onClick={handleOnClickClose}>close</button>


                    <ul>
                        {messageHistory
                            .map((message, idx) => <span key={idx}>{message ? message.data : null}</span>)}
                    </ul>
                </div>
            }
        </>
    )

}