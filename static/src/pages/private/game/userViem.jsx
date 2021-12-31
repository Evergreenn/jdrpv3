import React, { useState, useEffect } from "react";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Loader from "../../../components/UI/loader";
import Cs from "../../../components/game/jdrp/cs";
import useApiPost from "../../../components/ApiCrawler/post";

const UserView = ({ user_id, game_id }) => {
    const [loaded, setLoaded] = useState(false);
    // const [displayName, setDisplayname] = useState("lul");
    const [playerCs, setPlayerCs] = useState({});
    // const capitalizeFirstLetter = ([first, ...rest], locale = navigator.language) => {
    //     setDisplayname(first.toLocaleUpperCase(locale) + rest.join(''));
    // };

    const hideMainMenu = () => {
        document.getElementById("main-nav").classList.add("hide")
    }

    const {postData} = useApiPost();

    useEffect( async () => {
        hideMainMenu();
        
        const response = await postData("api/playertokened", {
            "game_id": game_id,
            "user_id": user_id,
        });

        console.log(response);

        if (!response.success) {

        } else {
            console.log(response.success);

            setPlayerCs(JSON.parse(response.success.player_cs));
            console.log(playerCs.name)
            // setDisplayname(playerCs.name)
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
                    <h2>Any content 1</h2>
                    <div className="container">
                        <div className="row">
                            <div className="col">
                                <Cs player_cs={playerCs} />
                            </div>
                        <div className="col"></div>
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