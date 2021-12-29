import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import Loader from "../../components/UI/loader";
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { useNavigate } from 'react-router-dom';
import WebSocketStatus from "../../components/UI/websocketsatuts";
import Cookies from "universal-cookie"
import UserView from "./game/userViem";
import ToasterAlert from "../../components/UI/toasterAlert";

export default function Game() {

    const { args } = useParams();
    const [messageHistory, setMessageHistory] = useState([]);
    const [isSocketCreator, setIsSocketCreator] = useState(false);
    const [socketError, setSocketError] = useState(false);
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
        shouldReconnect: (closeEvent) => false,
        onClose: (e) => {

            //TODO: add a message for letting the user know that the mj closed the game.
            console.log(e)
                setSocketError(true)        
        },
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


    useEffect(() => {

        if(socketError !== false){
            window.setTimeout(() => {
                navigate("/app", { replace: true })
            }, 7000)
        }

    }, [socketError])

    useEffect(() => {

        return (
            <UserView username={token_decoded.username} />
        )

    }, [isSocketCreator])

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

                {/* {!isSocketCreator &&
                    <UserView username={token_decoded.username} />
                } */}

                {readyState != ReadyState.OPEN &&
                    <Loader />
                }

                {socketError &&
                    <ToasterAlert level="error" message="The MJ close the connection. You are going to be redirected"/>
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