import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { DataService } from '../../@service/dataService';
import { HttpClientService } from '../../@http-services/http.services';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-register2',
  imports: [RouterLink, RouterLinkActive, MatIconModule, CommonModule, FormsModule],
  templateUrl: './register2.component.html',
  styleUrl: './register2.component.scss'
})
export class Register2Component {

  constructor(private router: Router, private dataService: DataService, private http: HttpClientService) { }

  name!: string;
  birthday!: string;
  alertMessage: Boolean = false;
  alertMessage1: Boolean = false;
  errorMessage!: string;

  ngOnInit(): void {
    this.name = this.dataService.name
    this.birthday = this.dataService.birthday
  }

  next() {
    let req = {
      "employeeName": this.name,
      "birthday": this.birthday,
      "email": this.dataService.email
    }
    //APIと繋ぐ
    // 誕生日と名前とe-mailが一致する従業員がいるかどうか確認する
    this.http.postApi("http://localhost:8080/account/check_employee", req).subscribe({
      next: (res: any) => {
        console.log(res);
        this.dataService.birthday = this.birthday;
        this.dataService.name = this.name;
        this.router.navigateByUrl('/register3Page');
      },
      error: (err: any) => {
        console.log(err);
        const messages = err.error.map((e: any) => e.message);

        this.alertMessage = messages.includes("従業員名が未入力です。");
        this.alertMessage1 = messages.includes("誕生日が未入力です。");

        if (!(this.alertMessage || this.alertMessage1)) {
          console.log("error");

          this.errorMessage = '資料が一致する従業員が見つかりません。';
          // 3秒後清除訊息
          setTimeout(() => {
            this.errorMessage = '';
          }, 3000);

        }
      }
    })

  }

  return() {
    this.dataService.birthday = "";
    this.dataService.name = "";
    this.router.navigateByUrl('/register1Page');
  }

}
