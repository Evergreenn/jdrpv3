import React, { useState, useEffect } from "react";
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
            <Tabs>
                <TabList>
                    <Tab>Character</Tab>
                    <Tab>Inventory</Tab>
                    <Tab>Skills</Tab>
                    <Tab>Notes</Tab>
                </TabList>

                <TabPanel>
                    <div className="container-large">
                        <div className="row">
                            <div className="col" style={{ borderLeft: "solid " + `${playerCs.color}`, height: "100%" }}>
                                <Cs player_cs={playerCs} isAdmin={false} onHandleRolls={onHandleRolls} />
                            </div>
                            <div className="col-8">
                                <Maps />
                            </div>
                        </div>
                    </div>
                </TabPanel>
                <TabPanel>
                    <h2>Any content 2</h2>
                </TabPanel>
                <TabPanel>
                    <h2>Any content 3</h2>
                </TabPanel>
                <TabPanel>
                    <h2>Any content LAST</h2>
                </TabPanel>
            </Tabs>

        </>
    )
}

export default UserView;