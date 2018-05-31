import React from 'react';
import { Router } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory'
import Layout from './containers/Layout/Layout';

const history = createBrowserHistory();

export default class Root extends React.Component {

	componentDidCatch(error, info) {
		console.log(error, info);
	}

	render() {
		return (
			<Router history={history}>
				<Layout />
			</Router>
		)
	}
}
