import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { DataService } from '../@service/dataService';
import { cloneDeep } from 'lodash';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-add-re-work-order',
  imports: [CommonModule, MatIconModule, FormsModule],
  templateUrl: './add-re-work-order.component.html',
  styleUrl: './add-re-work-order.component.scss'
})
export class AddReWorkOrderComponent {
  constructor(private router: Router, private dataService: DataService) { }

  reWorkOrderID!: string;
  workOrderID: string = "";
  status: string = "待處理";
  plannedStartDate!: string;
  plannedEndDate!: string;
  actualStartDate!: string;
  actualEndDate!: string;
  createAt!: string;// 建立時間
  createClerk!: string;// 建立員工名稱
  updateAt!: string; // 更新時間
  updateClerk!: string;// 更新員工名稱



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


  targetID!: string;
  workOrderData!: Array<any>;
  reWorkOrderData!: Array<any>;
  allWorkOrderData!: Array<any>;
  allReWorkOrderData!: Array<any>;
  //讀取派工單資料
  readWorkOrder() {
    if (this.dataService.targetWorkOrderID) {
      this.targetID = this.dataService.targetWorkOrderID;

      let data = this.dataService.workOrderData.filter(item =>
        item.workOrderID == this.targetID)

      if (data.length != 0) {
        this.workOrderData = cloneDeep(data);

        let selectInfoData = this.dataService.setReWorkOrders;

        console.log(selectInfoData);

        this.infos = this.workOrderData[0].workOrderInfo.filter((item: any) =>
          selectInfoData.includes(item.workOrderDetailID)
        )

        console.log(this.infos);
        this.index = this.infos.length;
        this.workOrderID = this.dataService.targetWorkOrderID;
      }

    }
  }

  //讀取派工單資料
  readReWorkOrder() {
    if (this.dataService.targetWorkOrderID) {
      this.targetID = this.dataService.targetWorkOrderID;

      let data = this.dataService.reWorkOrderData.filter(item =>
        item.reWorkOrderID == this.targetID)

      if (data.length != 0) {
        this.reWorkOrderData = cloneDeep(data);

        let selectInfoData = this.dataService.setReWorkOrders;

        console.log(selectInfoData);

        this.infos = this.reWorkOrderData[0].reWorkOrderInfo.filter((item: any) =>
          selectInfoData.includes(item.reWorkOrderDetailID)

        )

        console.log(this.infos);
        this.index = this.infos.length;
        this.workOrderID = this.dataService.targetWorkOrderID;
      }
    }
  }

  //當選擇派工單編號時
  change(targetID: string) {
    let data = this.dataService.workOrderData.filter(item =>
      item.workOrderID == targetID
    )
    if (data.length != 0) {
      this.workOrderData = cloneDeep(data);
      this.infos = this.workOrderData[0].workOrderInfo;
      this.index = this.infos.length;
    }

    console.log(data);


    let data1 = this.dataService.reWorkOrderData.filter(item =>
      item.reWorkOrderID == targetID
    )

    console.log(data1);


    if (data1.length != 0) {
      this.reWorkOrderData = cloneDeep(data1);
      this.infos = this.reWorkOrderData[0].reWorkOrderInfo;
      this.index = this.infos.length;
    }

  }

  //明細========================================

  infos: Array<any> = []
  index!: number

  ngOnInit(): void {

    //再派工單明細資料
    let reWorkOrderData1Info = {
      reWorkOrderDetailID: null,//再派工單明細編號
      reWorkOrderID: null,//再派工單號
      materialID: null,//材料編號
      processingType: null,//加工類型

      quantity: 0,//數量
      unitPrice: 0.00,//單價
      subtotal: 0.00,//小計

      thickness: null,//厚度
      width: null,//寬度
      length: null,//長度
      weight: null,//重量
      diameter: null,//直徑
      outerDiameter: null,//外徑
      innerThickness: null,//內徑
      cuttingSize: null,//待切尺寸
      surfaceTreatment: null,//表面處理
      specification: null,//規格說明

      createAt: null,//建立時間
      createClerk: null,//建立員工名稱

      updateAt: null,//更新時間
      updateClerk: null,//更新員工名稱
    }

    this.infos.push(reWorkOrderData1Info);
    this.index = this.infos.length;

    this.readWorkOrder();
    this.readReWorkOrder();
    this.dataService.targetWorkOrderID = null;

    this.allWorkOrderData = this.dataService.workOrderData;
    this.allReWorkOrderData = this.dataService.reWorkOrderData;
  }

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
