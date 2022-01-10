import React, { useEffect, useState } from "react";
import Cs from "../../../components/game/jdrp/cs";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Maps from "../../../components/game/jdrp/Ui/map";
import Loader from "../../../components/UI/loader";

const AdminView = ({ playersDashboard }) => {

    const hideMainMenu = () => {
        document.getElementById("main-nav").classList.add("hide")
    }

    const [internalDashboard, setInternalDashboard] = useState([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        hideMainMenu()

    }, [])

    useEffect(() => {
        setLoaded(false);
        setInternalDashboard(playersDashboard);
        setLoaded(true);
    },[playersDashboard])


    return (
        <>
            {!loaded &&
                <Loader />
            }
            <Tabs>
                <TabList>
                    <Tab>Players</Tab>
                    <Tab>Map</Tab>
                    <Tab>Generators</Tab>
                    <Tab>Skills</Tab>
                    <Tab>Notes</Tab>
                </TabList>

                <TabPanel>
                    <div className="container">
                        <div className="row">
                            {internalDashboard.length > 0 && internalDashboard.map((el, idx) => {
                                return (<div className="col " style={{borderLeft: "solid "+`${el.color}`}}>
                                    <Cs key={el.player_id} player_cs={el} />
                                </div>)
                            })}
                            {internalDashboard.length === 0 &&
                                <p>No players</p>
                            }
                        </div>
                    </div>

                </TabPanel>
                <TabPanel>
                    <Maps />
                </TabPanel>
                <TabPanel>
                    <h2>Any content 2</h2>
                </TabPanel>
                <TabPanel>
                    <h2>Any content 4</h2>
                </TabPanel>
                <TabPanel>
                    <h2>Any content LAST</h2>
                </TabPanel>
            </Tabs>

            <div className="navigation-right-admin">
                <a className="button dark outline ">Button#1</a>
                <a className="button dark outline ">Button#1</a>
                <a className="button dark outline ">Button#1</a>
            </div>

        </>
    )
}

export default AdminView