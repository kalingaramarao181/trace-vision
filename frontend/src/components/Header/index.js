import "./index.css"
import Cookies from "js-cookie";
import { useState } from "react";
import { withRouter, Link } from "react-router-dom/cjs/react-router-dom.min";

const Header = (props) => {
    const [isOpenDropdown, setIsOpenDropdown] = useState(false)
    const lock = Cookies.get("lock")
    const currentPath = window.location.pathname;
    console.log(currentPath);

    const onClickLogout = () => {
        Cookies.remove("lock")
        props.history.replace("/")
    }

    return (
        <div className="navbar-container">
            <Link to="/">
                <img className="navbar-logo" src="\images\trace-vision.png" alt="App Logo"/>
            </Link>
                {lock !== undefined ? currentPath === "/" ? <Link to="/admin"><button type="button" className="navbar-login-button">Login</button></Link> :
                    <button  onClick={onClickLogout} type="button" className="navbar-login-button">Logout</button>: 
                <Link to="/login"><button type="button" className="navbar-login-button">Login</button></Link>}
        </div>
    )
}

export default withRouter(Header)