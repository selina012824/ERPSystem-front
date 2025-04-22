import { Component, inject } from '@angular/core';
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
  selector: 'app-purchase-order',
  imports: [MatIconModule, RouterLink, RouterLinkActive, MatButtonModule, MatMenuModule, FormsModule],
  templateUrl: './purchase-order.component.html',
  styleUrl: './purchase-order.component.scss'
})
export class PurchaseOrderComponent {
  constructor(private router: Router, private dataService: DataService, private http: HttpClientService) { }

  readonly dialog = inject(MatDialog);




  //採購單主頁呈現資訊
  purchaseOrders: {
    purchaseOrderID: string,
    orderID: string,
    supplierID: string,
    orderDate: string,
    deliveryDate: string,
    status: string,
    isApproved: string
  }[] = [];

  purchaseOrderID!: string;
  orderID!: string;
  supplierID!: string;
  status: string = "";
  isApproved: string = "";
  orderStartDate!: string;
  orderEndDate!: string;
  deliveryStartDate!: string;
  deliveryEndDate!: string;

  index!: number;
  //換頁
  paginatedData: any[] = [];
  pageIndex: number = 0; // 當前頁數
  pageSize: number = 5;  // 每頁顯示 5 筆資料
  totalPages: number = 0; // 總頁數
  successMessage: string = '';

  ngOnInit(): void {

    //採購單新增成功時會跳出訊息
    this.successMessage = sessionStorage.getItem('successMessage') || '';

    // 3秒後清除訊息
    setTimeout(() => {
      sessionStorage.removeItem('successMessage');
      this.successMessage = '';
    }, 3000);

    this.http.getApi("http://localhost:8080/purchaseOrder/get_all_PO")
      .subscribe((res: any) => {
        console.log(res);

        for (let item of res.purchaseOrderList) {

          let data = {
            purchaseOrderID: item.purchaseOrderID,
            orderID: item.orderID,
            supplierID: item.supplierID,
            orderDate: item.orderDate,
            deliveryDate: item.deliveryDate,
            status: item.status,
            isApproved: item.isApproved
          }

          this.purchaseOrders.push(data);

        }

        this.index = this.purchaseOrders.length;
        this.totalPages = Math.ceil(this.index / this.pageSize); // 計算總頁數
        this.updatePaginatedData();

      })
  }

  inputText: string = "";

  initializeSearchData() {
    this.purchaseOrderID = "";
    this.orderID = "";
    this.supplierID = "";
    this.status = "";
    this.isApproved = "";
    this.orderStartDate = "";
    this.orderEndDate = "";
    this.deliveryStartDate = "";
    this.deliveryEndDate = "";
  }


  //多條件搜尋
  search() {

    let req = {
      "purchaseOrderID": this.purchaseOrderID,
      "orderID": this.orderID,
      "supplierID": this.supplierID,
      "status": this.status,
      "isApproved": this.isApproved,
      "orderStartDate": this.orderStartDate,
      "orderEndDate": this.orderEndDate,
      "deliveryStartDate": this.deliveryStartDate,
      "deliveryEndDate": this.deliveryEndDate,
    }


    this.http.postApi("http://localhost:8080/purchaseOrder/multi_search", req).subscribe((res: any) => {
      console.log(res);

      this.purchaseOrders = []

      for (let item of res.purchaseOrderList) {
        let data = {
          purchaseOrderID: item.purchaseOrderID,
          orderID: item.orderID,
          supplierID: item.supplierID,
          orderDate: item.orderDate,
          deliveryDate: item.deliveryDate,
          status: item.status,
          isApproved: item.isApproved
        }

        this.purchaseOrders.push(data);
      }
      this.index = this.purchaseOrders.length;
      this.totalPages = Math.ceil(this.index / this.pageSize); // 計算總頁數
      this.updatePaginatedData();
    })
  }

  toInfo(targetID: string) {
    this.dataService.infoID = targetID;
    this.router.navigateByUrl('/TransformPage/poInfoPage');
  }

  edit(targetID: string, event: Event) {
    this.stopEvent(event);
    this.dataService.editID = targetID;
    this.router.navigateByUrl('/TransformPage/editPOPage');
  }

  setReceiving(targetID: string, event: Event) {
    this.stopEvent(event);
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      data: { message: "入荷伝票を作成しますか?" },
      width: "400px",
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result == "sure") {
        this.dataService.setReceivingID = targetID;
        this.router.navigateByUrl('/TransformPage/addReceivingPage');
      }

    })
  }


  //重置
  reset() {
    this.http.getApi("http://localhost:8080/purchaseOrder/get_all_PO").subscribe((res: any) => {

      this.purchaseOrders = [];
      for (let item of res.purchaseOrderList) {

        let data = {
          purchaseOrderID: item.purchaseOrderID,
          orderID: item.orderID,
          supplierID: item.supplierID,
          orderDate: item.orderDate,
          deliveryDate: item.deliveryDate,
          status: item.status,
          isApproved: item.isApproved
        }

        this.purchaseOrders.push(data);

      }

      this.index = this.purchaseOrders.length;
      this.totalPages = Math.ceil(this.index / this.pageSize); // 計算總頁數
      this.updatePaginatedData();
    })
  }


  //防止操作按鈕觸及toInfo()方法
  stopEvent(event: Event): void {
    event.stopPropagation();
  }

  // 更新分頁資料
  updatePaginatedData(): void {
    const startIndex = this.pageIndex * this.pageSize;
    this.paginatedData = this.purchaseOrders.slice(startIndex, startIndex + this.pageSize);
  }

  // 改變分頁
  onPageChange(newPageIndex: number): void {
    if (newPageIndex >= 0 && newPageIndex < this.totalPages) {
      this.pageIndex = newPageIndex;
      this.updatePaginatedData();
    }
  }

}
