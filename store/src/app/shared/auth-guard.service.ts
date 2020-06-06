import { Injectable } from '@angular/core';
import {CanActivate, Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(private _router: Router) { }
  canActivate() {
    if(localStorage.getItem('token')) {
       return true;
    } else {
       this._router.navigate(['/signIn']);
       return false;
    }
  }
}
