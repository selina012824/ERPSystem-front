import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { PoFilterComponent } from '../po-filter/po-filter.component';
import { WorkOrderFilterComponent } from '../work-order-filter/work-order-filter.component';
import { DataService } from '../@service/dataService';
import { FormsModule } from '@angular/forms';
import { HttpClientService } from '../@http-services/http.services';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-work-order',
  imports: [MatIconModule, RouterLink, RouterLinkActive, MatButtonModule, MatMenuModule, FormsModule, CommonModule],
  templateUrl: './work-order.component.html',
  styleUrl: './work-order.component.scss'
})
export class WorkOrderComponent {
  constructor(private router: Router, private dataService: DataService, private http: HttpClientService) { }

  readonly dialog = inject(MatDialog);

  //派工單主頁呈現資訊
  workOrders: {
    workOrderID: string,
    orderID: string,
    status: string,
    plannedStartDate: string,
    plannedEndDate: string,
    actualStartDate: string,
    actualEndDate: string,
  }[] = [];

  index!: number;

  //換頁
  paginatedData: any[] = [];
  pageIndex: number = 0; // 當前頁數
  pageSize: number = 5;  // 每頁顯示 5 筆資料
  totalPages: number = 0; // 總頁數

  statusMessage: string = '';
  ngOnInit(): void {

    //派工單新增成功時會跳出訊息
    this.statusMessage = sessionStorage.getItem('successMessage') || '';

    // 3秒後清除訊息
    setTimeout(() => {
      sessionStorage.removeItem('successMessage');
      this.statusMessage = '';
    }, 3000);

    this.http.getApi("http://localhost:8080/workOrder/get_all_workOrder").subscribe({
      next: (res: any) => {
        console.log(res);

        this.workOrders = [];
        for (let item of res.workOrder) {
          let data = {
            workOrderID: item.workOrderID,
            orderID: item.orderID,
            status: item.status,
            plannedStartDate: item.plannedStartDate,
            plannedEndDate: item.plannedEndDate,
            actualStartDate: item.actualStartDate,
            actualEndDate: item.actualEndDate,
          }

          this.workOrders.push(data);
        }

        this.index = this.workOrders.length;
        this.totalPages = Math.ceil(this.index / this.pageSize);
        this.updatePaginatedData();
      }
    })
  }

  workOrderID!: string;
  orderID!: string;
  status: string = "";
  plannedStartDateStart!: string;
  plannedEndDateStart!: string;
  plannedStartDateEnd!: string;
  plannedEndDateEnd!: string;
  search() {

    let req = {
      "workOrderID": this.workOrderID,
      "orderID": this.orderID,
      "status": this.status,
      "plannedStartDateStart": this.plannedStartDateStart,
      "plannedStartDateEnd": this.plannedStartDateEnd,
      "plannedEndDateStart": this.plannedEndDateStart,
      "plannedEndDateEnd": this.plannedEndDateEnd,
    }

    this.http.postApi("http://localhost:8080/workOrder/multi_search", req).subscribe({

      next: (res: any) => {
        console.log(res);

        this.workOrders = [];
        for (let item of res.workOrder) {
          let data = {
            workOrderID: item.workOrderID,
            orderID: item.orderID,
            status: item.status,
            plannedStartDate: item.plannedStartDate,
            plannedEndDate: item.plannedEndDate,
            actualStartDate: item.actualStartDate,
            actualEndDate: item.actualEndDate,
          }

          this.workOrders.push(data);
        }

        this.index = this.workOrders.length;
        this.totalPages = Math.ceil(this.index / this.pageSize); // 計算總頁數
        this.updatePaginatedData();
      }
    })

  }

  initializeSearchData() {
    this.workOrderID = "";
    this.orderID = "";
    this.status = "";
    this.plannedStartDateStart = "";
    this.plannedStartDateEnd = "";
    this.plannedStartDateEnd = "";
    this.plannedEndDateEnd = "";
  }

  reset() {
    this.http.getApi("http://localhost:8080/workOrder/get_all_workOrder").subscribe({
      next: (res: any) => {
        console.log(res);

        this.workOrders = [];
        for (let item of res.workOrder) {
          let data = {
            workOrderID: item.workOrderID,
            orderID: item.orderID,
            status: item.status,
            plannedStartDate: item.plannedStartDate,
            plannedEndDate: item.plannedEndDate,
            actualStartDate: item.actualStartDate,
            actualEndDate: item.actualEndDate,
          }

          this.workOrders.push(data);
        }

        this.index = this.workOrders.length;
        this.totalPages = Math.ceil(this.index / this.pageSize);
        this.updatePaginatedData();
      }
    })
  }

  toInfo(targetID: string) {
    this.dataService.infoID = targetID;
    this.router.navigateByUrl('/TransformPage/workOrderInfoPage');
  }

  edit(targetID: string, event: Event) {
    this.dataService.editID = targetID;
    this.router.navigateByUrl('/TransformPage/editWorkOrderPage');
  }

  finish(targetID: string, event: Event) {
    this.stopEvent(event);
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      data: { message: "作業を完了すると、以後は操作できなくなります。完了してもよろしいですか？" },
      width: "400px",
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result == "sure") {
        this.http.postApi("http://localhost:8080/workOrder/finish_workOrder", targetID).subscribe({
          next: (res: any) => {
            window.location.reload();
          }
        })
      }
    })
  }

  end(targetID: string, targetStatus: string, event: Event) {
    this.stopEvent(event);
    if (targetStatus != "中止") {
      const dialogRef = this.dialog.open(AlertDialogComponent, {
        data: { message: "この作業を中止しますか？" },
        width: "400px",
      })

      dialogRef.afterClosed().subscribe(result => {
        if (result == "sure") {
          this.http.postApi("http://localhost:8080/workOrder/end_workOrder", targetID).subscribe({
            next: (res: any) => {
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


  //防止操作按鈕觸及toInfo()方法
  stopEvent(event: Event): void {
    event.stopPropagation();
  }

  // 更新分頁資料
  updatePaginatedData(): void {
    const startIndex = this.pageIndex * this.pageSize;
    this.paginatedData = this.workOrders.slice(startIndex, startIndex + this.pageSize);
  }

  // 改變分頁
  onPageChange(newPageIndex: number): void {
    if (newPageIndex >= 0 && newPageIndex < this.totalPages) {
      this.pageIndex = newPageIndex;
      this.updatePaginatedData();
    }
  }
}
