import noop from 'lodash/noop';

export interface FormStateActionType {
	type: string,
	payload: boolean,
	editing: any,
	onSave: Function
}

export class FormStateActions {
	static SHOW_GRAPH_FORM_DIALOG = 'SHOW_GRAPH_FORM_DIALOG';
	static ADD_GRAPH = 'ADD_GRAPH';
	static UPDATE_GRAPH = 'UPDATE_GRAPH';

	showGraphDialog(payload, editing = null, onSave = noop): FormStateActionType {
		return { type: FormStateActions.SHOW_GRAPH_FORM_DIALOG, payload, editing, onSave };
	}
	
	updateGraph(payload, index) {
		return { type: FormStateActions.UPDATE_GRAPH, payload: { ...payload, index } };
	}
	
	addGraph(payload) {
		return { type: FormStateActions.ADD_GRAPH, payload };
	}
}