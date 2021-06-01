import { Action, ActionReducer, ActionReducerMap, MetaReducer } from '@ngrx/store';
import { environment } from '../../environments/environment';
import { InjectionToken } from '@angular/core';
import * as fromRouter from '@ngrx/router-store';

export interface State {
  router: fromRouter.RouterReducerState<never>;
}

export const rootReducers = new InjectionToken<ActionReducerMap<State, Action>>(
  'Root Reducers Token',
  {
    factory: () => ({
      router: fromRouter.routerReducer,
    }),
  }
);

export function logger(reducer: ActionReducer<never>): ActionReducer<never> {
  return (state, action) => {
    const result = reducer(state, action);
    console.groupCollapsed(action.type);
    console.log('previous state: ', state);
    console.log('action', action);
    console.log('next state', result);
    console.groupEnd();

    return reducer(state, action);
  };
}

export const metaReducers: MetaReducer<State>[] = !environment.production ? [logger] : [];
