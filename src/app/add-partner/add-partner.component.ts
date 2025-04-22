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
  selector: 'app-add-partner',
  imports: [CommonModule, MatIconModule, FormsModule],
  templateUrl: './add-partner.component.html',
  styleUrl: './add-partner.component.scss'
})
export class AddPartnerComponent {
  constructor(private router: Router, private dataService: DataService, private http: HttpClientService) { }
  readonly dialog = inject(MatDialog);

  partnerID!: string;
  partnerName!: string;
  partnerNickName!: string;
  partnerType: Array<string> = [];
  inResponse!: string;
  contactor!: string;
  phone!: string;
  cellphone!: string;
  faxNumber!: string;
  taxNumber!: string;
  address!: string;
  shipAddress!: string;
  invoiceAddress!: string;
  payment!: string;
  remark!: string;

  createAt!: string;
  createBy!: string;

  return() {
    this.router.navigateByUrl('/TransformPage/partnerPage');
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

        this.createAt = formattedDateTime;
        this.createBy = "員工A"//這邊到時會用註冊名字去寫

        let req = {
          "partnerID": this.partnerID,
          "partnerType": JSON.stringify(this.partnerType),
          "partnerName": this.partnerName,
          "partnerNickName": this.partnerNickName,
          "phone": this.phone,
          "inResponse": this.inResponse,
          "contactor": this.contactor,
          "cellphone": this.cellphone,
          "faxNumber": this.faxNumber,
          "taxNumber": this.taxNumber,
          "address": this.address,
          "shipAddress": this.shipAddress,
          "invoiceAddress": this.invoiceAddress,
          "payment": this.payment,
          "remark": this.remark,
          "createdAt": this.createAt,//要用現在時間
          "createdBy": this.createBy,
          "updatedAt": this.createAt,//要用現在時間
          "updatedBy": this.createBy,
        }

        this.http.postApi("http://localhost:8080/partner/add_partner", req)
          .subscribe({
           next:(res:any)=>{
              // 將成功訊息存儲到 sessionStorage 中
              sessionStorage.setItem('successMessage', 'データが正常に送信されました!');

              this.router.navigateByUrl('/TransformPage/partnerPage');
           },

           error:(err:any)=>{
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
