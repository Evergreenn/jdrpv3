import React, { useState, useEffect } from "react";

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
                <div className="row">
                    {/* <div className="col-8"></div> */}
                    <div className="col">
                        <div className="card">
                            <p>The WebSocket is currently: {wsState}</p>
                            <button onClick={onHandleOnClickClose}>close</button>
                            <p>{AdminMessage
                                .map((message, idx) => <p key={idx}>{message ? message : null}</p>)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}

export default WebSocketStatus