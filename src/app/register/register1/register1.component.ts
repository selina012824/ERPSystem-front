import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { DataService } from '../../@service/dataService';
import { HttpClientService } from '../../@http-services/http.services';

@Component({
  selector: 'app-register1',
  imports: [RouterLink, RouterLinkActive, MatIconModule, CommonModule, FormsModule],
  templateUrl: './register1.component.html',
  styleUrl: './register1.component.scss'
})
export class Register1Component {

  constructor(private router: Router, private dataService: DataService, private http: HttpClientService) { }

  email!: string;
  alertMessage: Boolean = false;
  alertMessage1: Boolean = false;


  ngOnInit(): void {
    this.email = ""
    this.dataService.birthday = "";
    this.dataService.name = "";
    this.email = this.dataService.email
  }

  next() {
    let req = {
      "email": this.email
    }
    //APIと繋ぐ
    // メールも登録されているかどうか確認する
    this.http.postApi("http://localhost:8080/account/check_email", req).subscribe({
      next: (res: any) => {
        console.log(res);

        this.dataService.email = this.email;
        this.router.navigateByUrl('/register2Page');
      },
      error: (err: any) => {

        if (err.error[0].message == "メールアドレスが未入力です。") {
          this.alertMessage = true;
        } else if (err.error[0].message == "このメールアドレスはすでに登録されています。") {
          this.alertMessage1 = true;
        } else {
          this.alertMessage = false;
          this.alertMessage1 = false;
        }
      }
    })

  }

  return() {
    this.router.navigateByUrl('/');

  }


}
