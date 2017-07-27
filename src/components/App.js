import React from 'react';
import Header from './Header';
import Order from './Order';
import Inventory from './Inventory';
import Fish from './Fish';
import sampleFishes from '../sample-fishes';
import base from '../base';

class App extends React.Component {

	constructor() {
		super();

		// set initial state
		this.state = {
			fishes: {},
			order: {}
		};

		this.addFish = this.addFish.bind(this);
		this.loadSamples = this.loadSamples.bind(this);
		this.addToOrder = this.addToOrder.bind(this);
		this.removeFromOrder = this.removeFromOrder.bind(this);
		this.updateFish = this.updateFish.bind(this);
		this.removeFish = this.removeFish.bind(this);
	}

	// sync with Firebase
	componentWillMount() {
		this.ref = base.syncState(`${this.props.params.storeId}/fishes`, {
			context: this,
			state: 'fishes'
		});

		// check localStorage for orders
		const localStorageRef = localStorage.getItem(`order-${this.props.params.storeId}`);
		if(localStorageRef) {
			this.setState({
				order: JSON.parse(localStorageRef)
			});
		}
	}

	// remove listeners if storeId changes
	componentWillUnmount() {
		base.removeBinding(this.ref);
	}

	componentWillUpdate(nextProps, nextState) {
		// sync orders with LocalStorage
		localStorage.setItem(`order-${this.props.params.storeId}`, JSON.stringify(nextState.order));
	}

	addFish(fish) {
        // copy the current state
		const fishes = {...this.state.fishes};
		// add new fish
		const timestamp = Date.now();
		fishes[`fish-${timestamp}`] = fish;
		// set state
		this.setState({ fishes });
	}

	updateFish(key, updatedFish) {
		const fishes = {...this.state.fishes};
		fishes[key] = updatedFish;
		this.setState({ fishes });
	}

	removeFish(key) {
		const fishes = {...this.state.fishes};
		fishes[key] = null; // because Firebase ;)
		this.setState({ fishes });
	}

	loadSamples() {
		this.setState({
			fishes: sampleFishes
		});
	}

	addToOrder(key) {
		const order = {...this.state.order};
		order[key] = order[key] + 1 || 1;
		this.setState({ order });
	}

	removeFromOrder(key) {
		const order = {...this.state.order};
		delete order[key]; // not Firebase ;)
		this.setState({ order });
	}

	render() {
		return (
			<div className="catch-of-the-day">
                <div className="menu">
                    <Header tagline="Fresh Seafood Market"/>
                    <ul className="list-of-fishes">
                      {
                      	Object
                      	  .keys(this.state.fishes)
                      	  .map(key => <Fish key={key}
                      	  	                index={key}
                      	  	                details={this.state.fishes[key]}
                      	  	                addToOrder={this.addToOrder} />)
                      }
                    </ul>
                </div>
                <Order fishes={this.state.fishes}
                       order={this.state.order}
                       params={this.props.params}
                       removeFromOrder={this.removeFromOrder}
                />
                <Inventory addFish={this.addFish}
                           loadSamples={this.loadSamples}
                           fishes={this.state.fishes}
                           updateFish={this.updateFish}
                           removeFish={this.removeFish}
                />
			</div>
		)
	}
}

App.propTypes = {
	params: React.PropTypes.object.isRequired
}

export default App;