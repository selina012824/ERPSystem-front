import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { HttpClientService } from '../../@http-services/http.services';
import { DataService } from '../../@service/dataService';

@Component({
  selector: 'app-register3',
  imports: [RouterLink, RouterLinkActive, MatIconModule, CommonModule, FormsModule],
  templateUrl: './register3.component.html',
  styleUrl: './register3.component.scss'
})
export class Register3Component {

  constructor(private router: Router, private http: HttpClientService, private dataService: DataService) { }

  password!: string;
  password2!: string;

  passwordAlert: Boolean = false;
  alertMessage: Boolean = false;
  errorMessage!: string;

  register() {
    if (this.password != this.password2) {
      this.passwordAlert = true;
      return;
    } else {
      this.passwordAlert = false;
    }

    let req = {
      "email": this.dataService.email,
      "employeeName": this.dataService.name,
      "birthday": this.dataService.birthday,
      "password": this.password
    }
    //APIと繋ぐ
    // アカウント登録
    this.http.postApi("http://localhost:8080/account/add_account", req).subscribe({
      next: (res: any) => {
        sessionStorage.setItem('successMessage', '登録成功しました！');
        this.router.navigateByUrl('/').then(() => {
          location.reload();
        });
      },
      error: (err: any) => {
        console.log(err);
        const messages = err.error.map((e: any) => e.message);
        this.alertMessage = messages.includes("パスワードが未入力です。");

        if (!(this.alertMessage)) {
          this.errorMessage = '登録失敗しました。もう一度試してください';
          // 3秒後清除訊息
          setTimeout(() => {
            this.errorMessage = '';
          }, 3000);

        }
      }
    })
  }

  return() {
    this.router.navigateByUrl('/register2Page');
  }
}
