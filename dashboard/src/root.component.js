import React from 'react';
import { Provider } from 'react-redux';
import Dashboard from './containers/Dashboard/Dashboard';

export default class Root extends React.Component {

	state = {store: null, globalEventDistributor: null};

	componentDidCatch(error, info) {
		console.log(error, info);
	}

	setStore(store) {
		this.setState({ store: store});
	}

	setGlobalEventDistributor(globalEventDistributor) {
		this.setState({ globalEventDistributor: globalEventDistributor });
	}

	render() {
		if (this.state.store && this.state.globalEventDistributor) {
			return (
				<Provider store={this.state.store}>
					<Dashboard globalEventDistributor={this.state.globalEventDistributor}/>
				</Provider>
			)
		}
		return null;
	}
}
