import { Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, Observable, of, startWith } from 'rxjs';

export type Loadable<T> =
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: unknown };

export function toLoadable<T>(source$: Observable<T>): Signal<Loadable<T>> {
  return toSignal(
    source$.pipe(
      map((data): Loadable<T> => ({ status: 'success', data })),
      catchError((error): Observable<Loadable<T>> => of({ status: 'error', error })),
      startWith<Loadable<T>>({ status: 'loading' }),
    ),
    { requireSync: true },
  );
}
