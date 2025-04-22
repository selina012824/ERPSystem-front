import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { DataService } from '../@service/dataService';
import { cloneDeep } from 'lodash';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-re-work-order',
  imports: [CommonModule, MatIconModule, FormsModule],
  templateUrl: './edit-re-work-order.component.html',
  styleUrl: './edit-re-work-order.component.scss'
})
export class EditReWorkOrderComponent {
  constructor(private router: Router, private dataService: DataService) { }


  targetID!: string;
  reWorkOrderData!: Array<any>;
  allWorkOrderData!: Array<any>;
  allReWorkOrderData!: Array<any>;
  ngOnInit(): void {

    this.targetID = this.dataService.editID;

    let data = this.dataService.reWorkOrderData.filter(item =>
      item.reWorkOrderID == this.targetID)

    this.reWorkOrderData = cloneDeep(data);

    this.infos = this.reWorkOrderData[0].reWorkOrderInfo
    this.index = this.infos.length;
    this.allWorkOrderData = this.dataService.workOrderData;
    this.allReWorkOrderData = this.dataService.reWorkOrderData;
  }

  //返回
  return() {
    this.router.navigateByUrl('/TransformPage/reWorkOrderPage');
  }

  //送出
  send() {
    //呼叫確認框

    this.router.navigateByUrl('/TransformPage/reWorkOrderPage');
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



  // 當單價或數量變更時，更新該明細的小計
  updateSubtotal(item: any) {
    item.subtotal = item.unitPrice * item.quantity;
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
