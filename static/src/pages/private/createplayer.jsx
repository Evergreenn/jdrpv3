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
    const [races, setRaces] = useState(raceRules);
    const [loaded, setLoaded] = useState(false);
    const [classDescr, setClassDescr] = useState(false);
    const [raceDescr, setRaceDescr] = useState(false);
    const [totalPoint, setTotalPoint] = useState(csRules.game_stats.max_stat_wcl);

    const [classchoiced, setClassChoiced] = useState("warrior");
    const [racechoiced, setRaceChoices] = useState("human");

    const [step, setStep] = useState(1);

    const plus = useRef([]);
    const minus = useRef([]);
    const Ref = useRef([]);
    Ref.current = stats.stats.map((_, i) => Ref.current[i] ?? React.createRef());
    plus.current = stats.stats.map((_, i) => plus.current[i] ?? React.createRef());
    minus.current = stats.stats.map((_, i) => minus.current[i] ?? React.createRef());

    useEffect(() => {
        stats.stats.forEach(element => {
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

        Object.entries(t).forEach(([_, val]) => {
            sum += val;
        });

        setTotalPoint(prevTotalPoint => (prevTotalPoint - sum));
    }, [classchoiced, racechoiced]);


    useEffect(() => {

        if (loaded == true) {

            setTotalPoint(() => {
                let sum = 0;

                Object.entries(state).forEach(([_, val]) => {
                    sum += parseInt(val);
                });

                const tot = csRules.game_stats.max_stat_wcl - sum;

                if (tot < 0) {
                    return 0;
                } else {
                    return tot;
                }
            });
        }

    }, [state])

    useEffect(() => {

        if (loaded == true) {
            Ref.current.forEach((element, idx) => {
                check_value(element, idx)
            })
        }

    }, [totalPoint, classchoiced, racechoiced])

    const check_value = (element, i) => {

        if (totalPoint <= 0) {
            plus.current[i].current.disabled = true;
        } else {
            if (element.current.value <= csRules.game_stats.min_per_cat) {
                minus.current[i].current.disabled = true;
            }

            if (element.current.value >= csRules.game_stats.max_per_cat) {
                plus.current[i].current.disabled = true;
            }

            if (element.current.value < csRules.game_stats.max_per_cat) {
                plus.current[i].current.disabled = false;
            }

            if (element.current.value > csRules.game_stats.min_per_cat) {
                minus.current[i].current.disabled = false;
            }
        }

        if(element.current.value < csRules.game_stats.min_per_cat){
            if(!element.current.classList.contains("text-error")){
                element.current.classList.add("text-error");
            }
           
        }else {
            if(element.current.classList.contains("text-error")){
                element.current.classList.remove("text-error");
            }
        }


    }

    const handleChangeStep = val => {
        setStep(val)
    }

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
        setState(prevState => ({ ...prevState, [name]: value }));
    }

    const handleKeyDown = (e) => {
        e.preventDefault();
    }

    const handleMinus = (e, i, ref) => {
        e.preventDefault();

        if (parseInt(ref.current.value) - parseInt(step) < csRules.game_stats.min_per_cat) {
            ref.current.value = csRules.game_stats.min_per_cat;
        } else {
            ref.current.stepDown(step || 1);
        }

        setState(prevState => ({ ...prevState, [ref.current.name]: ref.current.value }));
    }

    const handlePlus = (e, i, ref) => {
        e.preventDefault();

        if (parseInt(ref.current.value) + parseInt(step) > csRules.game_stats.max_per_cat) {
            ref.current.value = csRules.game_stats.max_per_cat;
        } else {
            ref.current.stepUp(step || 1);
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
                        <p className="col">You have a total of : <span style={{ padding: ".3em .4em", fontSize: "27px" }} className="bg-primary">{totalPoint}</span> points remaining</p>
                        <p className="col">You can't have more than <span style={{ padding: ".3em .4em", fontSize: "27px" }} className="bg-primary">{csRules.game_stats.max_per_cat}</span> in a characteristic</p>
                        <p className="col">You can't have less than <span style={{ padding: ".3em .4em", fontSize: "27px" }} className="bg-primary">{csRules.game_stats.min_per_cat}</span> in a characteristic</p>
                    </div>

                    <div className="card">
                        <div className="row">
                            <label>
                                Step :
                                <select onChange={e => handleChangeStep(e.target.value)}>
                                    <option value="1">1</option>
                                    <option value="5">5</option>
                                </select>
                            </label>
                        </div>
                        <div className="row">
                            {stats.stats.map((stats, idx) =>
                                <div className="col" key={idx}>
                                    <div className="">
                                        <label className="text-capitalize">
                                            {stats.label}
                                            <div class="handle-counter" id="handleCounter">
                                                <button ref={minus.current[idx]} onClick={e => handleMinus(e, idx, Ref.current[idx])} className="counter-minus btn btn-primary" >-{step}</button>
                                                <input style={{fontWeight: "bold", width: "7rem" }} ref={Ref.current[idx]} className="quantity" type="number" name={stats.label} autoComplete="off" value={state[stats.label]} onKeyDown={handleKeyDown} onChange={handleChangeStats.bind()} />
                                                <button ref={plus.current[idx]} onClick={e => handlePlus(e, idx, Ref.current[idx])} className="counter-plus btn btn-primary">+{step}</button>
                                            </div>
                                            <p className="small">{stats.description}</p>
                                            <p className="small">Best for: {stats.mandatory}</p>
                                        </label>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </>
    )
}

export default CreatePlayer;
