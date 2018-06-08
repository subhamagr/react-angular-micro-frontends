import { Component, OnChanges, OnInit, Input, Output, EventEmitter, SimpleChanges, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { MatDialogRef } from '@angular/material';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

import { Chart, chartTypes, Series, PieSeriesData } from './data-model';

@Component({
	selector: 'form-dialog',
	template: `
		<div></div>
	`,
})
export class DialogContainer implements OnChanges, OnInit {
	@Input() private showDialog: boolean;
	@Input() private initialData: any;
	@Output() onSubmit: EventEmitter<any> = new EventEmitter();
	dialogRef = null;

	constructor(public dialog: MatDialog) { }

	ngOnInit() { }

	ngOnChanges({ showDialog }: SimpleChanges) {
		if (!showDialog.previousValue && showDialog.currentValue) {
			this.openDialog();
		}
	}

	openDialog() {
		this.dialogRef = this.dialog.open(FormDialog, {
			height: '100vh',
			width: '100vw',
			maxHeight: '100vh',
			maxWidth: '100vw',
			panelClass: 'dialog-container',
			data: { initialData: this.initialData },
		});

		this.dialogRef.afterClosed()
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
export class FormDialog implements OnChanges {
	chartTypes = chartTypes;
	chart: Chart;
	chartForm: FormGroup;
	editing: boolean = false;

	constructor(
		public dialogRef: MatDialogRef<FormDialog>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private fb: FormBuilder,
	) {
		this.editing = !!data.initialData;
		this.chart = new Chart(data.initialData || { series: [] });
		this.createForm();
	}

	ngOnChanges() {
		this.rebuildForm();
	}

	createForm() {
		const initialData = this.chart;
		this.chartForm = this.fb.group({
			...this.chart,
		});
		this.setSeries(this.chart.series, true);
	}

	rebuildForm() {
		this.chartForm.reset({
			...this.chart
		});
		this.setSeries(this.chart.series);
	}

	get series(): FormArray {
		return this.chartForm.get('series') as FormArray;
	};

	seriesPieData(index): FormArray {
		return this.chartForm.get('series').get(`${index}`).get('pieData') as FormArray;
	};

	setSeries(series: Series[], firstTime: boolean = false) {
		const seriesFGs = series.map((series) => this.fb.group(series));
		const seriesFormArray = this.fb.array(seriesFGs);
		seriesFormArray.controls.forEach((sc: FormGroup, i) => {
			let pd = [];
			if (this.chartForm.value.chartType === 'pie') {
				pd = (firstTime ? series[i].data : series[i].pieData) || [];
			} else {
				pd = series[i].pieData;
			}
			const pieDataFGs = pd.map(pd => this.fb.group(pd));
			const pieDataFormArray = this.fb.array(pieDataFGs);
			sc.setControl('pieData', pieDataFormArray);
		});
		this.chartForm.setControl('series', seriesFormArray);
	}

	addSeries() {
		const newSeriesForm = this.fb.group(new Series());
		newSeriesForm.setControl('pieData', this.fb.array([]));
		this.series.push(newSeriesForm);
	}

	addPieSeriesData(index) {
		this.seriesPieData(index).push(this.fb.group(new PieSeriesData()));
	}

	removeSeries(index) {
		this.series.removeAt(index);
	}

	removePieSeriesData(seriesIndex, dataIndex) {
		this.seriesPieData(seriesIndex).removeAt(dataIndex);
	}

	onSubmit(cancel = true) {
		if (cancel) this.dialogRef.close({ cancel, values: null });
		else this.dialogRef.close({ cancel, values: this.normalizeData() });
	}

	normalizeData(): Chart {
		const formModel = this.chartForm.value;
		const checkChartType = (type: string): boolean => {
			return formModel.chartType === type;
		}

		const seriesDeepCopy: Series[] = formModel.series.map(
			(series: Series) => {
				const seriesData = {
					name: series.name as string,
					data: series.data as string,
				};
				if (checkChartType('pie')) {
					const pieDataDeepCopy = series.pieData.map(
						(pieData: PieSeriesData) => Object.assign({}, pieData));

					Object.assign(seriesData, {
						data: pieDataDeepCopy,
						colorByPoint: series.colorByPoint as boolean,
					});
				}

				return seriesData;
			}
		);

		const chartPayload: any = {
			chartType: formModel.chartType as string,
			height: formModel.height as number,
			width: formModel.width as number,
			x: formModel.x as number,
			y: formModel.y as number,
			title: formModel.title as string,
			series: seriesDeepCopy
		};
		if (!checkChartType('pie')) {
			chartPayload.xAxisCategories = formModel.xAxisCategories as string;
			if (checkChartType('bar')) {
				chartPayload.crosshair = formModel.crosshair as boolean;
				chartPayload.tooltipShared = formModel.tooltipShared as boolean;
			}
		}
		return chartPayload;
	}

	reset() { this.rebuildForm(); }
}