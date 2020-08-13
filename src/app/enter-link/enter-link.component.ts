import { ActivatedRoute, Router } from '@angular/router';
import { RoomService } from './../services/room.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-enter-link',
  templateUrl: './enter-link.component.html',
  styleUrls: ['./enter-link.component.scss']
})
export class EnterLinkComponent implements OnInit {

  errorMessage: string = "";
  entering: boolean = true;

  constructor(private roomService: RoomService,
    private activatedRoute: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    let id = this.activatedRoute.snapshot.paramMap.get('id');
    if (!id.includes("#")) {
      id += location.hash;
    }
    this.roomService.enterRoom("", "", id).then(_ => {
      this.entering = false;
    }).catch(error => {
      this.errorMessage = error;
    });
  }

  join(isSupervisor: boolean) {
    if (isSupervisor) {
      this.router.navigate(['student', 'info']);
    }
    else {
      this.router.navigate(['teacher', 'info']);
    }
  }

}
