import React, {useState} from "react";
import { render } from "react-dom";
import { useMatch } from "react-router-dom";

export default function Game() {

    const match = useMatch();
    console.log(match);

    render(
        <>
        </>
    )
}