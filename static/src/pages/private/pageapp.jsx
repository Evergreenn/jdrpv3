import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import useApiPost from '../../components/ApiCrawler/post';
import { useNavigate } from "react-router-dom";
import Pagination from '../../components/UI/pagination';
import Loader from '../../components/UI/loader';

export default function PageApp({ authenticated }) {

    const { postData } = useApiPost();
    const navigate = useNavigate();

    const handleClick = async gameId => {

        console.log(gameId);

        const ws_address = await postData("api/start-game", {
            "game_id": gameId
        });

        const to64 = btoa(JSON.stringify(ws_address.success));
        //TODO
        navigate({
            pathname: `/game/${to64}`,
        });
    }

    const handleRemoveClick = gameId => {

        postData("api/delete-game", {
            "game_id": gameId
        })
    }

    return (
        <>
            {authenticated &&
                <>
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
                                            <NavLink activeclassname='active' to='/lobby'>
                                                <a className="button primary">Join a game</a>
                                            </NavLink>
                                        </div>
                                        <div className="col">
                                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam a diam lectus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Sed sem felis, interdum sed accumsan sit amet, auctor ac sapien. Suspendisse non arcu eget elit porttitor malesuada. Cras dolor sem, mollis sit amet ipsum at, vestibulum suscipit quam. Nulla eu suscipit libero. Mauris vitae tempor purus. Nam facilisis fringilla nisl vel malesuada.  </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="container">
                        <Pagination handleRemoveClick={handleRemoveClick} handleClick={handleClick} />
                    </div>

                </>
            }
        </>
    )
}