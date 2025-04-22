import { CommonModule, DatePipe } from '@angular/common';
import { Component, HostListener, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DataService } from '../@service/dataService';
import { cloneDeep } from 'lodash';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { HttpClientService } from '../@http-services/http.services';

@Component({
  selector: 'app-edit-receiving',
  imports: [CommonModule, MatIconModule, FormsModule],
  templateUrl: './edit-receiving.component.html',
  styleUrl: './edit-receiving.component.scss'
})
export class EditReceivingComponent {
  constructor(private router: Router, private dataService: DataService, private http: HttpClientService) { }
  readonly dialog = inject(MatDialog);

  targetID!: string;
  receivingData!: Array<any>;
  allPOData!: Array<any>;
  ngOnInit(): void {

    this.targetID = this.dataService.editID;

    this.http.postApi("http://localhost:8080/receiving/get_receiving", this.targetID)
      .subscribe((res: any) => {
        this.receivingData = [res.receiving];
        this.infos = this.receivingData[0].receivingInfoList
        this.index = this.infos.length;

      })
  }



  //返回
  return() {
    this.router.navigateByUrl('/TransformPage/receivingPage');
  }

  //送出
  send() {
    //呼叫確認框
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      data: { message: "送信してもよろしいですか？" },
      width: "400px",
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result == "sure") {
        let infoData = [];

        //取得現在時間
        let datePipe = new DatePipe('en-US');
        let now = new Date();
        let formattedDateTime = datePipe.transform(now, 'yyyy-MM-ddTHH:mm:ss')!;

        for (let item of this.infos) {
          infoData.push({
            "receivingDetailID": item.receivingDetailID,
            "receivingID": item.receivingID,
            "materialID": item.materialID,
            "quantityReceived": item.quantityReceived,
            "quantityAccepted": item.quantityAccepted,
            "quantityRejected": item.quantityRejected,
            "storageLocation": item.storageLocation,
            "stockStatus": item.stockStatus,
          })
        }

        for (let item of this.receivingData) {
          item.updatedBy = "員工C";
          item.updatedAt = formattedDateTime;
          item.receivingInfoList = infoData;
        }

        let req = this.receivingData[0];

        this.http.postApi("http://localhost:8080/receiving/edit_receiving", req)
          .subscribe({
            next: (res: any) => {
              // 將成功訊息存儲到 sessionStorage 中
              sessionStorage.setItem('successMessage', 'データが正常に送信されました!');

              this.clearForm();
              this.router.navigateByUrl('/TransformPage/receivingPage');
            },
            error: (err: any) => {
              console.log(err);
            }
          })
      }
    })
  }




  //清理表格
  clearForm() {

  }

  //明細========================================

  infos: Array<any> = []
  index!: number




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
