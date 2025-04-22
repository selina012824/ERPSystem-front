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
  selector: 'app-receiving',
  imports: [MatIconModule, MatButtonModule, MatMenuModule, FormsModule],
  templateUrl: './receiving.component.html',
  styleUrl: './receiving.component.scss'
})
export class ReceivingComponent {
  constructor(private router: Router, private dataService: DataService, private http: HttpClientService) { }

  readonly dialog = inject(MatDialog);

  //進貨單主頁呈現資訊
  receivings: {
    receivingID: string,
    purchaseOrderID: string,
    receivingDate: string,
    status: string,
    inspectionResult: string,
    supplierID: string,
  }[] = [];

  index!: number;

  //換頁
  paginatedData: any[] = [];
  pageIndex: number = 0; // 當前頁數
  pageSize: number = 5;  // 每頁顯示 5 筆資料
  totalPages: number = 0; // 總頁數

  successMessage: string = '';

  ngOnInit(): void {
    //進貨單新增成功時會跳出訊息
    this.successMessage = sessionStorage.getItem('successMessage') || '';

    // 3秒後清除訊息
    setTimeout(() => {
      sessionStorage.removeItem('successMessage');
      this.successMessage = '';
    }, 3000);

    this.http.getApi("http://localhost:8080/receiving/get_all_receiving").subscribe((res: any) => {
      console.log(res);

      this.receivings = []
      for (let item of res.receivingList) {
        let data = {
          receivingID: item.receivingID,
          purchaseOrderID: item.purchaseOrderID,
          receivingDate: item.receivingDate,
          status: item.status,
          inspectionResult: item.inspectionResult,
          supplierID: item.supplierID
        }

        this.receivings.push(data);
      }
      this.index = this.receivings.length;
      this.totalPages = Math.ceil(this.index / this.pageSize); // 計算總頁數
      this.updatePaginatedData();
    })

  }


  toInfo(targetID: string) {
    this.dataService.infoID = targetID;
    this.router.navigateByUrl('/TransformPage/receivingInfoPage');
  }

  edit(targetID: string, event: Event, status: string) {
    this.stopEvent(event);
    if (status == '完了') {
      return;
    }
    this.dataService.editID = targetID;
    this.router.navigateByUrl('/TransformPage/editReceivingPage');
  }

  finishReceiving(targetID: string) {
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      data: { message: "入荷を完了しますか？" },
      width: "400px",
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result == "sure") {


      }
    })
  }

  receivingID!: string;
  purchaseOrderID!: string;
  supplierID!: string;
  receivingStartDate!: string;
  receivingEndDate!: string;
  status: string = "";
  inspectionResult: string = "";

  //搜索
  search() {

    let req = {
      "receivingID": this.receivingID,
      "purchaseOrderID": this.purchaseOrderID,
      "supplierID": this.supplierID,
      "receivingStartDate": this.receivingStartDate,
      "receivingEndDate": this.receivingEndDate,
      "status": this.status,
      "inspectionResult": this.inspectionResult,
    }

    this.http.postApi("http://localhost:8080/receiving/multi_search", req).subscribe((res: any) => {
      this.receivings = []
      for (let item of res.receivingList) {
        let data = {
          receivingID: item.receivingID,
          purchaseOrderID: item.purchaseOrderID,
          receivingDate: item.receivingDate,
          status: item.status,
          inspectionResult: item.inspectionResult,
          supplierID: item.supplierID
        }

        this.receivings.push(data);
      }
      this.index = this.receivings.length;
      this.totalPages = Math.ceil(this.index / this.pageSize); // 計算總頁數
      this.updatePaginatedData();
    })
  }

  //重置搜尋欄
  initializeSearchData() {
    this.receivingID = "";
    this.purchaseOrderID = "";
    this.supplierID = "";
    this.receivingStartDate = "";
    this.receivingEndDate = "";
    this.status = "";
    this.inspectionResult = "";
  }

  //重置
  reset() {
    this.http.getApi("http://localhost:8080/receiving/get_all_receiving").subscribe((res: any) => {
      console.log(res);

      this.receivings = []
      for (let item of res.receivingList) {
        let data = {
          receivingID: item.receivingID,
          purchaseOrderID: item.purchaseOrderID,
          receivingDate: item.receivingDate,
          status: item.status,
          inspectionResult: item.inspectionResult,
          supplierID: item.supplierID
        }

        this.receivings.push(data);
      }
      this.index = this.receivings.length;
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
    this.paginatedData = this.receivings.slice(startIndex, startIndex + this.pageSize);
  }

  // 改變分頁
  onPageChange(newPageIndex: number): void {
    if (newPageIndex >= 0 && newPageIndex < this.totalPages) {
      this.pageIndex = newPageIndex;
      this.updatePaginatedData();
    }
  }
}
