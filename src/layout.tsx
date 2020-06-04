import React, { useState, useEffect } from 'react'
import firebase, { firestore } from 'firebase'
import '../node_modules/react-vis/dist/style.css';
import './scss/main.scss'
import {Header} from './header'
import {Footer} from './footer'
import {BrowserRouter as Router, Route} from 'react-router-dom'
import queryString from 'query-string'
import {ContentsBody} from './contentsbody'

const Layout : React.FC = () => {
    return (<div className="container">
        <Router>
            <Route path="/:localId" exact>
                <div/><Header/><div/>      
                {/* <div/><div className="contentsBody">test</div><div/>     */}
                <div/><ContentsBody/><div/>    
                <div/><Footer/><div/>
            </Route>
        </Router>
        </div>)
}

export default Layout