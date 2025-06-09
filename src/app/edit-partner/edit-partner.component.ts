import { Component, HostListener, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DataService } from '../@service/dataService';
import { HttpClientService } from '../@http-services/http.services';
import { CommonModule, DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-edit-partner',
  imports: [CommonModule, MatIconModule, FormsModule],
  templateUrl: './edit-partner.component.html',
  styleUrl: './edit-partner.component.scss'
})
export class EditPartnerComponent {

  constructor(private router: Router, private dataService: DataService, private http: HttpClientService) { }
  readonly dialog = inject(MatDialog);

  targetID!: string;
  partnerData!: Array<any>;
  partnerType: Array<string> = [];
  ngOnInit(): void {

    this.targetID = this.dataService.editID;

    this.http.postApi("http://localhost:8080/partner/get_partner", this.targetID)
      .subscribe((res: any) => {
        this.partnerData = [res.partner];
        this.partnerType = JSON.parse(this.partnerData[0].partnerType);
      })
  }

  return() {
    this.router.navigateByUrl('/TransformPage/partnerPage');
  }

  //檢查交易夥伴類別哪些是該被打勾的
  isChecked(type: string): boolean {
    return this.partnerType.includes(type);
  }

  select(selectValue: Event) {

    let input = selectValue.target as HTMLInputElement;
    let value = input.value;
    let checked = input.checked;

    if (checked) {
      if (!this.partnerType.includes(value)) {
        this.partnerType.push(value);
      }
    } else {
      this.partnerType = this.partnerType.filter(v => v !== value);
    }

    console.log('✅ 勾選的項目：', this.partnerType);

  }

  send() {
    //呼叫確認框
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      data: { message: "送信してもよろしいですか？" },
      width: "400px",
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result == "sure") {

        //取得現在時間
        let datePipe = new DatePipe('en-US');
        let now = new Date();
        let formattedDateTime = datePipe.transform(now, 'yyyy-MM-ddTHH:mm:ss')!;

        for (let item of this.partnerData) {
          item.updatedBy = this.dataService.employeeID;
          item.updatedAt = formattedDateTime;
          item.partnerType = JSON.stringify(this.partnerType);
        }

        let req = this.partnerData[0];

        this.http.postApi("http://localhost:8080/partner/edit_partner", req)
          .subscribe({

            next: (res: any) => {
              // 將成功訊息存儲到 sessionStorage 中
              sessionStorage.setItem('successMessage', 'データが正常に送信されました!');
              this.router.navigateByUrl('/TransformPage/partnerPage');
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
