import "./index.css"
import Cookies from "js-cookie";
import { withRouter, Link } from "react-router-dom/cjs/react-router-dom.min";

const Header = (props) => {
    const lock = Cookies.get("lock")

    const onClickLogout = () => {
        Cookies.remove("lock")
        props.history.replace("/")
    }

    return (
        <div className="navbar-container">
            <Link to="/">
                <img className="navbar-logo" src="\images\trace-vision.png" alt="App Logo"/>
            </Link>
            {lock !== undefined ? <button type="button" onClick={onClickLogout} className="navbar-login-button">Logout</button>: 
            <Link to="/login"><button type="button" className="navbar-login-button">Login</button></Link>}
        </div>
    )
}

export default withRouter(Header)