import React from 'react';
import {NavLink} from 'react-router-dom';

export default function PageApp({ authenticated }) {

    return (
        <>
            {authenticated &&
                <div className="container ">
                    <div className="row">
                        <div className="col">App</div>
                    </div>
                    <div className="row">
                        <div className="col">
                          <NavLink activeclassname='active' to='/game-creation'>
                            <a className="button primary is-center">Create a Game</a>
                          </NavLink>
                        </div>
                        </div>
                        <div className="row">
                        <div className="col">
                            <a className="button primary is-center">Join a game</a>
                        </div>
                    </div>
                </div>

            }
        </>
    )
}