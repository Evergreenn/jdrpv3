import React, { useEffect, useState } from "react";

const DarkMode = () => {

    const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const [dark] = useState(userPrefersDark);

    const writeInNode = () => {
        let towrite = '';
        const a = document.getElementById("switch-dark-mode")

        if (document.body.classList.contains("dark")) {
            towrite = "☀️";
        } else {
            towrite = "🌙";

        }
        a.innerHTML = towrite;
    }

    useEffect(() => {
        writeInNode()
    })

    const handleEvent = event => {
        event.preventDefault();
        document.body.classList.toggle("dark");

        writeInNode()
    }

    return (
        <a id="switch-dark-mode" onClick={handleEvent} class="button outline dark">{dark}</a>
    )

}

export default DarkMode