import React, { useState, useEffect, Suspense } from "react";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Loader from "../../../components/UI/loader";
import Cs from "../../../components/game/jdrp/cs";
import useApiPost from "../../../components/ApiCrawler/post";
import Maps from "../../../components/game/jdrp/Ui/map";

const UserView = ({ user_id, game_id, onHandleRolls }) => {
    const [loaded, setLoaded] = useState(false);
    // const [displayName, setDisplayname] = useState("lul");
    const [playerCs, setPlayerCs] = useState({});
    // const capitalizeFirstLetter = ([first, ...rest], locale = navigator.language) => {
    //     setDisplayname(first.toLocaleUpperCase(locale) + rest.join(''));
    // };

    const hideMainMenu = () => {
        document.getElementById("main-nav").classList.add("hide")
    }

    const { postData } = useApiPost();

    useEffect(async () => {
        hideMainMenu();

        const response = await postData("api/playertokened", {
            "game_id": game_id,
            "user_id": user_id,
        });

        if (!response.success) {

        } else {

            setPlayerCs({ ...JSON.parse(response.success.player_cs), player_id: response.success.player_id });
            setLoaded(true);
        }

    }, [])

    if (loaded === false) {
        return (
            <Loader />
        )
    }

    return (
        <>

            <div className="userviewtabs">
                <Tabs>

                    <TabList>
                        <div className="playerInfo">
                            <div className="">
                                <Suspense fallback={<Loader />}>
                                    <img src="https://via.placeholder.com/200x250" alt="" />
                                </Suspense>
                            </div>
                            <div>
                                {playerCs.name}
                            </div>
                        </div>

                        <Tab>Character</Tab>
                        <Tab>Inventory</Tab>
                        <Tab>Skills</Tab>
                        <Tab>Notes</Tab>
                    </TabList>
                    <TabPanel>
                        <div className="container-large">
                            <h2>Character view</h2>
                            <div className="card">
                                <div className="row">
                                    <div className="col">
                                        <div className="card" style={{ borderLeft: "solid " + `${playerCs.color}`, }}>
                                            <Cs player_cs={playerCs} isAdmin={false} onHandleRolls={onHandleRolls} />
                                        </div>
                                    </div>
                                    <div className="col-8">
                                        <div className="card">

                                            <Maps />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabPanel>
                    <TabPanel>
                        <div className="container-large ">
                            <h2>Inventory view</h2>
                            <div className="card">
                            </div>
                        </div>
                    </TabPanel>
                    <TabPanel>
                        <div className="container-large ">
                            <h2>Skills view</h2>
                            <div className="card">
                                <div className="row">
                                    <div className="col-12">
                                        {/* <textarea name="" id="" cols="30" rows="10"></textarea> */}
                                    </div>
                                </div>

                            </div>
                        </div>
                    </TabPanel>
                    <TabPanel>
                        <div className="container-large ">
                            <h2>Notes</h2>
                            <div className="card">
                                <div className="row">
                                    <div className="col-12">
                                        <textarea name="" id="" cols="30" rows="10"></textarea>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </TabPanel>
                </Tabs>
            </div>



        </>
    )
}

export default UserView;