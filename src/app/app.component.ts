

// webcam-capture.component.ts

import { Component, ElementRef, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonsComponent } from './buttons.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FormsModule, HttpClientModule, ButtonsComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild('video', { static: true })
  videoElement!: ElementRef;
  @ViewChild('canvas', { static: true })
  canvas!: ElementRef;

  lastFrame: string | null = null;
  showWebcam: boolean = true;
  showImg: boolean = false;
  isRegistering: boolean = false;
  isAdmin: boolean = false;
  value: string = '';
  zIndexAdmin: number = 1;
  zIndexRegistering: number = 1;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.setupCamera();
  }

  setupCamera() {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        this.videoElement.nativeElement.srcObject = stream;
        this.videoElement.nativeElement.play();
      })
      .catch(err => console.error('Error accessing camera: ', err));
  }

  captureFrame() {
    const context = this.canvas!.nativeElement.getContext('2d');
    context.drawImage(this.videoElement!.nativeElement, 0, 0, 400, 300);
    this.lastFrame = this.canvas!.nativeElement.toDataURL('image/png');
  }

  registerNewUserOk(text: string) {
    this.captureFrame();
    if (this.lastFrame) {
      const apiUrl = `http://localhost:8000/register_new_user?text=${text}`;
      fetch(this.lastFrame)
        .then(response => response.blob())
        .then(blob => {
          const file = new File([blob], 'webcam-frame.png', { type: 'image/png' });
          const formData = new FormData();
          formData.append('file', file);

          this.http.post(apiUrl, formData)
            .subscribe({
              next:(response:any) =>{
                if (response.registration_status === 200) {
                  alert('Usuario registrado!');
                }else if (response.registration_status === 404){
                  alert('Usuario ya existe!');

                }
              }, error:(error:any)=> {
                console.error('Error sending image to API:', error);
              }
            }
            );
        });
    }
  }

  sendImgLogin() {
    this.captureFrame();
    if (this.lastFrame) {
      const apiUrl = `http://localhost:8000/login`;
      fetch(this.lastFrame)
        .then(response => response.blob())
        .then(blob => {
          const file = new File([blob], 'webcam-frame.png', { type: 'image/png' });
          const formData = new FormData();
          formData.append('file', file);

          this.http.post(apiUrl, formData)
            .subscribe((response: any) => {
              if (response.match_status === true) {
                console.log(response)
                alert('Bienvenido ' + response.user.name + ' !');
              } else {
                alert('Usuario desconocido!');
              }
            }, error => {
              console.error('Error sending image to API:', error);
            });
        });


    }


  }

  sendImgLogout() {
    this.captureFrame();

    if (this.lastFrame) {
      const apiUrl = `http://localhost:8000/logout`;
      fetch(this.lastFrame)
        .then(response => response.blob())
        .then(blob => {
          const file = new File([blob], 'webcam-frame.png', { type: 'image/png' });
          const formData = new FormData();
          formData.append('file', file);

          this.http.post(apiUrl, formData)
            .subscribe((response: any) => {
              if (response.match_status === true) {
                alert('Adios ' + response.user + ' !');
              } else {
                alert('Usuario desconocido!');
              }
            }, error => {
              console.error('Error sending image to API:', error);
            });
        });
    }
  }

  downloadLogs() {
    this.http.get(`http://127.0.0.1:8000/get_attendance_logs`, { responseType: 'blob' })
      .subscribe((response: any) => {
        const url = window.URL.createObjectURL(new Blob([response]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'logs.zip');
        document.body.appendChild(link);
        link.click();
      }, error => {
        console.error('Error downloading logs:', error);
      });
  }

  changeZIndexAdmin(newZIndex: number) {
    this.zIndexAdmin = newZIndex;
  }

  changeZIndexRegistering(newZIndex: number) {
    this.zIndexRegistering = newZIndex;
  }

  resetTextBox() {
    this.value = '';
  }


  cancelRegistration() {
    this.isRegistering = false;
    this.changeZIndexAdmin(1);
    this.changeZIndexRegistering(1);
    this.showWebcam = true;
    this.showImg = false;
  }

  toggleAdmin() {
    this.isAdmin = true;
    this.isRegistering = false;
    this.changeZIndexAdmin(3);
    this.changeZIndexRegistering(1);
  }

  startRegistration() {
    this.isAdmin = false;
    this.isRegistering = true;
    this.changeZIndexAdmin(1);
    this.changeZIndexRegistering(3);
    this.captureFrame();
    this.resetTextBox();
  }

  goBack() {
    this.isAdmin = false;
    this.isRegistering = false;
    this.changeZIndexAdmin(1);
    this.changeZIndexRegistering(1);
  }

}
