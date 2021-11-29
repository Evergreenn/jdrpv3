import React, {useState} from "react";
import { useNavigate } from "react-router-dom";


export default function Lobby({ authenticated }){

    const [gameaddress, SetGameAddress] = useState("");
    const [error, SetError] = useState("");
    const navigate = useNavigate();


    const handleChangeName = e => {
        e.preventDefault();
        SetGameAddress(e.target.value);

    }

    const handleSubmit = e => {
        e.preventDefault();

        // const to64 = btoa(response.success.ws_address);
    
        navigate({
          pathname: `/game/${gameaddress}`,
        //   search: `?args=`,
        });
    }

    return (
        <>{authenticated &&
            <div className="container">
                <div className="row">
                    <div className="col is-center"><h1>Join a game</h1></div>
                </div>
                <div className="container">
                    <div className="is-center row">
                        <form onSubmit={handleSubmit} autoComplete="off">
                            <label>
                                Game name :
                                <input type="text" autoComplete="off" value={gameaddress} onChange={handleChangeName} /> </label>
                            <input className="pull-right" type="submit" value="Submit" />
                        </form>
                    </div>
                    <div className="is-center row">
                        <p className="text-error">{error}</p>
                    </div>
                </div>
            </div>
        }
    </>
    )

}