import React, { useEffect, useState, Suspense } from "react";
import map from "../../../../data/jdrp/imgs/Tds4.jpg";
import Loader from "../../../UI/loader";

const Maps = ({ type }) => {

    const defaultMap = useState(map);

    return (
        <div className="container card">
            <div className="col">
                <Suspense fallback={<Loader />}>
                    <img src={defaultMap[0]} alt="" />
                </Suspense>
            </div>
        </div>
    )

}

export default Maps