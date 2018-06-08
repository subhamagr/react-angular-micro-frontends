import { NgModule } from '@angular/core';
import { MatDialogModule, MatSelectModule, MatButtonModule, MatToolbarModule, MatIconModule, MatFormFieldModule, MatInputModule, MatCheckboxModule, MatDividerModule } from "@angular/material";


const components = [
	MatButtonModule,
	MatCheckboxModule,
	MatDialogModule,
	MatDividerModule,
	MatFormFieldModule,
	MatIconModule,
	MatInputModule,
	MatSelectModule,
	MatToolbarModule,
];

@NgModule({
	imports: components,
  exports: components,
})
export class MaterialModule {
	constructor() {}
}
