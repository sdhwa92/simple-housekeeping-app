import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ChartsModule } from 'ng2-charts';
import { TopNavWidgetComponent } from '../layout/top-navbar/top-nav-widget.component';
import { BaseChartComponent } from '../layout/base-chart-component/base-chart.component';
import { BarChartComponent } from '../layout/bar-chart-component/bar-chart.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ChartsModule
  ],
  declarations: [
    TopNavWidgetComponent,
    BaseChartComponent,
    BarChartComponent
  ],
  exports: [
    CommonModule,
    FormsModule,
    TopNavWidgetComponent,
    BaseChartComponent,
    BarChartComponent
  ],
  entryComponents: [
    BaseChartComponent,
    BarChartComponent
  ]
})
export class SharedModule { }
