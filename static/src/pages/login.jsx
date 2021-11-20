const About = () => {

    return (
        <>
        <br />
        <div className="container">
            <div className="row is-center">
                <div className="card is-center">
                    <div className="col6">
                        <label htmlFor="login">Login</label>
                        <input id="login" type="text" />
                        <label htmlFor="pass">Password</label>
                        <input type="password" />
                        <br />
                        <button className="button primary pull-right">Login</button>
                    </div>

                </div>
            </div>
        </div>
        </>
    )
}

export default About