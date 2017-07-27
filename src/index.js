// let's go!
import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Match, Miss } from 'react-router';

import App from './components/App';
import StorePicker from './components/StorePicker';
import notFound from './components/notFound';

import './css/style.css';


const Root = () => {
	return (
		<BrowserRouter>
		  <div>
			  <Match exactly pattern="/" component={StorePicker}/>
			  <Match pattern="/store/:storeId" component={App}/>
			  <Miss component={notFound}/>
		  </div>
		</BrowserRouter>
	)
}

render(<Root/>, document.querySelector('#main'));