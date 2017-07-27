import React from 'react';
import AddFishForm from './AddFishForm';

class Inventory extends React.Component {

	constructor() {
		super();
		this.handleChange = this.handleChange.bind(this);
		this.renderInventory = this.renderInventory.bind(this);
	}

	handleChange(event, key) {
		const fish = this.props.fishes[key];
		const updatedFish = {
			...fish,
			[event.target.name]: event.target.value
		}
		this.props.updateFish(key, updatedFish);
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
		return (
		    <div>
			    <h2>Inventory</h2>
			    <AddFishForm addFish={this.props.addFish} />
			    <button onClick={this.props.loadSamples}>Load Sample Fish</button>
			    {Object.keys(this.props.fishes).map(this.renderInventory)}
		    </div>
		)
	}
}

export default Inventory;