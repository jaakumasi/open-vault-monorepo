import { createAction, props } from '@ngrx/store';
import { SCREEN_SIZE, User } from '../types';

export const updateScreenSize = createAction(
  'screen-size',
  props<{ screen: SCREEN_SIZE }>()
);

export const updateUser = createAction('set-user', props<{ user: User }>());
