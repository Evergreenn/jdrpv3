import React from "react";

const toasterAlert = ({ level, message }) => {

    //TODO: put a timer to dismiss the toaster


    if (level === "success") {
        return (
            <div class="wrapper">
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
            <div class="wrapper">
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
            <div class="wrapper">
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
            <div class="wrapper">
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

export default toasterAlert;