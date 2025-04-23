import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { DataService } from '../@service/dataService';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import { FormsModule } from '@angular/forms';
import { HttpClientService } from '../@http-services/http.services';
@Component({
  selector: 'app-re-work-order',
  imports: [MatIconModule, RouterLink, RouterLinkActive, MatButtonModule, MatMenuModule, FormsModule],
  templateUrl: './re-work-order.component.html',
  styleUrl: './re-work-order.component.scss'
})
export class ReWorkOrderComponent {
  constructor(private router: Router, private dataService: DataService, private http: HttpClientService) { }

  readonly dialog = inject(MatDialog);

  //再派工單主頁呈現資訊
  reWorkOrders: {
    reWorkOrderID: string,
    workOrderID: string,
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

    //再派工單新增成功時會跳出訊息
    this.statusMessage = sessionStorage.getItem('successMessage') || '';

    // 3秒後清除訊息
    setTimeout(() => {
      sessionStorage.removeItem('successMessage');
      this.statusMessage = '';
    }, 3000);

    this.http.getApi("http://localhost:8080/reWorkOrder/get_all_reWorkOrder").subscribe({
      next: (res: any) => {
        console.log(res);

        this.reWorkOrders = [];
        for (let item of res.reWorkOrder) {
          let data = {
            reWorkOrderID: item.reWorkOrderID,
            workOrderID: item.workOrderID,
            status: item.status,
            plannedStartDate: item.plannedStartDate,
            plannedEndDate: item.plannedEndDate,
            actualStartDate: item.actualStartDate,
            actualEndDate: item.actualEndDate,
          }

          this.reWorkOrders.push(data);
        }

        this.index = this.reWorkOrders.length;
        this.totalPages = Math.ceil(this.index / this.pageSize);
        this.updatePaginatedData();
      }
    })
  }

  toInfo(targetID: string) {
    this.dataService.infoID = targetID;
    this.router.navigateByUrl('/TransformPage/reWorkOrderInfoPage');
  }

  edit(targetID: string, event: Event) {
    this.dataService.editID = targetID;
    this.router.navigateByUrl('/TransformPage/editReWorkOrderPage');
  }

  reWorkOrderID!: string;
  workOrderID!: string;
  status: string = "";
  plannedStartDateStart!: string;
  plannedEndDateStart!: string;
  plannedStartDateEnd!: string;
  plannedEndDateEnd!: string;
  search() {
    let req = {        
      "reWorkOrderID": this.reWorkOrderID,
      "workOrderID": this.workOrderID,
      "status": this.status,
      "plannedStartDateStart": this.plannedStartDateStart,
      "plannedStartDateEnd": this.plannedStartDateEnd,
      "plannedEndDateStart": this.plannedEndDateStart,
      "plannedEndDateEnd": this.plannedEndDateEnd,
    }

    this.http.postApi("http://localhost:8080/reWorkOrder/multi_search", req).subscribe({

      next: (res: any) => {
        console.log(res);

        this.reWorkOrders = [];
        for (let item of res.reWorkOrder) {
          let data = {
            reWorkOrderID: item.reWorkOrderID,
            workOrderID: item.workOrderID,
            status: item.status,
            plannedStartDate: item.plannedStartDate,
            plannedEndDate: item.plannedEndDate,
            actualStartDate: item.actualStartDate,
            actualEndDate: item.actualEndDate,
          }

          this.reWorkOrders.push(data);
        }

        this.index = this.reWorkOrders.length;
        this.totalPages = Math.ceil(this.index / this.pageSize); // 計算總頁數
        this.updatePaginatedData();
      }
    })
  }

  initializeSearchData() {
    this.reWorkOrderID = "";
    this.workOrderID = "";
    this.status = "";
    this.plannedStartDateStart = "";
    this.plannedStartDateEnd = "";
    this.plannedStartDateEnd = "";
    this.plannedEndDateEnd = "";
  }

  reset() {
    this.http.getApi("http://localhost:8080/reWorkOrder/get_all_reWorkOrder").subscribe({
      next: (res: any) => {
        console.log(res);

        this.reWorkOrders = [];
        for (let item of res.reWorkOrder) {
          let data = {
            reWorkOrderID: item.reWorkOrderID,
            workOrderID: item.workOrderID,
            status: item.status,
            plannedStartDate: item.plannedStartDate,
            plannedEndDate: item.plannedEndDate,
            actualStartDate: item.actualStartDate,
            actualEndDate: item.actualEndDate,
          }

          this.reWorkOrders.push(data);
        }

        this.index = this.reWorkOrders.length;
        this.totalPages = Math.ceil(this.index / this.pageSize);
        this.updatePaginatedData();
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
          this.http.postApi("http://localhost:8080/reWorkOrder/end_reWorkOrder", targetID).subscribe({
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

  finish(targetID: string, event: Event) {
    this.stopEvent(event);
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      data: { message: "作業を完了すると、以後は操作できなくなります。完了してもよろしいですか？" },
      width: "400px",
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result == "sure") {
        this.http.postApi("http://localhost:8080/reWorkOrder/finish_reWorkOrder", targetID).subscribe({
          next: (res: any) => {
            window.location.reload();
          }
        })
      }
    })
  }


  //防止操作按鈕觸及toInfo()方法
  stopEvent(event: Event): void {
    event.stopPropagation();
  }

  // 更新分頁資料
  updatePaginatedData(): void {
    const startIndex = this.pageIndex * this.pageSize;
    this.paginatedData = this.reWorkOrders.slice(startIndex, startIndex + this.pageSize);
  }

  // 改變分頁
  onPageChange(newPageIndex: number): void {
    if (newPageIndex >= 0 && newPageIndex < this.totalPages) {
      this.pageIndex = newPageIndex;
      this.updatePaginatedData();
    }
  }
}
