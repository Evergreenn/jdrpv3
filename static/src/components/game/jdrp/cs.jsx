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

    const [statsArr, setStatsArr] = useState(0);

    let { stats } = require('../../../data/jdrp/stats.json');

    useEffect(() => {

        setStrengh(Math.floor(Math.random() * 90));
        setDexterity(Math.floor(Math.random() * 90));
        setEndurance(Math.floor(Math.random() * 90));
        setCharism(Math.floor(Math.random() * 90));
        setPerception(Math.floor(Math.random() * 90));
        setLuck(Math.floor(Math.random() * 90));
        setWillpower(Math.floor(Math.random() * 90));
        setEducation(Math.floor(Math.random() * 90));

        setStatsArr([strengh, dexterity, endurance, charism, perception, luck, willpower, education]);

    }, [])

    return (
        <>
            {stats.map((stats, idx) =>
                <div className="" key={idx}>
                    <StatsCard label={stats.label} stat={statsArr[idx]} description={stats.description} />
                </div>
            )}
        </>
    )

}

export default Cs;