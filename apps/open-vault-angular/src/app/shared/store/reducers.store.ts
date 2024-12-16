import { createReducer, on } from '@ngrx/store';
import { globalState } from './state.store';
import { updateScreenSize, updateUser } from './actions.store';

export const globalStateReducer = createReducer(
    globalState,
    on(updateScreenSize, (state, action) => {
        return {
            ...state,
            screenSize: action.screen,
        };
    }),
    on(updateUser, (state, action) => {
        return {
            ...state,
            user: action.user,
        };
    })
);
