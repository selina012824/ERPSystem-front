import { CommonModule, DatePipe } from '@angular/common';
import { Component, HostListener, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { DataService } from '../@service/dataService';
import { HttpClientService } from '../@http-services/http.services';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-add-employee',
  imports: [CommonModule, MatIconModule, FormsModule],
  templateUrl: './add-employee.component.html',
  styleUrl: './add-employee.component.scss'
})
export class AddEmployeeComponent {
  constructor(private router: Router, private dataService: DataService, private http: HttpClientService) { }
  readonly dialog = inject(MatDialog);

  employeeID!: string;
  employeeName!: string;
  birthday!: string;
  cellphone!: string;
  email!: string;
  address!: string;
  createAt!: string;
  createClerk!: string;

  return() {
    this.router.navigateByUrl('/TransformPage/employeePage');
  }

  send() {
    //確認ダイアログを開く
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      data: { message: "送信してもよろしいですか？" },
      width: "400px",
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result == "sure") {
        // 現在時刻取得
        let datePipe = new DatePipe('en-US');
        let now = new Date();
        let formattedDateTime = datePipe.transform(now, 'yyyy-MM-ddTHH:mm:ss')!;

        this.createAt = formattedDateTime;
        this.createClerk = "員工A" // 今後はログインユーザー名に置換予定

        let req = {
          "employeeID": this.employeeID,
          "employeeName": this.employeeName,
          "birthday": this.birthday,
          "cellphone": this.cellphone,
          "email": this.email,
          "address": this.address,
          "createdAt": this.createAt,
          "createdBy": this.createClerk,
          "updatedAt": this.createAt,
          "updatedBy": this.createClerk,
        }

        this.http.postApi("http://localhost:8080/employee/add_employee", req)
          .subscribe({
            next: (res: any) => {
              // 將成功訊息存儲到 sessionStorage 中
              sessionStorage.setItem('successMessage', 'データが正常に送信されました!');

              this.router.navigateByUrl('/TransformPage/employeePage');
            },

            error: (err: any) => {
              console.log(err);
            }

          })
      }
    })

  }

  //滾動按鈕====================================

  showButton: Boolean = false;
  private hideTimeout: any; // 記錄隱藏按鈕的定時器


  toButtom() {
    if (this.isAtBottom()) {
      // 如果在最底部，則滑動到最上方
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // 否則滑動到最底部
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
    }
  }

  // 判斷頁面是否已經滾動到最底部
  isAtBottom(): boolean {
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;
    return scrollPosition + windowHeight >= docHeight;
  }

  // 判斷頁面是否已經滾動到最頂部
  isAtTop(): boolean {
    return window.scrollY === 0;
  }

  // 監聽滾動事件
  @HostListener('window:scroll', [])
  onWindowScroll() {
    // 當滾動時顯示按鈕
    this.showButton = true;


    // 清除之前的定時器，並設置一個新的定時器讓按鈕在幾秒後消失
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }

    this.hideTimeout = setTimeout(() => {
      this.showButton = false;
    }, 4000);
  }
}
