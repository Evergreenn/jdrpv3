import React from 'react';
import { NavLink } from 'react-router-dom';

const Login = () => {

    return (
        <>
            <br />
            <div className="container">
                <div className="row is-center">
                    <div className="card is-center">
                        <div className="col6">
                            <label htmlFor="login">Login</label>
                            <input id="login" type="text" />
                            <label htmlFor="pass">Password</label>
                            <input type="password" />
                            <br />
                            <button className="button primary pull-right">Login</button>
                        </div>
                    </div>
                </div>
                <div className="row is-center">
                    <NavLink activeclassname='active' to='/create-account'><a>Don't have an account yet ?</a></NavLink>
                </div>
            </div>
        </>
    )
}

export default <Login />