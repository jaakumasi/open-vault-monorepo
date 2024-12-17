declare var google: any;

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { GoogleUser } from '../../types';

@Component({
  selector: 'app-google-auth',
  standalone: true,
  imports: [],
  templateUrl: './google-auth.component.html',
})
export class GoogleAuthComponent implements OnInit {
  @Output() credentialEmitter = new EventEmitter<GoogleUser>();

  ngOnInit(): void {
    this.gInit();
  }

  gInit() {
    google?.accounts.id.initialize({
      client_id:
        '190199373473-dld4tnh6187uhdt7vrfers6ld7ofbdgi.apps.googleusercontent.com',
      callback: (credentials: {
        credential: string;
        client_id: string;
      }) => {
        const payload = credentials.credential.split('.')[1];
        const decodedCredentials: GoogleUser = JSON.parse(atob(payload));
        this.credentialEmitter.emit(decodedCredentials);
      }
    });
    google?.accounts.id.renderButton(document.querySelector('.google-btn_'), {
      type: 'icon',
      theme: 'outline',
      size: 'large',
      shape: 'circle',
    });
  }
}
