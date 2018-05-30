import 'zone.js';
import * as singleSpa from 'single-spa'; // waiting for this to be merged: https://github.com/CanopyTax/single-spa/pull/156
import { GlobalEventDistributor } from './globalEventDistributor'

async function init() {
    const globalEventDistributor = new GlobalEventDistributor();
    
    singleSpa.start();
}

init();

