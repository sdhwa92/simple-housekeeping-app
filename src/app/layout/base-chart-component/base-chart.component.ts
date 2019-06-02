import { Component, Input, OnInit } from '@angular/core';

/*Models*/
import { ChartDataConfigModel } from '../models/chart-config.model';

@Component({
  selector: 'app-base-chart',
  template: `
    <canvas baseChart [datasets]="{{chartData}}"></canvas>
  `
})
export class BaseChartComponent implements OnInit {
  @Input() chartlabels;
  @Input() chartType = 'bar';
  @Input() chartLegend = true;
  @Input() chartData: ChartDataConfigModel[];

  constructor() {}

  ngOnInit(): void {
  }

}