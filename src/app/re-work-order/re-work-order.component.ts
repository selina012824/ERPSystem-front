import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { DataService } from '../@service/dataService';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-re-work-order',
  imports: [MatIconModule, RouterLink, RouterLinkActive, MatButtonModule, MatMenuModule, FormsModule],
  templateUrl: './re-work-order.component.html',
  styleUrl: './re-work-order.component.scss'
})
export class ReWorkOrderComponent {
  constructor(private router: Router, private dataService: DataService) { }

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

    for (let item of this.dataService.reWorkOrderData) {

      let data = {
        reWorkOrderID: item.reWorkOrderID,
        workOrderID: item.workOrderID,
        status: item.status,
        plannedStartDate: item.plannedStartDate,
        plannedEndDate: item.plannedEndDate,
        actualStartDate: item.actualStartDate,
        actualEndDate: item.actualEndDate
      }
      this.reWorkOrders.push(data);
    }
    this.index = this.reWorkOrders.length;
    this.updatePaginatedData();
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

  }

  initializeSearchData() {

  }

  reset() {

  }

  end(targetID: string, targetStatus: string, event: Event) {
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      data: { message: "確認終止此再派工單嗎?" },
      height: "35%",
      width: "25%",
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result == "sure") {


      }
    })
  }

  finish(targetID: string, event: Event) {

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
