import React from 'react';
import AddFishForm from './AddFishForm';
import base from '../base';

class Inventory extends React.Component {

	constructor() {
		super();
		this.handleChange = this.handleChange.bind(this);
		this.renderInventory = this.renderInventory.bind(this);
		this.renderLogin = this.renderLogin.bind(this);
		this.authenticate = this.authenticate.bind(this);
		this.authHandler = this.authHandler.bind(this);
		this.logout = this.logout.bind(this);
		this.state = {
			uid: null,
			owner: null
		}
	}

	componentDidMount() {
		// keep user from needing to login again on page refresh
		base.onAuth((user) => {
			if(user) {
				this.authHandler(null, { user });
			}
		});
	}

	handleChange(event, key) {
		const fish = this.props.fishes[key];
		const updatedFish = {
			...fish,
			[event.target.name]: event.target.value
		}
		this.props.updateFish(key, updatedFish);
	}

	authenticate(provider) {
		console.log(`Trying to log in with ${provider}`);
		base.authWithOAuthPopup(provider, this.authHandler);
	}

	logout() {
		base.unauth();
		this.setState({
			uid: null
		});
	}

	authHandler(err, authData) {
		if(err) {
			console.error(err);
			return;
		}
		// get store info
		const storeRef = base.database().ref(this.props.storeId);

		// query Firebase once for store data
		storeRef.once('value', (snapshot) => {
			const data = snapshot.val() || {};

			// if store has no owner, claim it for user
			if(!data.owner) {
				storeRef.set({
					owner: authData.user.uid
				});
			}

			this.setState({
				uid: authData.user.uid,
				owner: data.owner || authData.user.uid
			});
		});
	}

	renderLogin() {
		return (
		  <nav className="login">
		    <h2>Inventory</h2>
		    <p>Sign in to manage your store's inventory</p>
		    <button className="google" onClick={() => this.authenticate('google')} >Log in with Google</button>
		    <button className="github" onClick={() => this.authenticate('github')} >Log In with Github</button>
		    <button className="facebook" onClick={() => this.authenticate('facebook')} >Log In with Facebook</button>
		    <button className="twitter" onClick={() => this.authenticate('twitter')} >Log In with Twitter</button>
		  </nav>
		)
	}

	renderInventory(key) {
		const fish = this.props.fishes[key];
		return (
			<div className="fish-edit" key={key}>
			  <input type="text" name="name" value={fish.name} placeholder="Fish Name" onChange={ (e) => this.handleChange(e, key) }/>
			  <input type="text" name="price" value={fish.price} placeholder="Fish Price" onChange={ (e) => this.handleChange(e, key) }/>
			  <select name="status" value={fish.status} placeholder="Fish Status" onChange={ (e) => this.handleChange(e, key) }>
			    <option value="available">Fresh!</option>
		        <option value="unavailable">Sold Out!</option>
			  </select>
			  <textarea name="desc" value={fish.desc} placeholder="Fish Desc" onChange={ (e) => this.handleChange(e, key) }></textarea>
			  <input type="text" name="image" value={fish.image} placeholder="Fish Image" onChange={ (e) => this.handleChange(e, key) }/>
			  <button onClick={ () => this.props.removeFish(key) }>Remove Fish</button>
			</div>
		)
	}

	render() {
		const logout = <button onClick={() => this.logout()}>Log Out</button>
		// not logged in at all
		if(!this.state.uid) {
			return <div>{this.renderLogin()}</div>
		}
		// check if user is owner of current store
		if(this.state.uid !== this.state.owner) {
			return (
				<div>
				  <p>Sorry, you are not the owner of the current store!!!</p>
				  {logout}
				</div>
			)
		}
		//
		return (
		    <div>
			    <h2>Inventory</h2>
			    {logout}
			    <AddFishForm addFish={this.props.addFish} />
			    <button onClick={this.props.loadSamples}>Load Sample Fish</button>
			    {Object.keys(this.props.fishes).map(this.renderInventory)}
		    </div>
		)
	}
}

Inventory.propTypes = {
	fishes:      React.PropTypes.object.isRequired,
	updateFish:  React.PropTypes.func.isRequired,
	addFish:     React.PropTypes.func.isRequired,
	removeFish:  React.PropTypes.func.isRequired,
	loadSamples: React.PropTypes.func.isRequired,
	storeId:     React.PropTypes.string.isRequired
}

export default Inventory;