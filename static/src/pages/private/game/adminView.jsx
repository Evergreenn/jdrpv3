import React, { useEffect } from "react";
import Cs from "../../../components/game/jdrp/cs";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Maps from "../../../components/game/jdrp/Ui/map";


const AdminView = ({ playersDashboard }) => {

    const hideMainMenu = () => {
        document.getElementById("main-nav").classList.add("hide")
    }
    useEffect(() => {
        hideMainMenu()

    }, [])


    return (
        <>
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
                            {playersDashboard.length > 0 && playersDashboard.map((el, idx) => {
                                return (<div className="col">
                                    <Cs key={idx} player_cs={el} />
                                </div>)
                            })}
                            {playersDashboard.length === 0 &&
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