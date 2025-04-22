import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { DataService } from '../@service/dataService';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import { HttpClientService } from '../@http-services/http.services';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-order',
  imports: [MatIconModule, RouterLink, RouterLinkActive, MatButtonModule, MatMenuModule, FormsModule, CommonModule],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss'
})
export class OrderComponent {

  constructor(private router: Router, private dataService: DataService, private http: HttpClientService) { }

  readonly dialog = inject(MatDialog);



  //訂單主頁呈現資訊
  orders: {
    orderID: string;
    estScrapID: string;
    customerID: string;
    orderDate: string;
    deliveryDate: string;
    totalAmount: number;
    status: string;
  }[] = [];


  //共有幾筆資料
  index!: number;

  //換頁
  paginatedData: any[] = [];
  pageIndex: number = 0; // 當前頁數
  pageSize: number = 5;  // 每頁顯示 5 筆資料
  totalPages: number = 0; // 總頁數
  successMessage!: string;

  ngOnInit(): void {

    //訂單新增成功時會跳出訊息
    this.successMessage = sessionStorage.getItem('successMessage') || '';

    // 3秒後清除訊息
    setTimeout(() => {
      sessionStorage.removeItem('successMessage');
      this.successMessage = '';
    }, 3000);

    this.dataService.setOrderID = null;

    this.http.getApi("http://localhost:8080/order/get_all_order").subscribe((res: any) => {

      for (let item of res.orderList) {

        let data = {
          orderID: item.orderID,
          estScrapID: item.estScrapID,
          customerID: item.customerID,
          orderDate: item.orderDate,
          deliveryDate: item.deliveryDate,
          totalAmount: item.totalAmount,
          status: item.status
        }

        this.orders.push(data);

      }

      this.index = this.orders.length;
      this.totalPages = Math.ceil(this.index / this.pageSize); // 計算總頁數
      this.updatePaginatedData();
    })


  }

  toInfo(targetID: string) {
    this.dataService.infoID = targetID;
    this.router.navigateByUrl('/TransformPage/orderInfoPage');
  }

  edit(targetID: string, event: Event) {
    this.stopEvent(event);
    this.dataService.editID = targetID;
    this.router.navigateByUrl('/TransformPage/editOrderPage');
  }

  //多條件搜尋
  orderID!: string;
  estScrapID!: string;
  customerID!: string;
  status: string = "";
  orderStartDate!: string;
  orderEndDate!: string;
  deliveryStartDate!: string;
  deliveryEndDate!: string;

  search() {

    let req = {
      "orderID": this.orderID,
      "estScrapID": this.estScrapID,
      "customerID": this.customerID,
      "status": this.status,
      "orderStartDate": this.orderStartDate,
      "orderEndDate": this.orderEndDate,
      "deliveryStartDate": this.deliveryStartDate,
      "deliveryEndDate": this.deliveryEndDate,
    }

    this.http.postApi("http://localhost:8080/order/multi_search", req).subscribe((res: any) => {
      this.orders = [];

      for (let item of res.orderList) {

        let data = {
          orderID: item.orderID,
          estScrapID: item.estScrapID,
          customerID: item.customerID,
          orderDate: item.orderDate,
          deliveryDate: item.deliveryDate,
          totalAmount: item.totalAmount,
          status: item.status
        }

        this.orders.push(data);

      }

      this.index = this.orders.length;
      this.totalPages = Math.ceil(this.index / this.pageSize); // 計算總頁數
      this.updatePaginatedData();
    })
  }


  initializeSearchData() {
    this.orderID = "";
    this.estScrapID = "";
    this.customerID = "";
    this.status = "";
    this.orderStartDate = "";
    this.orderEndDate = "";
    this.deliveryStartDate = "";
    this.deliveryEndDate = "";
  }

  //重置
  reset() {
    this.http.getApi("http://localhost:8080/order/get_all_order").subscribe((res: any) => {
      this.orders = [];

      for (let item of res.orderList) {

        let data = {
          orderID: item.orderID,
          estScrapID: item.estScrapID,
          customerID: item.customerID,
          orderDate: item.orderDate,
          deliveryDate: item.deliveryDate,
          totalAmount: item.totalAmount,
          status: item.status
        }

        this.orders.push(data);

      }

      this.index = this.orders.length;
      this.totalPages = Math.ceil(this.index / this.pageSize); // 計算總頁數
      this.updatePaginatedData();
    })
  }

  finishOrder(targetID: string, event: Event) {
    this.stopEvent(event);
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      data: { message: "注文を完了すると、以後は操作できなくなります。完了してもよろしいですか？" },
      width: "400px",
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result == "sure") {
        this.http.postApi("http://localhost:8080/order/finish_order", targetID).subscribe({
          next: (res: any) => {
            window.location.reload();
          }
        })
      }
    })
  }

  endOrder(targetID: string, targetStatus: string, event: Event) {
    this.stopEvent(event);
    if (targetStatus != "中止") {
      const dialogRef = this.dialog.open(AlertDialogComponent, {
        data: { message: "この注文を中止しますか？" },
        width: "400px",
      })

      dialogRef.afterClosed().subscribe(result => {
        if (result == "sure") {
          this.http.postApi("http://localhost:8080/order/end_order", targetID).subscribe({
            next: (res: any) => {
              window.location.reload();
            }
          })
        }
      })
    } else {
      const dialogRef = this.dialog.open(AlertDialogComponent, {
        data: { message: "この注文を復旧しますか？" },
        width: "400px",
      })

      dialogRef.afterClosed().subscribe(result => {
        if (result == "sure") {

        }
      })
    }


  }


  //防止操作按鈕觸及toInfo()方法
  stopEvent(event: Event): void {
    event.stopPropagation();
  }



  // 更新分頁資料
  updatePaginatedData(): void {
    const startIndex = this.pageIndex * this.pageSize;
    this.paginatedData = this.orders.slice(startIndex, startIndex + this.pageSize);
  }

  // 改變分頁
  onPageChange(newPageIndex: number): void {
    if (newPageIndex >= 0 && newPageIndex < this.totalPages) {
      this.pageIndex = newPageIndex;
      this.updatePaginatedData();
    }
  }
}
