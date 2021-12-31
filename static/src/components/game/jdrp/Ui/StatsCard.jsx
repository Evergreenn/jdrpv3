import React from "react";

const StatsCard = ({ label, stat, description }) => {

    return (
        <div className="card cs">
            <span className="pull-right ">{stat}</span>
            <details>
                <summary className="text-capitalize">
                    {label} 
                </summary>
                <p className="text-dark">{description}</p>
            </details>
            
        </div>
    )
}

export default StatsCard;