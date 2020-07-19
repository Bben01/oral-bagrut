import { RoomService } from './room.service';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoomGuardService implements CanActivate {
  constructor(private router: Router, private roomService: RoomService) {
  }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    // TODO: remove this
    return true;
    return new Promise(
      (resolve) => {
        this.roomService.roomSubject.subscribe((room: string) => {
          if (!!room) {
            resolve(true);
          } else {
            this.router.navigate(["join"]);
            resolve(false);
          }
        });
      }
    );
  }
}
