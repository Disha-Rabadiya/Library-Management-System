import { Component } from '@angular/core';

@Component({
  selector: 'app-login-register',
  standalone: false,
  templateUrl: './login-register.component.html',
  styleUrl: './login-register.component.scss',
})
export class LoginRegisterComponent {
  public activeTab: number = 1;

  changeTab(tab: number) {
    this.activeTab = tab;
  }
}
