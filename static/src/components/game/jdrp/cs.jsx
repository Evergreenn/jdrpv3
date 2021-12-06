import React, { useState, useEffect } from "react";
import StatsCard from "./Ui/StatsCard";


const Cs = () => {

    const [strengh, setStrengh] = useState(0);
    const [dexterity, setDexterity] = useState(0);
    const [endurance, setEndurance] = useState(0);
    const [charism, setCharism] = useState(0);
    const [perception, setPerception] = useState(0);
    const [luck, setLuck] = useState(0);
    const [willpower, setWillpower] = useState(0);
    const [education, setEducation] = useState(0);

    let stats = require('../../../data/jdrp/stats.json');

    useEffect(() => {
        setStrengh( Math.floor(Math.random() * 90));
        setDexterity( Math.floor(Math.random() * 90));
        setEndurance( Math.floor(Math.random() * 90));
        setCharism( Math.floor(Math.random() * 90));
        setPerception( Math.floor(Math.random() * 90));
        setLuck( Math.floor(Math.random() * 90));
        setWillpower( Math.floor(Math.random() * 90));
        setEducation( Math.floor(Math.random() * 90));
        

    }, [])

    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col">
                        <div className="row">
                            <div className="col">
                                <StatsCard label="strengh" stat={strengh} description={stats.strengh.description} />
                            </div>
                            <div className="col">
                                <StatsCard label="dexterity" stat={dexterity} description={stats.dexterity.description} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <StatsCard label="endurance" stat={endurance} description={stats.endurance.description} />
                            </div>
                            <div className="col">
                                <StatsCard label="charism" stat={charism} description={stats.charism.description} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <StatsCard label="perception" stat={perception} description={stats.perception.description} />
                            </div>
                            <div className="col">
                                <StatsCard label="luck" stat={luck} description={stats.luck.description} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <StatsCard label="willpower" stat={willpower} description={stats.willpower.description} />
                            </div>
                            <div className="col">
                                <StatsCard label="education" stat={education} description={stats.education.description} />
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        
                    </div>
                </div>
            </div>
        </>
    )

}

export default Cs;