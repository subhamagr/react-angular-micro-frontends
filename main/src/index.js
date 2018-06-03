import 'zone.js';
import * as singleSpa from 'single-spa'; // waiting for this to be merged: https://github.com/CanopyTax/single-spa/pull/156
import { GlobalEventDistributor } from './globalEventDistributor'
import { loadApp } from './helper';

async function init() {
    const globalEventDistributor = new GlobalEventDistributor();
    loadApp('navigation', '', '/navigation/singleSpaEntry.js', null, '#navigation', null);
    loadApp('dashboard', '', '/dashboard/singleSpaEntry.js', '/dashboard/store.js', '#main-content', globalEventDistributor);
    singleSpa.start();
}

init();

