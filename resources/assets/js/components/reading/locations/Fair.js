import React, { Component } from 'react';

export default class Fair extends Component {

    isAvailable = (location) => {
        if (this.props.progress.availableLocations == null) {
            return "n/a";
        }

        return this.props.progress.availableLocations.includes(location) ? "available" : "n/a";
    }

    render() {
        return (
            <div className="card">
                <div className="card-header">Fair location</div>

                <div className="card-body">
                    <ul>
                        <li onClick={() => this.props.handleMove('map')}>Map ({this.isAvailable('map')})</li>
                    </ul>

                </div>
            </div>
        )
    }
}