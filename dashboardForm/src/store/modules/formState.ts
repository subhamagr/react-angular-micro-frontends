import noop from 'lodash/noop';
import { FormState } from "../model";
import { FormStateActionType, FormStateActions } from '../actions/formStateActions';


const INITIAL_STATE: FormState = {
	show: false,
	editing: null,
	onSave: noop
};


function formStateReducer(state: FormState = INITIAL_STATE, action: FormStateActionType): FormState {
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

export default formStateReducer;
