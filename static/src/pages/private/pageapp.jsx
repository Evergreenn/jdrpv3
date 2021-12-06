import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import useApiGet from '../../components/ApiCrawler/get';
import useApiPost from '../../components/ApiCrawler/post';
import Loader from '../../components/UI/loader';
import { useNavigate } from "react-router-dom";



export default function PageApp({ authenticated }) {

    const [games, setGames] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const { getData } = useApiGet();
    const { postData } = useApiPost();
    const navigate = useNavigate();


    useEffect(async () => {

        const response = await getData("api/get-user-game");

        if (response.success) {
            setGames(response.success);
            setLoaded(true);
        }
    }, [loaded]);

    const handleClick = (slug) => {
        const to64 = btoa(slug);
        //TODO
        navigate({
            pathname: `/game/${to64}`,
        });
    }

    const handleRemoveClick = (gameId) => {

        postData("api/delete-game", {
            "game_id": gameId
        })
        setLoaded(false);
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
                    {!loaded &&
                        <Loader />
                    }
                    {loaded && games.length > 0 &&


                        <div className="container">
                            <h1 className="is-center">Your games</h1>
                            <p className="text-dark is-center"> Delete a game will erase all data related to it and all progression will be lost. This should be taked seriously.</p>

                            {games
                                .map((data, idx) =>
                                    <div className="row">
                                        <div className="col ">
                                            <div className="card">
                                                <table>
                                                    <tr key={idx}>
                                                        <td className="text-center">{data.game_name}</td>
                                                        <td className="text-center">{data.game_type}</td>
                                                        <td className="text-center">{data.created_at}</td>
                                                        <td className="text-center">
                                                            <a className="button primary" onClick={() => handleClick(data.slug)}> Launch</a>
                                                            <a className="button error" onClick={() => handleRemoveClick(data.game_id)}> Delete</a>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    }
                </>
            }
        </>
    )
}