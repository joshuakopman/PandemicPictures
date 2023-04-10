import React, { useEffect, useState } from 'react';
import Counts from './components/Counts';
import StickyCounts from './components/StickyCounts.js';

function Header({ moviesResponse }) {
    const [scroll, setScroll] = useState(false);
    const topOffset = window.pageYOffset;
    useEffect(() => {
        window.addEventListener("scroll", () => {
            setScroll(window.scrollY > topOffset);
        });
    }, []);

    return (
        <header id="header" className={scroll ? "sticky" : ""}>
            <h1 id="title"><a href="#">Pandemic Pictures</a></h1>

            <div className="totals-container">
                <div className="ribbon-container">
                    <div className="ribbon">
                        <div className="ribbon-content">
                            <p><b>Oscars Best Picture Nominees</b></p>
                        </div>
                    </div>
                </div>
                <Counts moviesResponse={moviesResponse}></Counts>
            </div>

            <StickyCounts moviesResponse={moviesResponse}></StickyCounts>

            <div className="button-container">
                <a className="picker" id="moviePickerButton">Pick a Movie</a>
            </div>

            <div className="year-anchors">
                <span className="year-jump">Jump to decade:</span>
                <a href="#1929">30s</a> &bull;
                <a href="#1940">40s</a> &bull;
                <a href="#1950">50s</a> &bull;
                <a href="#1960">60s</a> &bull;
                <a href="#1970">70s</a> &bull;
                <a href="#1980">80s</a> &bull;
                <a href="#1990">90s</a> &bull;
                <a href="#2000">00s</a> &bull;
                <a href="#2010">10s</a> &bull;
                <a href="#2020">20s</a>
            </div>

            <div id="filtersNav">
                <div id="filterChevron" className="chevron">Filters &nbsp;</div>
            </div>

            <filters></filters>
        </header>
    )
};
export default Header;
