import React from 'react';
import { NavLink } from 'react-router-dom';

export default function PageApp({ authenticated }) {

    return (
        <>
            {authenticated &&
                <div className="container">
                    <div className="row">
                        <div className="col is-center">
                            <h1>Welcome</h1>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col is-center">
                          <p className="text-grey">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <div className="card">
                                <div className="row">
                                    <div className="col is-center">
                                        <NavLink activeclassname='active' to='/game-creation'>
                                            <a className="button primary">Create a Game</a>
                                        </NavLink>
                                    </div>
                                    <div className="col">
                                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam a diam lectus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Sed sem felis, interdum sed accumsan sit amet, auctor ac sapien. Suspendisse non arcu eget elit porttitor malesuada. Cras dolor sem, mollis sit amet ipsum at, vestibulum suscipit quam. Nulla eu suscipit libero. Mauris vitae tempor purus. Nam facilisis fringilla nisl vel malesuada.  </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col">
                            <div className="card">
                                <div className="row">
                                    <div className="col  is-center">
                                        <a className="button primary">Join a game</a>
                                    </div>
                                    <div className="col">
                                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam a diam lectus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Sed sem felis, interdum sed accumsan sit amet, auctor ac sapien. Suspendisse non arcu eget elit porttitor malesuada. Cras dolor sem, mollis sit amet ipsum at, vestibulum suscipit quam. Nulla eu suscipit libero. Mauris vitae tempor purus. Nam facilisis fringilla nisl vel malesuada.  </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            }
        </>
    )
}