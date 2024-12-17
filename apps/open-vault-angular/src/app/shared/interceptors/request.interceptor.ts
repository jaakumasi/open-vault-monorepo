import {
  HttpEventType,
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { STORAGE_KEYS } from '../constants';
import { tap } from 'rxjs';

export const requestInterceptor: HttpInterceptorFn = (req, next) => {
  console.log(req.body)

  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  const reqClone = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${token}`),
  });

  return next(reqClone);
};
