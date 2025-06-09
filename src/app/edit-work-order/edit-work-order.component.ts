import { CommonModule, DatePipe } from '@angular/common';
import { Component, HostListener, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { DataService } from '../@service/dataService';
import { cloneDeep } from 'lodash';
import { FormsModule } from '@angular/forms';
import { HttpClientService } from '../@http-services/http.services';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-edit-work-order',
  imports: [CommonModule, MatIconModule, FormsModule],
  templateUrl: './edit-work-order.component.html',
  styleUrl: './edit-work-order.component.scss'
})
export class EditWorkOrderComponent {

  constructor(private router: Router, private dataService: DataService, private http: HttpClientService) { }
  readonly dialog = inject(MatDialog);

  targetID!: string;
  workOrderData!: Array<any>;
  orderDetailID!: Array<any>;
  orderID!: string;
  ngOnInit(): void {

    this.http.postApi("http://localhost:8080/workOrder/get_workOrder", this.dataService.editID)
      .subscribe({

        next: (res: any) => {
          this.workOrderData = [res.workOrder];
          this.orderID = this.workOrderData[0].orderID;
          this.orderDetailID = JSON.parse(this.workOrderData[0].orderDetailID);
          console.log(this.orderID);

          this.readOrder();
        },
      })
  }



  //返回
  return() {
    this.router.navigateByUrl('/TransformPage/workOrderPage');
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

        //取得現在時間
        let datePipe = new DatePipe('en-US');
        let now = new Date();
        let formattedDateTime = datePipe.transform(now, 'yyyy-MM-ddTHH:mm:ss')!;


        for (let item of this.workOrderData) {
          item.updatedBy = this.dataService.employeeID;
          item.updatedAt = formattedDateTime;
        }

        let req = this.workOrderData[0];

        this.http.postApi("http://localhost:8080/workOrder/edit_workOrder", req)
          .subscribe({
            next: (res) => {
              // 將成功訊息存儲到 sessionStorage 中
              sessionStorage.setItem('successMessage', 'データが正常に送信されました!');
              this.router.navigateByUrl('/TransformPage/workOrderPage');
            },

            error: (err) => {
              console.log(err);
            }
          })
      }
    })
  }

  orderData!: Array<any>;
  //讀取訂單明細資料
  readOrder() {

    if (this.orderID) {
      let req = {
        "orderID": this.orderID,
        "orderInfoIDList": this.orderDetailID
      }
      this.http.postApi("http://localhost:8080/order/get_select_order", req)
        .subscribe((res: any) => {
          console.log(res);

          this.orderData = [res.order];
          this.infos = this.orderData[0].orderInfoList;
        })

    }
  }


  //清理表格
  clearForm() {

  }

  //明細========================================

  infos: Array<any> = [];
  index!: number;


  delete(index: number) {
    this.infos.splice(index, 1);
    this.index = this.infos.length;
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
