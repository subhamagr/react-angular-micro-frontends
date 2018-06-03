import React from 'react';

import GridLayout from './GridLayout';
import { Page } from '../../components/CommonStyles';


const App = ({ classes = {}, globalEventDistributor }) => (
  <Page>
    <div className={classes.toolbar} />
    <GridLayout globalEventDistributor={globalEventDistributor} />
    <dashboard-form id="dashboard-form"></dashboard-form>
  </Page>
);

export default App;
