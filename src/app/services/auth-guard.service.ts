import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import * as firebase from 'firebase/app';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(private router: Router) { }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return new Promise(resolve => {
      firebase.auth().onAuthStateChanged(
        (user) => {
          if (user) {
            resolve(true);
          } else {
            this.router.navigate(['signin']);
            resolve(false);
          }
        });
    });
  }
}