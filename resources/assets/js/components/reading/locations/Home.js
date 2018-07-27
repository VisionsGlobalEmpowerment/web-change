import React, { Component } from 'react';
import axios from 'axios';

export default class Home extends Component {

    activities = [{
        key: 'lesson-one-instructions',
        name: 'Lesson one instructions',
    }];

    isAvailable = (location) => {
        if (this.props.progress.availableLocations == null) {
            return "n/a";
        }

        return this.props.progress.availableLocations.includes(location) ? "available" : "n/a";
    }

    finishActivity(activity) {
        return axios.post(`/courses/reading/activities/` + activity + '/finish')
            .then(res => {
                const progress = res.data;
                this.props.handleProgress(progress);
            })
    }

    render() {
        return (
            <div className="card">
                <div className="card-header">Home location</div>

                <div className="card-body">
                    <ul>
                        <li onClick={() => this.props.handleMove('map')}>Map ({this.isAvailable('map')})</li>
                    </ul>
                    <ul>
                        {this.activities.map(activity =>
                            <li
                                key={activity.key}
                                onClick={() => this.finishActivity(activity.key)}
                                className={'activity-' + activity.key}
                            >{activity.name}</li>
                        )}
                    </ul>
                </div>
            </div>
        )
    }
}