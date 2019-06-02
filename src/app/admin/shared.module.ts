import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TopNavWidgetComponent } from '../layout/top-navbar/top-nav-widget.component';
import { BaseChartComponent } from '../layout/base-chart-component/base-chart.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  declarations: [
    TopNavWidgetComponent,
    BaseChartComponent
  ],
  exports: [
    CommonModule,
    FormsModule,
    TopNavWidgetComponent,
    BaseChartComponent
  ]
})
export class SharedModule { }
