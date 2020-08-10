import { RoomService } from './room.service';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoomGuardService implements CanActivate {
  inRoom: boolean = false;

  constructor(private router: Router, private roomService: RoomService) {
  }

  inRoomCheck() {
    return new Promise(resolve => {
      if (this.inRoom) {
        resolve(true);
        return;
      }
      else {
        this.roomService.roomSubject.subscribe((room: string) => {
          if (!!room) {
            this.inRoom = true;
            resolve(true);
            return;
          } else {
            this.inRoom = false;
            resolve(false);
            return;
          }
        });
        this.roomService.emitRoom();
      }
    });
  }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return new Promise(resolve => {
      this.inRoomCheck().then((access: boolean) => {
        resolve(access);
      });
    });
  }
}
