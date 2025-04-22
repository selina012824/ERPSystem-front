import { CommonModule } from '@angular/common';
import { Component, HostListener, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { DataService } from '../@service/dataService';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-re-work-order-info',
  imports: [MatIconModule, CommonModule, FormsModule],
  templateUrl: './re-work-order-info.component.html',
  styleUrl: './re-work-order-info.component.scss'
})
export class ReWorkOrderInfoComponent {
  constructor(private router: Router, private dataService: DataService) { }

  readonly dialog = inject(MatDialog);

  targetID!: string;
  reWorkOrderData!: Array<any>;


  ngOnInit(): void {
    this.targetID = this.dataService.infoID;

    let data = this.dataService.reWorkOrderData.filter(item =>
      item.reWorkOrderID == this.targetID)
    this.reWorkOrderData = data;

    this.selectItem = new Array(this.reWorkOrderData.length).fill(false);

    this.ifEndOrder();
    this.ifFinishOrder();

  }

  return() {
    this.router.navigateByUrl('/TransformPage/reWorkOrderPage');
  }

  print() {

  }

  setReWorkOrder(targetID: string) {
    this.dataService.setReWorkOrders = this.setIDs;
    this.dataService.targetWorkOrderID = targetID;
    this.router.navigateByUrl('/TransformPage/addReWorkOrderPage');
  };

  endReworkOrder(targetID: string) {
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

    console.log('目前選擇的明細ID：', this.setIDs);
  }
  //派工單終止判斷======================================================
  disabledFinishButton: Boolean = false;
  otherDisabledButton: Boolean = false;
  disabledEndButton: Boolean = false;
  ifEndOrder() {
    if (this.reWorkOrderData[0].status == "終止") {
      this.otherDisabledButton = true;
      this.disabledEndButton = true;
      this.disabledFinishButton = true;
    }
  }

  //訂單完成判斷======================================================

  ifFinishOrder() {
    if (this.reWorkOrderData[0].status == "完成") {
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
