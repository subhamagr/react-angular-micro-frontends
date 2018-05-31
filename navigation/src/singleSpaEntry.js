import React from 'react';
import ReactDOM from 'react-dom';
import singleSpaReact from 'single-spa-react';
import Root from './root.component.js';


let targetSelector = null;

const reactLifecycles = singleSpaReact({
	React,
	ReactDOM,
	rootComponent: Root,
	domElementGetter: () => document.querySelector(targetSelector),
});

export function bootstrap(props) {
	return reactLifecycles.bootstrap(props);
}

export function mount(props) {
	domElementGetter(props.customProps.DOMSelector);
	return reactLifecycles.mount(props);
}

export function unmount(props) {
	return reactLifecycles.unmount(props);
}

function domElementGetter(DOMSelector) {
	// Make sure there is a div for us to render into
	let el = document.querySelector(DOMSelector);
	if (!el) {
		el = document.createElement('div');
		el.id = 'navigation';
		document.body.appendChild(el);
	}

	targetSelector = DOMSelector || '#navigation';

	return el;
}
