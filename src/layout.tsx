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
    const style_container={
        width:window.innerWidth
    }

    return (<div className="container" style={style_container}>
        <Router>
            <Route path="/:localId" exact>
                <Header/>
                <ContentsBody />
                <Footer/>
            </Route>
        </Router>
        </div>)
}

export default Layout