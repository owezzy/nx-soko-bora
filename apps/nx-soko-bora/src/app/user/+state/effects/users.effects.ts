import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap } from 'rxjs/operators';
import { Observable, EMPTY, of } from 'rxjs';

import * as UsersActions from '../actions/users.actions';



@Injectable()
export class UsersEffects {

  loadUserss$ = createEffect(() => {
    return this.actions$.pipe( 

      ofType(UsersActions.loadUserss),
      concatMap(() =>
        /** An EMPTY observable only emits completion. Replace with your own observable API request */
        EMPTY.pipe(
          map(data => UsersActions.loadUserssSuccess({ data })),
          catchError(error => of(UsersActions.loadUserssFailure({ error }))))
      )
    );
  });



  constructor(private actions$: Actions) {}

}
