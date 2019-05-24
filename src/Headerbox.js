import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Headerbox.scss';

export default class Headerbox extends React.Component {
    render() {
        return (
            <div id="headerBox">
                <div id="headerText">Waqt</div>
                <FontAwesomeIcon
                    id="headerSettings"
                    className="iconButton"
                    icon="cog"
                    onClick={this.props.toggleDialog}
                />
            </div>
        );
    }
}
