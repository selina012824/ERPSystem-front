import { CommonModule, DatePipe } from '@angular/common';
import { Component, HostListener, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { DataService } from '../@service/dataService';
import { cloneDeep } from 'lodash';
import { FormsModule } from '@angular/forms';
import { HttpClientService } from '../@http-services/http.services';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-add-re-work-order',
  imports: [CommonModule, MatIconModule, FormsModule],
  templateUrl: './add-re-work-order.component.html',
  styleUrl: './add-re-work-order.component.scss'
})
export class AddReWorkOrderComponent {
  constructor(private router: Router, private dataService: DataService, private http: HttpClientService) { }
  readonly dialog = inject(MatDialog);

  reWorkOrderID!: string;
  workOrderID: string = "";
  status: string = "処理待ち";
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
    this.clearForm();
    this.router.navigateByUrl('/TransformPage/reWorkOrderPage');
  }

  //送出
  send() {
    //呼叫確認框
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      data: { message: "送信してもよろしいですか？" },
      width: "400px",
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result == "sure") {
        let infoData = [];

        //取得現在時間
        let datePipe = new DatePipe('en-US');
        let now = new Date();
        let formattedDateTime = datePipe.transform(now, 'yyyy-MM-ddTHH:mm:ss')!;

        this.createAt = formattedDateTime;
        this.createClerk = "員工A"//這邊到時會用註冊名字去寫

        let orderDetailID = [];
        for (let item of this.infos) {
          orderDetailID.push(item.orderDetailID);
        }

        let req = {
          "reWorkOrderID": this.reWorkOrderID,
          "workOrderID": this.workOrderID,
          "orderDetailID": JSON.stringify(orderDetailID),
          "status": this.status,
          "plannedStartDate": this.plannedStartDate,
          "plannedEndDate": this.plannedEndDate,
          "actualStartDate": this.actualStartDate,
          "actualEndDate": this.actualEndDate,
          "createdAt": this.createAt,
          "createdBy": this.createClerk,
          "updatedAt": this.createAt,
          "updatedBy": this.createClerk,
        }
        this.http.postApi("http://localhost:8080/reWorkOrder/add_reWorkOrder", req)
          .subscribe({
            next: (res) => {
              this.clearForm();
              // 將成功訊息存儲到 sessionStorage 中
              sessionStorage.setItem('successMessage', 'データが正常に送信されました!');
              this.router.navigateByUrl('/TransformPage/reWorkOrderPage');
            },

            error: (err) => {
              console.log(err);
            }
          })
      }
    })
  }
  //清理表格
  clearForm() {
    this.dataService.targetWorkOrderID = null;
    this.dataService.setReWorkOrders = [];
  }


  targetID!: string;
  workOrderData!: Array<any>;
  reWorkOrderData!: Array<any>;
  allWorkOrderData!: Array<any>;
  allReWorkOrderData!: Array<any>;


  //讀取所有派工單編號
  readWorkOrders() {
    this.http.getApi("http://localhost:8080/workOrder/get_workOrder_id")
      .subscribe({
        next: (res: any) => {
          this.allWorkOrderData = res;
        }
      })
  }

  //讀取所有再派工單編號
  readReWorkOrders() {
    this.http.getApi("http://localhost:8080/reWorkOrder/get_reWorkOrder_id")
      .subscribe({
        next: (res: any) => {
          this.allReWorkOrderData = res;
        }
      })
  }

  //讀取派工單資料
  readWorkOrder() {
    if (this.dataService.targetWorkOrderID) {
      this.http.postApi("http://localhost:8080/workOrder/get_workOrder", this.dataService.targetWorkOrderID)
        .subscribe((res: any) => {
          console.log(res);

          this.workOrderData = [res.workOrder];
          this.workOrderID = this.workOrderData[0].workOrderID;
          let orderID = this.workOrderData[0].orderID;
          let req = {
            "orderID": orderID,
            "orderInfoIDList": this.dataService.setReWorkOrders
          }
          console.log(req);

          this.http.postApi("http://localhost:8080/order/get_select_order", req)
            .subscribe((res: any) => {
              console.log(res);

              let orderData = [res.order];
              this.infos = orderData[0].orderInfoList;

              this.index = this.infos.length;
            })
        })
    }
  }

  //讀取再派工單資料
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
    if (targetID == "") {
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
      this.infos = [];
      this.infos.push(reWorkOrderData1Info);
      return;
    }


    this.http.postApi("http://localhost:8080/workOrder/get_workOrder", targetID)
      .subscribe({
        next: (res: any) => {
          this.reWorkOrderData = [res.workOrder];
          let orderID = this.reWorkOrderData[0].orderID;
          let orderDetailIDs = this.reWorkOrderData[0].orderDetailID;
          let req = {
            "orderID": orderID,
            "orderInfoIDList": JSON.parse(orderDetailIDs)
          }
          console.log(req);

          this.http.postApi("http://localhost:8080/order/get_select_order", req)
            .subscribe((res: any) => {
              console.log(res);

              let orderData = [res.order];
              this.infos = orderData[0].orderInfoList;

              this.index = this.infos.length;

            })
        }
      })

    this.http.postApi("http://localhost:8080/reWorkOrder/get_reWorkOrder", targetID)
      .subscribe({
        next: (res: any) => {
          this.workOrderData = [res.reWorkOrder];
          let orderID = this.workOrderData[0].orderID;
          let orderDetailIDs = this.workOrderData[0].orderDetailID;
          let req = {
            "orderID": orderID,
            "orderInfoIDList": JSON.parse(orderDetailIDs)
          }
          console.log(req);

          this.http.postApi("http://localhost:8080/order/get_select_order", req)
            .subscribe((res: any) => {
              console.log(res);

              let orderData = [res.order];
              this.infos = orderData[0].orderInfoList;

              this.index = this.infos.length;

            })
        }
      })


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



    this.readWorkOrders();
    this.readReWorkOrders();
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
