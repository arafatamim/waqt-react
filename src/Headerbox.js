import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Headerbox.scss';

function Headerbox() {
    return (
        <div id="headerBox">
            <div id="headerText">Waqt</div>
            <FontAwesomeIcon id="headerSettings" className="iconButton" icon="cog" />
        </div>
    );
}

export default Headerbox;
