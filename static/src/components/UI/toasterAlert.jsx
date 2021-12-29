import React, { useEffect, useRef } from "react";

const ToasterAlert = ({ level, message }) => {

    const toasterRef = useRef(null);

        useEffect(() => {
            window.setTimeout(() => {
                toasterRef.current.style.display = "none";
            }, 5000)
        }, [toasterRef])

    if (level === "success") {
        return (
            <div ref={toasterRef} class="wrapper">
                <div class="toast success">
                    <div class="outer-container"> <i class="fas fa-check-circle"></i> </div>
                    <div class="inner-container">
                        <p>Success</p>
                        <p>{message}</p>
                    </div>
                    {/* <button>&times;</button> */}
                </div>
            </div>
        )
    } else if (level === "error") {
        return (
            <div ref={toasterRef} class="wrapper">
                <div class="toast error">
                    <div class="outer-container"> <i class="fas fa-times-circle"></i> </div>
                    <div class="inner-container">
                        <p>Error</p>
                        <p>{message}</p>
                    </div>
                    {/* <button>&times;</button> */}
                </div>

            </div>
        )
    } else if (level === "info") {
        return (
            <div ref={toasterRef} class="wrapper">
                <div class="toast info">
                    <div class="outer-container"> <i class="fas fa-info-circle"></i> </div>
                    <div class="inner-container">
                        <p>Info</p>
                        <p>{message}</p>
                    </div>
                    {/* <button>&times;</button> */}
                </div>

            </div>
        )
    } else {
        return (
            <div ref={toasterRef} class="wrapper">
                <div class="toast warning">
                    <div class="outer-container"> <i class="fas fa-exclamation-circle"></i> </div>
                    <div class="inner-container">
                        <p>Warning</p>
                        <p>{message}</p>
                    </div>
                    {/* <button>&times;</button> */}
                </div>
            </div>
        )
    }
}

export default ToasterAlert;