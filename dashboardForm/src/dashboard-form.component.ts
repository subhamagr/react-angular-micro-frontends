import { Component, forwardRef, Inject, OnDestroy, NgZone } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NgRedux } from '@angular-redux/store';

import { IAppState, FormStateActions } from "./store";
import { Globals } from "./globals.service";

@Component({
	selector: 'dashboard-form',
	templateUrl: 'form.template.html',
})
export class DashboardForm {
	formState: IAppState;
	subscription;
	constructor(
		@Inject(forwardRef(() => NgRedux)) private ngRedux: NgRedux<IAppState>,
		@Inject(forwardRef(() => FormStateActions)) private actions: FormStateActions,
		@Inject(forwardRef(() => Globals)) private globals: Globals,
		private ngZone: NgZone
	) {
		this.subscription = ngRedux.select<IAppState>()
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
