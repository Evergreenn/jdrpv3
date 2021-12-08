import React, { useState, useEffect } from "react";
import Loader from "../../components/UI/loader";
import { useNavigate } from 'react-router-dom';
import statsRules from '../../data/jdrp/stats.json'
import classRules from '../../data/jdrp/classes.json'
import raceRules from '../../data/jdrp/races.json'
import csRules from '../../data/jdrp/character_creation_rules.json'

const CreatePlayer = ({ gameId }) => {

    const [state, setState] = useState({});
    const [stats, setStats] = useState(statsRules);
    const [classes, setClasses] = useState(classRules);
    const [formClass, setFormClass] = useState(null);
    const [races, setRaces] = useState(raceRules);
    const [loaded, setLoaded] = useState(false);
    const [classDescr, setClassDescr] = useState(false);
    const [raceDescr, setRaceDescr] = useState(false);

    const [classchoiced, setClassChoices] = useState("");


    useEffect(() => {
        stats.stats.forEach(element => {
            setState(prevState => ({ ...prevState, [element.label]: 0 }));
        })
        setLoaded(true);

    }, []);

    useEffect(() => {

        // console.log("eeeeee");
        
    }, [state]);


    const handleChangeName = e => {
        console.log(e.target.value);
    }

    const handleChangeClass = e => {
        // console.log(e.target.value);
        const item = classes.find(element => element.label == e.target.value);
        console.log(item);
        // let item_before = classes.find(element => element.label == classchoiced);

        const rules = csRules.class_stats[item.label];
        if(classchoiced === ""){
            const prevrules = 0
        }else {
            const prevrules = csRules.class_stats[classchoiced];
        }
        const t = {};

        Object.entries(state).forEach(([key, val]) => {
            t[key] = (parseInt(state[key]) - parseInt(prevrules[key])) + parseInt(rules[key]);

        });

        setState(t);
        setClassChoices(e.target.value)
        setClassDescr(item.description);
    }


    const handleChangeRace = e => {
        console.log(e.target.value);
        const item = races.find(element => element.label == e.target.value);
        const rules = csRules.race_stats[item.label];
        const t = {};

        Object.entries(state).forEach(([key, val]) => {
            console.log(state[key]);
            console.log(rules[key]);
            t[key] = parseInt(state[key]) + parseInt(rules[key]);

        });

        setState(t);
        setRaceDescr(item.description);
    }


    const handleChangeStats = e => {
        const { name, value } = e.target;

        // console.log(value);
        setState(prevState => ({ ...prevState, [name]: value }));

        // console.log(state);
    }

    if (loaded === false) {
        return (
            <Loader />
        )
    }

    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col is-center"><h1>Character creation</h1></div>
                </div>

                <form action="">
                    <div className="card row">
                        <div className="col">
                            <label>
                                Character name :
                                <input type="text" autoComplete="off" onChange={handleChangeName} />
                            </label>

                            <label>
                                Color :
                                <input type="color" autoComplete="off" onChange={handleChangeName} />
                            </label>
                        </div>
                        <div className="col">
                            <label>
                                Character name :
                                <input type="text" autoComplete="off" onChange={handleChangeName} />
                            </label>

                            <label>
                                Character name :
                                <input type="text" autoComplete="off" onChange={handleChangeName} />
                            </label>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col is-center"><h2>Class'n race</h2></div>
                    </div>
                    <div className="card row">
                        <div className="col">
                            <label>
                                Class :
                                <select onChange={handleChangeClass}>
                                    {classes.map((data, idx) =>
                                        <option key={idx} value={data.label}>{data.label}</option>
                                    )}
                                </select>
                            </label>

                            {classDescr &&
                                <p className="small">{classDescr}</p>
                            }
                        </div>
                        <div className="col">
                            <label>
                                Race :
                                <select onChange={handleChangeRace}>
                                    {races.map((data, idx) =>
                                        <option key={idx} value={data.label}>{data.label}</option>
                                    )}
                                </select>
                            </label>

                            {raceDescr &&
                                <p className="small">{raceDescr}</p>
                            }
                        </div>
                    </div>

                    <div className="row">
                        <div className="col is-center"><h2>Stats</h2></div>
                        <p>{stats.description}</p>
                    </div>
                    <div className="card row">
                        {stats.stats.map((stats, idx) =>
                            <div className="col" key={idx}>
                                <div className="">
                                    <label className="text-capitalize">
                                        {stats.label}
                                        <input type="number" min="0" name={stats.label} autoComplete="off" value={state[stats.label]} onChange={handleChangeStats} />
                                        <p className="small">{stats.description}</p>
                                        <p className="small">Best for: {stats.mandatory}</p>
                                    </label>
                                </div>

                            </div>
                        )}
                    </div>
                </form>
            </div>
        </>
    )
}

export default CreatePlayer;

