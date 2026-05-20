import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'trendColor' })
export class TrendColorPipe implements PipeTransform {
  transform(value: number): string {
    return value >= 0
      ? 'text-green-600 dark:text-green-400'
      : 'text-red-600 dark:text-red-400';
  }
}
