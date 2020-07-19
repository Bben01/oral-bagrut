import { Component } from '@angular/core';
import * as firebase from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Oral bagrut';

  constructor() {
    const firebaseConfig = {
      apiKey: "AIzaSyAEvmovcq7t63uS0r3dc0YajoH0C64tNXk",
      authDomain: "oral-bagrut.firebaseapp.com",
      databaseURL: "https://oral-bagrut.firebaseio.com",
      projectId: "oral-bagrut",
      storageBucket: "oral-bagrut.appspot.com",
      messagingSenderId: "447329916853",
      appId: "1:447329916853:web:c24f819f57f4c7a84d2bfc"
    };
    firebase.initializeApp(firebaseConfig);
  }
}
