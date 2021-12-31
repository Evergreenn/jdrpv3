import React, { useState, useEffect } from "react";
import StatsCard from "./Ui/StatsCard";


const Cs = ({ player_cs }) => {

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

        if (!player_cs) {
            setStrengh(Math.floor(Math.random() * 90));
            setDexterity(Math.floor(Math.random() * 90));
            setEndurance(Math.floor(Math.random() * 90));
            setCharism(Math.floor(Math.random() * 90));
            setPerception(Math.floor(Math.random() * 90));
            setLuck(Math.floor(Math.random() * 90));
            setWillpower(Math.floor(Math.random() * 90));
            setEducation(Math.floor(Math.random() * 90));
            setStatsArr([strengh, dexterity, endurance, charism, perception, luck, willpower, education]);

        } else {
            setStatsArr(player_cs);
        }
    }, [])

    return (
        <>

            {/*
{"
luck": 45,
"name": "efsef",
"race": "human",
"class": "warrior",
"color": "#23127c",
"avatar": "portrait7",
"charism": 45,
"strengh": 50,
"alignment": "Lawful good",
"dexterity": 15,
"education": 40,
"endurance": 40,
"willpower": 25,
"perception": 40,
"particularity": "sefsef"
} 
*/}

            <div className="card">
                <div className="row">
                    <div className="col">
                        <p>name: {statsArr.name} </p>
                        <p>race: {statsArr.race} </p>
                        <p>class: {statsArr.class} </p>
                    </div>
                    <div className="pull-right">
                        <p>alignment: {statsArr.alignment} </p>
                        <p>particularity: {statsArr.particularity} </p>
                    </div>
                </div>
            </div>
            {stats.map((stats, idx) =>
                <div className="" key={idx}>
                    <StatsCard label={stats.label} stat={statsArr[stats.label]} description={stats.description} />
                </div>
            )}
        </>
    )

}

export default Cs;