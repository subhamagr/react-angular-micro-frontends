import { Component, OnChanges, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material';
import { MatDialogRef } from '@angular/material';

@Component({
	selector: 'form-dialog',
	template: `
		<div></div>
	`,
})
export class DialogContainer implements OnChanges, OnInit {
	@Input() private showDialog: boolean;
	@Output() onSubmit: EventEmitter<any> = new EventEmitter();
	selectedEmoji: string;

	constructor(public dialog: MatDialog) { }

	ngOnInit() { }

	ngOnChanges({ showDialog }: SimpleChanges) {
		if (!showDialog.previousValue && showDialog.currentValue) {
			this.openDialog();
		}
	}

	openDialog() {
		let dialog = this.dialog.open(FormDialog, {
			height: '100vh',
			width: '100vw',
			maxHeight: '100vh',
			maxWidth: '100vw',
			panelClass: 'dialog-container'
		});

		dialog.afterClosed()
			.subscribe(({ cancel, values }) => {
				this.onSubmit.emit([cancel, values]);
			});
	}
}


@Component({
	selector: 'emoji-dialog',
	templateUrl: './dialog.component.html',
	styleUrls: ['./style.css']
})
export class FormDialog {

	charts = ['bar', 'line', 'pie'];
	chartType: string;

	constructor(public dialogRef: MatDialogRef<FormDialog>) { }

	onSubmit(cancel = false) {
		this.dialogRef.close({ cancel, values: { chartType: this.chartType } });
	}
}