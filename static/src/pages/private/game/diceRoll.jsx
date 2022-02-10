import React, { useState, useEffect, useRef } from "react";

const DiceRoll = ({playerId, onHandleRolls, stat, isAdmin  }) => {

    const [statToRoll, setStatToRoll] = useState(stat);
    const [rollResult, setRollResult] = useState(null);
    const rollRef = useRef(null);
    const [isAdminInternal, setIsAdminInternal] = useState(false);
    const [throughWs, setThroughWS] = useState(true);
    const [playerIdInternal, setPlayerIdInternal] = useState(playerId);

    const ad = playerId;

    console.log(ad, playerId)

    useEffect(() => {
        setStatToRoll(stat);
        // setIsAdminInternal(isAdmin);
        // setPlayerIdInternal(playerId);
    }, [stat])


    useEffect(() => {
        // setStatToRoll(stat);
        setIsAdminInternal(isAdmin);
        // setPlayerIdInternal(playerId);
    }, [isAdmin])


    useEffect(() => {
        setStatToRoll(stat);
        setRollResult(rollResult);
    }, [rollResult])


    const handleChangeRolePrivacy = e => {

        setThroughWS(!e.target.checked)
    }

    const handleClick = e => {
        e.preventDefault();

        if(throughWs) {
            console.log("public", ad)

            handleRolls(ad, statToRoll)
        }else {
            console.log("private")

            const roll = Math.floor(Math.random() * (101 - 1) + 1);
            setRollResult(roll);
        }

        rollRef.current.disabled = true;

        window.setTimeout(() => {
            setRollResult(null);
            rollRef.current.disabled = false;
        }, 3000);

    }

    const handleRolls = (player_id, stat_rolled) => {
        onHandleRolls(player_id, stat_rolled)
    }

    return (
        <>
            <div className="row">
                <div className="col">
                    {isAdmin &&
                      <label>
                      Private Roll
                      <span class="switch pull-right">
                          <input type="checkbox" name="Automated_combat_calculator" onChange={handleChangeRolePrivacy} />
                          <span class="slider round"></span>
                      </span>
                  </label>
                    }
          
                    <button className="button outline" ref={rollRef} onClick={handleClick}> Roll</button>
                    <span >

                        {rollResult &&
                            <>
                                {rollResult > statToRoll ?
                                    <>
                                        {rollResult === 100 ?
                                            <>
                                                <span className="pull-right text-error" >{rollResult}</span> <span className="text-error">CRITICAL MISS !</span>
                                            </>
                                            :
                                            <span className="pull-right text-error" >{rollResult}</span>
                                        }

                                    </>
                                    :
                                    <>
                                        {rollResult === 1 ?
                                            <>
                                                <span className="pull-right text-success" >{rollResult}</span> <span className="text-success">CRITICAL HIT !</span>
                                            </>
                                            :
                                            <span className="pull-right text-success" >{rollResult}</span>
                                        }


                                    </>
                                }
                            </>
                        }
                    </span>
                </div>
            </div>
        </>
    )
}

export default DiceRoll;