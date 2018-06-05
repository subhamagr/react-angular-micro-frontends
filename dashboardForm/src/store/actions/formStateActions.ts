import noop from 'lodash/noop';

export interface FormStateActionType {
	type: string,
	payload: boolean,
	editing: any,
	onSave: Function
}

export class FormStateActions {
	static SHOW_GRAPH_FORM_DIALOG = 'SHOW_GRAPH_FORM_DIALOG';

	showGraphDialog(payload, editing = null, onSave = noop): FormStateActionType {
		return { type: FormStateActions.SHOW_GRAPH_FORM_DIALOG, payload, editing, onSave };
	}
}