// Copyright 2018 Superblocks AB
//
// This file is part of Superblocks Lab.
//
// Superblocks Lab is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation version 3 of the License.
//
// Superblocks Lab is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Superblocks Lab.  If not, see <http://www.gnu.org/licenses/>.

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ToastContainer from "../toasts/toastcontainer";
import ModalContainer from '../common/modal/modalContainer';
import Loadable from 'react-loadable';
import { EmptyLoading, Loading } from "../common";

const Dashboard = Loadable({
    loader: () => import(/* webpackChunkName: "Dashboard" */"../dashboard"),
    loading: EmptyLoading,
});

const ProjectDashboard = Loadable({
    loader: () => import(/* webpackChunkName: "ProjectDashboard" */"../project/ProjectDashboard"),
    loading: EmptyLoading,
});

const ProjectSettings = Loadable({
    loader: () => import(/* webpackChunkName: "ProjectSettings" */"../project/settings/ProjectSettings"),
    loading: EmptyLoading,
});

const ProjectBuilds = Loadable({
    loader: () => import(/* webpackChunkName: "ProjectBuild" */"../project/builds/ProjectBuilds"),
    loading: EmptyLoading,
});

export default class App extends Component {

    componentDidMount() {
        const { notifyAppStart }  = this.props;

        // Make sure we fire this event in order to let other parst of the app configure depending
        // on the initial state (per example turning on/off analytics)
        notifyAppStart();
    }

    render() {
        return (
            <Router>
                <div id="app">
                    <div id="app_content">
                        <div className="maincontent">
                            <Switch>
                                <Route path="/" exact render={(props) => <Dashboard {...props} functions={this.functions} />} />
                                <Route path="/dashboard" exact render={(props) => <Dashboard {...props} functions={this.functions} />} />
                                <Route exact path="/dashboard/project/:projectId" render={(props) => (
                                    <ProjectDashboard content={<ProjectBuilds />} {...props} />
                                )} />
                                <Route exact path="/dashboard/project/:projectId/builds" render={(props) => (
                                    <ProjectDashboard content={<ProjectBuilds />} {...props} />
                                )} />
                                <Route exact path="/dashboard/project/:projectId/settings" render={(props) => (
                                    <ProjectDashboard content={<ProjectSettings />} {...props} />
                                )} />
                            </Switch>
                        </div>
                    </div>
                    <ToastContainer />
                    <ModalContainer />
                </div>
            </Router>
        );
    }
}

App.propTypes = {
    appVersion: PropTypes.string.isRequired,
    notifyAppStart: PropTypes.func.isRequired
}
