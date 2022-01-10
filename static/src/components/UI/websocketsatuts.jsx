import React, { useState, useEffect } from "react";
import DarkMode from "./darkmode";
import { toast } from 'react-toastify';

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


    const onClickCopy = (e, id) => {

        navigator.clipboard.writeText(id)
        toast.success("Copied !");
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
                            .map((message, idx) => 
                            {
                                if(message.message.includes("give this id to your players")){
                                    const splited = message.message.split("give this id to your players: ");

                                    return <p key={idx}>{message.date}: give this id to your players: {splited[1]} <span id="ccopy" onClick={e => {onClickCopy(e, splited[1])}} className="tag is-small">click me to copy</span></p>
                                }else {
                                    return <p key={idx}>{message.date}: {message ? message.message : null}</p>
                                }
                            
                            })}
                    </div>
                </div>
            </div>
        </>
    )
}

export default WebSocketStatus