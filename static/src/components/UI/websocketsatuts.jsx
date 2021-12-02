import React, { useState, useEffect } from "react";
import DarkMode from "./darkmode";


const WebSocketStatus = ({ websocketState, AdminMsg, handleOnClickClose }) => {

    const [wsState, SetwsState] = useState(null);
    const [AdminMessage, SetAdminMessage] = useState([]);

    useEffect(() => {

        SetwsState(websocketState);
        SetAdminMessage(AdminMsg)

    }, [websocketState, AdminMsg])

    const onHandleOnClickClose = e => {
        handleOnClickClose(e);
    }

    return (
        <>
            <div className="container">
                <div className="card" >
                    <div className="row">
                        <div className="col-8">
                            <p>The WebSocket is currently:
                                {wsState === "Open" &&
                                    <span className="text-primary"> {wsState}</span>
                                }
                                {wsState !== "Open" &&
                                    <span className="text-error"> {wsState}</span>
                                }
                            </p>
                            <div className="pull-right">
                                <DarkMode />
                                </div>
                        </div>
                        <div className="col-4">
                            <a className="button outline" onClick={onHandleOnClickClose}> <span className="text-error">Quit Game</span></a>
                        </div>
                    </div>
                    <div className="card web">
                        {AdminMessage
                            .map((message, idx) => <p key={idx}>{message.date}: {message ? message.message : null}</p>)}
                    </div>
                </div>
            </div>
        </>
    )
}

export default WebSocketStatus