export interface FormState {
	show: boolean,
	editing: any,
	onSave: Function,
};

export interface AppState {
	formState: FormState,
};