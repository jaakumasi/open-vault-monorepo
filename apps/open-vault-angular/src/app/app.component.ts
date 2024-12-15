import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { switchMap } from 'rxjs';

@Component({
  standalone: true,
  imports: [HttpClientModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private readonly http = inject(HttpClient)

  async upload(event: Event) {
    const input = event.target as HTMLInputElement

    if (!input.files?.length)
      return;
 
    const file = input.files[0];

    const formData = new FormData();
    formData.append('file', file);

    this.http.post('http://localhost:3000/upload-file', formData)
      .subscribe(r => {
        console.log(r)
      })
  }
}
