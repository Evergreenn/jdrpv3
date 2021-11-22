import React, { useState, useEffect } from "react";
import { NavLink } from 'react-router-dom';
import Cookies from "universal-cookie"

const NavRight = () => {

    const [authenticated, SetAuthenticated] = useState(false);
    const [username, SetUsername] = useState("Username");
    const cookies = new Cookies();

    useEffect(() => {
        const token = cookies.get("token");
        if (token !== undefined) {
            const token_decoded = JSON.parse(atob(token.split('.')[1]));
            SetAuthenticated(true);
            const firstLetter = token_decoded.username[0]
            SetUsername(firstLetter);
        }

    }, [])

    const handleClick = e => {
        e.preventDefault();

    }

    const logout = e => {
        handleClick(e);
        cookies.remove("token"); SetAuthenticated(false);
    }

    return (
        <>
            {!authenticated &&
                <NavLink activeclassname='active' to='/login'>
                    <a className="button outline primary">Login</a>
                </NavLink>
            }
            {authenticated &&
            <>
                <a>
                    <details className="dropdown">
                        <summary className="button clear text-capitalize">
                            <div className="pull-left avatar-circle">
                                <span className="initials">{username}</span>
                            </div>
                            &nbsp;
                        </summary>
                        
                        <div className="card card-drop">
                            <a onClick={handleClick} href="">Account</a>
                            <hr />
                            <a onClick={logout} href="" >Logout</a>
                        </div>
                    </details>
                    <span id="caret">▼</span>
                </a >
                
                </>
            }
        </>
    )
}

export default NavRight