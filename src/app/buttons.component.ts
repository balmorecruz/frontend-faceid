import { Component, EventEmitter, Output,Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-buttons',
  standalone:true,
  imports:[FormsModule],
  templateUrl: './buttons.component.html',
  styleUrls: ['./buttons.component.css']
})
export class ButtonsComponent {
  @Output() sendImgLogin = new EventEmitter<void>();
  @Output() sendImgLogout = new EventEmitter<void>();
  @Output() registerNewUserOk = new EventEmitter<string>();
  @Output() downloadLogs = new EventEmitter<void>();
  @Output() showWebcam = new EventEmitter<void>();
  @Output() showImg = new EventEmitter<void>();
  @Input() lastFrame: string | undefined;

  value: string = '';

  constructor() { }

  registerOk() {
    this.registerNewUserOk.emit(this.value);
  }

  cancelRegistration() {
    this.showWebcam.emit();
    this.showImg.emit();
  }
}
