import React, { useState, useEffect } from "react";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Loader from "../../../components/UI/loader";
import Cs from "../../../components/game/jdrp/cs";

const UserView = ({ username }) => {
    const [loaded, setLoaded] = useState(false);
    const [displayName, setDisplayname] = useState(username);
    const capitalizeFirstLetter = ([first, ...rest], locale = navigator.language) => {
        setDisplayname(first.toLocaleUpperCase(locale) + rest.join(''));
    };

    const hideMainMenu = () => {
        document.getElementById("main-nav").classList.add("hide")
    }

    useEffect(() => {
        hideMainMenu();
        capitalizeFirstLetter(username)
        setLoaded();
    }, [username])

    if (loaded === false) {
        return (
            <Loader />
        )
    }

    return (
        <>
            <Tabs>
                <TabList>
                    <Tab>{displayName}</Tab>
                    <Tab>Inventory</Tab>
                    <Tab>Skills</Tab>
                    <Tab>Notes</Tab>
                </TabList>

                <TabPanel>
                    <h2>Any content 1</h2>
                    <div className="container">
                        <div className="card">
                            <Cs />
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