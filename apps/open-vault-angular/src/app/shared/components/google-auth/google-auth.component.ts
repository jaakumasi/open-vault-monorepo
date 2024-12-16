declare var google: any;

import { Component, EventEmitter, OnInit, Output, signal } from '@angular/core';

@Component({
  selector: 'app-google-auth',
  standalone: true,
  imports: [],
  templateUrl: './google-auth.component.html',
})
export class GoogleAuthComponent implements OnInit {
  @Output() credentialEmitter = new EventEmitter<any>();

  ngOnInit(): void {
    this.gInit();
  }

  gInit() {
    google?.accounts.id.initialize({
      client_id:
        '190199373473-dld4tnh6187uhdt7vrfers6ld7ofbdgi.apps.googleusercontent.com',
      callback: (data: any) => {
        this.credentialEmitter.emit(data);
      },
    });
    google?.accounts.id.renderButton(document.querySelector('.google-btn_'), {
      type: 'icon',
      theme: 'outline',
      size: 'large',
      shape: 'circle',
    });
  }
}
