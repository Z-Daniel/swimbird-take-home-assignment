import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'trendColor' })
export class TrendColorPipe implements PipeTransform {
  transform(value: number): string {
    return value >= 0 ? 'text-success' : 'text-danger';
  }
}
