import { Component, forwardRef, Inject, OnDestroy, NgZone } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NgRedux } from '@angular-redux/store';

import { FormState, AppState } from "./store/model";
import { FormStateActions } from "./store/actions/formStateActions";
import { Globals } from "./globals.service";

@Component({
	selector: 'dashboard-form',
	templateUrl: 'form.template.html',
})
export class DashboardForm {
	formState: FormState;
	subscription;
	constructor(
		@Inject(forwardRef(() => NgRedux)) private ngRedux: NgRedux<AppState>,
		@Inject(forwardRef(() => FormStateActions)) private actions: FormStateActions,
		@Inject(forwardRef(() => Globals)) private globals: Globals,
		private ngZone: NgZone
	) {
		ngRedux.select<AppState>()
			.subscribe(console.log)
		this.subscription = ngRedux.select<FormState>('formState')
			.subscribe(formState => {
				this.ngZone.run(() => { this.formState = formState; })
			});
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

	onFormSubmit(cancel = false, values = {}) {
		this.globals.globalEventDistributor.dispatch(this.actions.showGraphDialog(false));
	}

}
