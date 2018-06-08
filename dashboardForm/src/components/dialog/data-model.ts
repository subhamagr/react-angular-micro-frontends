
export class PieSeriesData {
  name = '';
  selected = false;
  sliced = false;
  value = null;
}

export class Series {
  data: any = null;
  pieData: PieSeriesData[] = [new PieSeriesData()];
  colorByPoint: boolean = true;
  name = '';
  constructor(values: any = {}) {
    this.name = values.name || '';
    this.data = values.data;
    this.colorByPoint = Boolean(values.colorByPoint);
  }
}

export class Chart {
  chartType: string = '';
  title: string = '';
  height: number = 9;
  width: number = 10;
  x: number = 0;
  y: number = -1;
  xAxisCategories: string = '';
  crosshair: boolean = true;
  tooltipShared: boolean = true;
  series: Series[] = [new Series()];
  
  constructor(data: any = {}) {
    Object.keys(data).forEach((k) => {
      const isSeries = k === 'series';
      if (isSeries && data[k] && data[k].length > 0) {
        this.series = [];
        (data[k] || []).forEach(s => {
          this.series.push(new Series(s));
        });
      } else if (!isSeries) {
        this[k] = data[k];
      }
    });
  }
}

export const chartTypes: string[] = ['pie', 'line', 'bar'];
