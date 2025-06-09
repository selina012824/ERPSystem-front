import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { HttpClientService } from './@http-services/http.services';
import { DataService } from './@service/dataService';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'ERPsystem';

  constructor(private router: Router, private http: HttpClientService, private dataService: DataService) { }

  successMessage: string = '';
  account!: string;
  password!: string;
  ngOnInit(): void {
    this.successMessage = sessionStorage.getItem('successMessage') || '';

    setTimeout(() => {
      sessionStorage.removeItem('successMessage');
      this.successMessage = '';
    }, 3000);
  }

  logIn() {

    let req = {
      "email": this.account,
      "password": this.password
    }
    this.http.postApi("http://localhost:8080/account/login", req).subscribe({
      next: (res: any) => {
        sessionStorage.setItem('successMessage', 'ログイン成功しました！');
        this.dataService.employeeID = res.employeeID
        console.log(this.dataService.employeeID);

        this.router.navigateByUrl('/TransformPage/quotationPage');
      },
      error: (err: any) => {
        this.successMessage = "ログイン失敗しました、もう一度試してください";

        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      }
    })

  }
}
