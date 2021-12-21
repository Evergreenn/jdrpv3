import React, { useState, useEffect, useRef } from "react";
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
    const [totalPoint, setTotalPoint] = useState(csRules.game_stats.max_stat_wcl);

    // const [naturalStats, setNaturalStats] = useState({});
    const [classchoiced, setClassChoiced] = useState("warrior");
    const [racechoiced, setRaceChoices] = useState("human");

    const plus = useRef([]);
    const minus = useRef([]);
    const Ref = useRef([]);
    Ref.current = stats.stats.map((_, i) => Ref.current[i] ?? React.createRef());
    plus.current = stats.stats.map((_, i) => plus.current[i] ?? React.createRef());
    minus.current = stats.stats.map((_, i) => minus.current[i] ?? React.createRef());

    // const resetNaturalStats = () => {
    //     stats.stats.forEach(element => {
    //         setNaturalStats(prevState => ({ ...prevState, [element.label]: 0 }));
    //     });
    // }


    useEffect(() => {
        stats.stats.forEach(element => {
            // setNaturalStats(prevState => ({ ...prevState, [element.label]: 0 }));
            setState(prevState => ({ ...prevState, [element.label]: 0 }));
        });

        setLoaded(true);

    }, []);


    useEffect(() => {

        setTotalPoint(csRules.game_stats.max_stat_wcl);

        const classitem = classes.find(element => element.label === classchoiced);
        const classrules = csRules.class_stats[classitem.label];
        const raceitem = races.find(element => element.label === racechoiced);
        const racerules = csRules.race_stats[raceitem.label];


        const t = {};

        Object.entries(classrules).forEach(([key, val]) => {

            if (isNaN(t[key])) {
                t[key] = parseInt(val);
            } else {
                t[key] = t[key] + parseInt(val);
            }
        });

        Object.entries(racerules).forEach(([key, val]) => {

            if (isNaN(t[key])) {
                t[key] = parseInt(val);
            } else {
                t[key] = t[key] + parseInt(val);
            }
        });

        setState(t);
        setClassDescr(classitem.description);
        setRaceDescr(raceitem.description);

        let sum = 0;

        Object.entries(t).forEach(([key, val]) => {
            sum += val;
        });

        setTotalPoint(prevTotalPoint => (prevTotalPoint - sum));


    }, [classchoiced, racechoiced]);

    useEffect(() => {

        setTotalPoint(() => {
            let sum = 0;

            Object.entries(state).forEach(([key, val]) => {
                sum += parseInt(val);
            });
            return csRules.game_stats.max_stat_wcl - sum;
        })
        
    }, [state])


    const handleChangeName = e => {
    }

    const handleChangeClass = classSelected => {
        setClassChoiced(classSelected);
    }


    const handleChangeRace = raceSelected => {
        setRaceChoices(raceSelected)
    }


    const handleChangeStats = e => {
        const { name, value } = e.target;

        console.log(name, value);
        setState(prevState => ({ ...prevState, [name]: value }));
    }

    const handleKeyDown = (e) => {
        e.preventDefault();
    }

    const handleMinus = (e, i, ref) => {
        e.preventDefault();
        ref.current.stepDown();

        if(ref.current.value <= csRules.game_stats.min_per_cat){
            minus.current[i].current.disabled = true;
        }

        if(ref.current.value < csRules.game_stats.max_per_cat){
            plus.current[i].current.disabled = false;
        }

        setState(prevState => ({ ...prevState, [ref.current.name]: ref.current.value }));
        // console.log(ref.current);
    }

    const handlePlus = (e, i, ref) => {
        e.preventDefault();
        ref.current.stepUp()
        
        
        if(ref.current.value >= csRules.game_stats.max_per_cat){
            plus.current[i].current.disabled = true;
        }

        if(ref.current.value > csRules.game_stats.min_per_cat){
            minus.current[i].current.disabled = false;
        }

        setState(prevState => ({ ...prevState, [ref.current.name]: ref.current.value }));

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
                                <select value={classchoiced} onChange={e => handleChangeClass(e.target.value)}>
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
                                <select onChange={e => handleChangeRace(e.target.value)}>
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
                    </div>

                    <div className="row">
                        <p className="col">{stats.description}</p>
                    </div>
                    <div className="row">
                        <p className="col">You have a total of : <span className="bg-primary">{totalPoint}</span> points remaining</p>
                        <p className="col">You can't have more than <span className="bg-primary">{csRules.game_stats.max_per_cat}</span> in a characteristic</p>
                        <p className="col">You can't have less than <span className="bg-primary">{csRules.game_stats.min_per_cat}</span> in a characteristic</p>
                    </div>
                    <div className="card row">
                        {stats.stats.map((stats, idx) =>
                            <div className="col" key={idx}>
                                <div className="">
                                    <label className="text-capitalize">
                                        {stats.label}
                                        <div class="handle-counter" id="handleCounter">
                                            <button ref={minus.current[idx]} onClick={e => handleMinus(e, idx, Ref.current[idx])} className="counter-minus btn btn-primary" >-5</button>
                                            <button ref={minus.current[idx]} onClick={e => handleMinus(e, idx, Ref.current[idx])} className="counter-minus btn btn-primary" >-1</button>
                                            <input style={{ width: "7rem" }} ref={Ref.current[idx]} className="quantity" type="number" name={stats.label} autoComplete="off" value={state[stats.label]} onKeyDown={handleKeyDown} onChange={handleChangeStats.bind()} />
                                            <button ref={plus.current[idx]} onClick={e => handlePlus(e, idx, Ref.current[idx])} className="counter-plus btn btn-primary">+1</button>
                                            <button ref={plus.current[idx]} onClick={e => handlePlus(e, idx, Ref.current[idx])} className="counter-plus btn btn-primary">+5</button>
                                        </div>
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

