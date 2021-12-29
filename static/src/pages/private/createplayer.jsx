import React, { useState, useEffect, useRef } from "react";
import Loader from "../../components/UI/loader";
import { useNavigate } from 'react-router-dom';
import statsRules from '../../data/jdrp/stats.json'
import classRules from '../../data/jdrp/classes.json'
import raceRules from '../../data/jdrp/races.json'
import csRules from '../../data/jdrp/character_creation_rules.json'
import ToasterAlert from "../../components/UI/toasterAlert";
import useApiPost from "../../components/ApiCrawler/post";


const CreatePlayer = ({ gameId }) => {

    const [state, setState] = useState({});
    const [stats] = useState(statsRules);
    const [classes] = useState(classRules);
    const [races] = useState(raceRules);
    const [loaded, setLoaded] = useState(false);
    const [classDescr, setClassDescr] = useState(false);
    const [raceDescr, setRaceDescr] = useState(false);
    const [totalPoint, setTotalPoint] = useState(csRules.game_stats.max_stat_wcl);
    const [avatarList, setAvatarList] = useState([]);
    const [avatar, setAvatar] = useState("");
    const [alignment, setAlignment] = useState("Lawful good");
    const [particularity, setParticularity] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState(null);
    const [isSubbmitted, setIsSubbmitted] = useState(false);
    const navigate = useNavigate();


    const { postData } = useApiPost();
    // const randomColor = ;
    const [color, setColor] = useState("#" + Math.floor(Math.random() * 16777215).toString(16));

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

        const a = [];
        [...Array(8)].map(_ => {
            a.push("https://via.placeholder.com/200x250")
        })

        setAvatarList(a)
        setLoaded(true);

        console.log(gameId);
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

    }, [totalPoint, classchoiced, racechoiced, step])

    const check_value = (element, i) => {

        if (element.current.value < csRules.game_stats.min_per_cat) {
            if (!element.current.classList.contains("text-error")) {
                element.current.classList.add("text-error");
            }

        } else {
            if (element.current.classList.contains("text-error")) {
                element.current.classList.remove("text-error");
            }
        }

        if (totalPoint <= 0) {
            plus.current[i].current.disabled = true;

            if (parseInt(element.current.value) - parseInt(step) < csRules.game_stats.min_per_cat) {
                minus.current[i].current.disabled = true;
            } else {
                minus.current[i].current.disabled = false;
            }
        } else {

            if (parseInt(element.current.value) + parseInt(step) > csRules.game_stats.max_per_cat) {
                plus.current[i].current.disabled = true;
            } else {
                plus.current[i].current.disabled = false;
            }

            if (parseInt(element.current.value) - parseInt(step) < csRules.game_stats.min_per_cat) {
                minus.current[i].current.disabled = true;
            } else {
                minus.current[i].current.disabled = false;
            }
        }

    }

    useEffect(async () => {

        if (isSubbmitted) {

            let control = 0;
            let err = false;

            for (let property in state) {
                control += parseInt(state[property]);
                if (parseInt(state[property]) < 10 || parseInt(state[property]) > 70) {
                    err = true;

                }
            }

            if(err){
                setIsSubbmitted(false);
                setError({ level: "error", message: "The values ​​of the characteristics must be between 10 and 70 " })
            }else if (control !== csRules.game_stats.max_stat_wcl) {
                setIsSubbmitted(false);
                setError({ level: "error", message: "The sum of all characteristics must be equal to 300" })
            }else if(totalPoint !== 0){
                setIsSubbmitted(false);
                setError({ level: "error", message: "All points have to be spent" })
            }else {

                const player_cs = JSON.stringify({
                    name: name,
                    class: classchoiced,
                    race: racechoiced,
                    particularity: particularity,
                    color: color,
                    avatar: avatar,
                    alignment, alignment,
                    strengh: parseInt(state.strengh),
                    dexterity: parseInt(state.dexterity),
                    luck: parseInt(state.luck),
                    willpower: parseInt(state.willpower),
                    endurance: parseInt(state.endurance),
                    charism: parseInt(state.charism),
                    perception: parseInt(state.perception),
                    education: parseInt(state.education),
                });

                setLoaded(false);

                const response = await postData("api/create_player", {
                    "game_id": gameId,
                    "jsoned_cs": player_cs,
                });

                setLoaded(true);

                if(!response.success){
                    const err = JSON.parse(response.error);
                    setError({ level: "error", message:  err.message + " - error code: "+ err.code})
                    setIsSubbmitted(false);
                }else {
                    if(JSON.parse(response.success) === true ){
                        setError({ level: "success", message: "Player created, you will be connect to the game in a second" })

                        const response = await postData("api/socket-address", {
                            "game_id": gameId
                        });

                        if(!response.success){
                            const err = JSON.parse(response.error);
                            setError({ level: "error", message:  err.message + " - error code: "+ err.code})
                            setIsSubbmitted(false);
                        }else {
                            console.log(response.success);
                            const to64 = btoa(response.success);
    
                            navigate({
                                pathname: `/game/${to64}`,
                                //   search: `?args=`,
                            });

                        }
                    }else {
                        setIsSubbmitted(false);

                        console.log(response.error)
                        setError({ level: "error", message: "Can't create player" })
                    }

                }

        
                // if (response.success == undefined || response.error == undefined) {
                //     setError({ level: "error", message: "Something really wrong happened" });
                // }
        
                // if (response.error) {
                //     setError({ level: "error", message: response.error });
                //     setIsSubbmitted(false);
                // } else {

        
                    // const to64 = btoa(response.success.ws_address);
        
                    // navigate({
                    //     pathname: `/game/${to64}`,
                    //     //   search: `?args=`,
                    // });
                    // SetSocketAddress(response.success.ws_address)
                // }

            }
        }

    }, [isSubbmitted])

    const handleChangeStep = val => {
        setStep(val)
    }

    const handleChangeName = e => {
        setName(e.target.value);
    }

    const handleChangeColor = e => {
        setColor(e.target.value)
    }

    const handleChangeAlignment = alignement => {
        setAlignment(alignement);
    }

    const handleChangeParticularity = p => {
        setParticularity(p);
    }

    const handleChangePortrait = e => {
        const { value } = e.target;
        setAvatar(value);
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

    const checkIfAvailablePoint = (nbPoints, plus) => {

        return plus ? (totalPoint - nbPoints < 0 ? false : true) : (totalPoint + nbPoints > csRules.game_stats.max_stat_wcl ? false : true);
    }

    const handleMinus = (e, i, ref) => {
        e.preventDefault();

        if (parseInt(ref.current.value) - parseInt(step) <= csRules.game_stats.min_per_cat) {
            ref.current.value = csRules.game_stats.min_per_cat;
        } else {
            ref.current.stepDown(step || 1);
        }

        setState(prevState => ({ ...prevState, [ref.current.name]: ref.current.value }));
    }

    const handlePlus = (e, i, ref) => {
        e.preventDefault();

        if (checkIfAvailablePoint(step, true) === false) {
            ref.current.value = parseInt(ref.current.value) + totalPoint;
        } else {

            if (parseInt(ref.current.value) + parseInt(step) >= csRules.game_stats.max_per_cat) {
                ref.current.value = csRules.game_stats.max_per_cat;
            }
            else {
                ref.current.stepUp(step || 1);
            }

        }

        setState(prevState => ({ ...prevState, [ref.current.name]: ref.current.value }));

    }

    const handleSubmit = e => {
        e.preventDefault();
        setError(null);
        setIsSubbmitted(true);
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

                <form onSubmit={handleSubmit}>
                    <div className="card">
                        <div className="row">
                            <div className="col">
                                <label>
                                    Character name :
                                    <input required type="text" autoComplete="off" onChange={handleChangeName} />
                                </label>

                                <label>
                                    Color :
                                    <input required type="color" value={color} autoComplete="off" onChange={handleChangeColor} />
                                </label>
                            </div>
                            <div className="col">
                                <label>
                                    Alignment :
                                    <select required value={alignment} onChange={e => handleChangeAlignment(e.target.value)}>
                                        <option value="Lawful good">Lawful good</option>
                                        <option value="Neutral good">Neutral good</option>
                                        <option value="Chaotic good">Chaotic good</option>
                                        <option disabled className="separator"></option>
                                        <option value="Lawful neutral">Lawful neutral</option>
                                        <option value="True neutral">True neutral </option>
                                        <option value="Chaotic neutral">Chaotic neutral</option>
                                        <option disabled className="separator"></option>
                                        <option value="Lawful evil">Lawful evil</option>
                                        <option value="Neutral evil">Neutral evil</option>
                                        <option value="Chaotic evil">Chaotic evil</option>
                                    </select>
                                </label>

                                <label>
                                    Character particularity :
                                    <input required type="text" autoComplete="off" onChange={e => handleChangeParticularity(e.target.value)} />
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col is-center"><h2>Class'n race</h2></div>
                    </div>
                    <div className="card">
                        <div className="row">

                            <div className="col">
                                <label>
                                    Class :
                                    <select required value={classchoiced} onChange={e => handleChangeClass(e.target.value)}>
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
                                    <select required onChange={e => handleChangeRace(e.target.value)}>
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
                                    <option value="20">20</option>
                                </select>
                            </label>
                        </div>
                        <div className="row">
                            {stats.stats.map((stats, idx) =>
                                <div className="col" key={idx}>
                                    <div className="">
                                        <label className="text-capitalize">
                                            {stats.label}
                                            <div className="handle-counter" id="handleCounter">
                                                <button ref={minus.current[idx]} onClick={e => handleMinus(e, idx, Ref.current[idx])} className="counter-minus btn btn-primary" >-{step}</button>
                                                <input required style={{ fontWeight: "bold", width: "7rem" }} ref={Ref.current[idx]} className="quantity" type="number" name={stats.label} autoComplete="off" value={state[stats.label]} onKeyDown={handleKeyDown} onChange={handleChangeStats.bind()} />
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

                    <div className="row">
                        <div className="col is-center"><h2>Avatar</h2></div>
                    </div>

                    <div className="row">
                        <p className="col">It will be displayed in the current game.</p>
                    </div>
                    {/* 
                    TODO: Work with the avatar and maybe an upload function
                    */}

                    <div className="card">
                        <div className="row">
                            {avatarList.map((url, idx) =>
                                <div className="col-3 imgcheckboxed">
                                    <label >
                                        <input required key={idx} type="radio" name="portrait" value={`portrait${idx}`} onChange={handleChangePortrait} />
                                        <img src={url} className="is-center" alt="" />
                                    </label>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="row">
                        <div className="col">
                            <input className="pull-right" type="submit" value="Submit" />
                        </div>
                    </div>
                </form>
            </div>
            {error &&
                <ToasterAlert level={error.level} message={error.message} />
            }

        </>
    )
}

export default CreatePlayer;

