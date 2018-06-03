import { Inject, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { enableProdMode } from '@angular/core';
import { MatDialogModule, MatSelectModule, MatButtonModule, MatToolbarModule, MatIconModule } from "@angular/material";
import { FormsModule } from '@angular/forms';

import { NgReduxModule, NgRedux } from '@angular-redux/store';

import { FormStateActions } from './store';
import { Globals } from "./globals.service";
import { DashboardForm } from './dashboard-form.component';
import { DialogContainer, FormDialog } from './components/dialog/dialog.component';

enableProdMode();

@NgModule({
	imports: [
		BrowserModule,
		NgReduxModule,
		BrowserAnimationsModule,
		MatDialogModule,
		MatSelectModule,
		MatButtonModule,
		MatToolbarModule,
		FormsModule,
		MatIconModule,
	],
	providers: [FormStateActions, Globals],
	declarations: [
		DashboardForm,
		DialogContainer,
		FormDialog,
	],
	entryComponents: [DialogContainer, FormDialog],
	bootstrap: [DashboardForm]
})
export class MainModule {
	constructor(
		private ngRedux: NgRedux<any>,
		private globals: Globals,
		@Inject('localStoreRef') private localStoreRef: any,
		@Inject('globalEventDispatcherRef') private globalEventDispatcherRef: any
	) {

		this.ngRedux.provideStore(localStoreRef);
		this.globals.globalEventDistributor = globalEventDispatcherRef;
	}
}
