import React, { useState, useEffect } from "react";
import { NavLink } from 'react-router-dom';
import Cookies from "universal-cookie"
import { useNavigate } from 'react-router-dom';
import Loader from "../UI/loader";

const NavRight = ({ authenticated, onHandleLogout }) => {

    const [username, SetUsername] = useState("");
    const [loaded, SetLoaded] = useState(false);

    const cookies = new Cookies();
    let navigate = useNavigate();

    const handleClick = e => {
        e.preventDefault();
    }

    useEffect(() => {

        const token = cookies.get("token");
        if (token !== undefined) {
            const token_decoded = JSON.parse(atob(token.split('.')[1]));
            const firstLetter = token_decoded.username[0]
            SetUsername(firstLetter);
        }else {
            SetUsername("U");
        }
        
        SetLoaded(true);
    }, [authenticated]);

    const logout = e => {
        handleClick(e);
        cookies.remove("token");
        onHandleLogout(false);
        navigate("/", { replace: true })

    }

    if (false == loaded) {
        <Loader />
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
                                <NavLink to='/account'>Account</NavLink>
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