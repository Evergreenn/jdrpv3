import React, { useState, useEffect, useRef } from "react";

const DiceRoll = ({ stat }) => {

    const [statToRoll, setStatToRoll] = useState(stat);
    const [rollResult, setRollResult] = useState(null);
    const rollRef = useRef(null);

    useEffect(() => {
        setStatToRoll(stat);
    }, [])

    useEffect(() => {
        setRollResult(rollResult);
    }, [rollResult])


    const handleClick = e => {
        e.preventDefault();

        const roll = Math.floor(Math.random() * (101 - 1) + 1);
        setRollResult(roll);

        rollRef.current.disabled = true;

        window.setTimeout(() => {
            setRollResult(null);
            rollRef.current.disabled = false;
        }, 3000);

    }

    return (
        <>
            <div className="row">
                <div className="col">
                    <button className="button outline" ref={rollRef} onClick={handleClick}> Roll</button>
                    <span >

                        {rollResult &&
                            <>
                                {rollResult > statToRoll ?
                                    <>
                                        {rollResult === 100 ?
                                            <>
                                                <span className="pull-right text-error" >{rollResult}</span> <span className="text-error">ECHEC CRITIQUE</span>
                                            </>
                                            :
                                            <span className="pull-right text-error" >{rollResult}</span>
                                        }

                                    </>
                                    :
                                    <>
                                        {rollResult === 1 ?
                                            <>
                                                <span className="pull-right text-success" >{rollResult}</span> <span className="text-success">SUCCES CRITIQUE</span>
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