import { CommonModule } from '@angular/common';
import { Component, HostListener, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { DataService } from '../@service/dataService';
import { HttpClientService } from '../@http-services/http.services';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-work-order-info',
  imports: [MatIconModule, CommonModule, FormsModule],
  templateUrl: './work-order-info.component.html',
  styleUrl: './work-order-info.component.scss'
})
export class WorkOrderInfoComponent {

  constructor(private router: Router, private dataService: DataService, private http: HttpClientService) { }
  readonly dialog = inject(MatDialog);

  targetID!: string;
  workOrderData!: Array<any>;
  orderID!: string;
  orderDetailID!: Array<string>;

  ngOnInit(): void {
    this.targetID = this.dataService.infoID;

    this.http.postApi("http://localhost:8080/workOrder/get_workOrder", this.targetID)
      .subscribe({

        next: (res: any) => {
          this.workOrderData = [res.workOrder];
          this.orderID = this.workOrderData[0].orderID;
          this.orderDetailID = JSON.parse(this.workOrderData[0].orderDetailID);
          console.log(this.orderID);

          this.readOrder();
          this.selectItem = new Array(this.workOrderData.length).fill(false);

          this.ifEndOrder();
          this.ifFinishOrder();
        },
      })
  }

  orderData!: Array<any>;
  infos!: Array<any>;
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

  return() {

    this.router.navigateByUrl('/TransformPage/workOrderPage');
  }

  print() {

  }

  setReWorkOrder(targetID: string) {
    this.dataService.setReWorkOrders = this.setIDs;
    this.dataService.targetWorkOrderID = targetID;
    this.router.navigateByUrl('/TransformPage/addReWorkOrderPage');
  }

  end(targetID: string, targetStatus: string) {
    if (targetStatus != "中止") {
      const dialogRef = this.dialog.open(AlertDialogComponent, {
        data: { message: "この作業を中止しますか？" },
        width: "400px",
      })

      dialogRef.afterClosed().subscribe(result => {
        if (result == "sure") {
          this.http.postApi("http://localhost:8080/workOrder/end_workOrder", targetID).subscribe({
            next:(res:any)=>{
              window.location.reload();
            }
          })
        }
      })
    } else {
      const dialogRef = this.dialog.open(AlertDialogComponent, {
        data: { message: "この作業を復旧しますか？" },
        width: "400px",
      })

      dialogRef.afterClosed().subscribe(result => {
        if (result == "sure") {

        }
      })
    }
  }

  finish(targetID: string) {
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      data: { message: "作業を完了すると、以後は操作できなくなります。完了してもよろしいですか？" },
      width: "400px",
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result == "sure") {
        this.http.postApi("http://localhost:8080/workOrder/finish_workOrder", targetID).subscribe({
          next:(res:any)=>{
            window.location.reload();
          }
        })
      }
    })
  }


  //選擇事件====================================


  selectItem: boolean[] = [];
  setIDs: string[] = [];

  selectInfo(index: number, targetInfoID: string) {
    this.selectItem[index] = !this.selectItem[index];
    if (this.selectItem[index]) {
      this.setIDs.push(targetInfoID);
    } else {
      const itemIndex = this.setIDs.indexOf(targetInfoID);
      if (itemIndex !== -1) {
        this.setIDs.splice(itemIndex, 1);
      }
    }

    console.log('今選択した明細：', this.setIDs);
  }



  //派工單終止判斷======================================================
  disabledFinishButton: Boolean = false;
  otherDisabledButton: Boolean = false;
  disabledEndButton: Boolean = false;
  ifEndOrder() {
    if (this.workOrderData[0].status == "中止") {
      this.otherDisabledButton = true;
      this.disabledEndButton = true;
      this.disabledFinishButton = true;
    }
  }

  //訂單完成判斷======================================================

  ifFinishOrder() {
    console.log(this.workOrderData[0].status);

    if (this.workOrderData[0].status == "完了") {
      this.otherDisabledButton = true;
      this.disabledEndButton = true;
      this.disabledFinishButton = true;
    }
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
