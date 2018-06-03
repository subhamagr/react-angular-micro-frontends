import noop from 'lodash/noop';
import { Action, createStore, Store, combineReducers } from 'redux';

export interface IAppState {
	show: boolean,
	editing: any,
	onSave: Function
}

export const INITIAL_STATE: IAppState = {
	show: false,
	editing: null,
	onSave: noop
};

export interface ShowDialogAction {
	type: string,
	payload: boolean,
	editing: any,
	onSave: Function
}

export class FormStateActions {
	static SHOW_GRAPH_FORM_DIALOG = 'SHOW_GRAPH_FORM_DIALOG';

	showGraphDialog(payload, editing = null, onSave = noop): ShowDialogAction {
		return { type: FormStateActions.SHOW_GRAPH_FORM_DIALOG, payload, editing, onSave };
	}
}

function formStateReducer(state: IAppState = INITIAL_STATE, action: ShowDialogAction): IAppState {
	switch (action.type) {
		case FormStateActions.SHOW_GRAPH_FORM_DIALOG:
			return Object.assign({}, state, {
				show: action.payload,
				editing: action.editing || null,
				onSave: action.onSave || noop
			});
	}

	return state;
}

export const storeInstance: Store<any> = createStore(formStateReducer);