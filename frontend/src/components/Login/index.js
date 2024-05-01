import React, { useState } from "react";
import "./index.css";
import axios from "axios";
import Cookies from "js-cookie";
import config from "../config";
const baseUrl = config.baseUrl

const Login = (props) => {
    //PROPS HISTORY IS USED TO RENDRING SPECIFIC PATH
    const { history } = props;

    const [data, setData] = useState({
        username: "",
        password: "",
    });
    const { username, password } = data;
    const datachangehandler = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };
    const submithandler = (e) => {
        e.preventDefault();
        axios.post(`${baseUrl}login`, { ...data }).then((res) => {
            if (res.data === true) {
                history.push("/admin");
                //  COOKIES ARE USED TO  LOGIN AND LOGOUT PURPOSE FIRST SET (CREATE) COOKIES AND NEXT CODE IS HEADER.JS
                Cookies.set("lock", `${data.username}`, { expires: 30 });
            } else {
                alert("wrong password or username");    
            }
        });
        setData({ username: "", password: "" });
    };

    return (
        <div class="home-container">
            <div class="login-background-img-full">
                <div class="login-background-img">
                    <form onSubmit={submithandler} class="login-card">
                        <h1 class="login-heading">E2E Tracking Services</h1>
                        <label class="login-lable">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={username}
                            placeholder="Enter Your UserName"
                            class="login-input"
                            onChange={datachangehandler}
                            required
                        />
                        <label class="login-lable">Password</label>
                        <input
                            type="password"
                            placeholder="Enter Your Password"
                            name="password"
                            value={password}
                            class="login-input"
                            onChange={datachangehandler}
                            required
                        />
                        <button type="submit" class="login-button">
                            Login
                        </button>
                    </form>
                    <img
                        src="images\cybersecurity-icon-img-1.png"
                        alt="loginimage"
                        class="login-lockpage-image"
                    />
                </div>
            </div>
        </div>
    );
};

export default Login
