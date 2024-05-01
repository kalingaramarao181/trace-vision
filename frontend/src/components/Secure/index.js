import React from 'react'
import Cookies from 'js-cookie'
import { Redirect, Route } from 'react-router-dom/cjs/react-router-dom.min'

const Secure = (props) => {
    const lock = Cookies.get("lock")
    if (lock === undefined) {
        return <Redirect to="/login" />
    }
    return (
        <Route {...props} />
    )
}

export default Secure