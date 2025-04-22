import { CommonModule, DatePipe } from '@angular/common';
import { Component, HostListener, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { DataService } from '../@service/dataService';
import { HttpClientService } from '../@http-services/http.services';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-add-po',
  imports: [CommonModule, MatIconModule, FormsModule],
  templateUrl: './add-po.component.html',
  styleUrl: './add-po.component.scss'
})
export class AddPOComponent {
  constructor(private router: Router, private dataService: DataService, private http: HttpClientService) { }
  readonly dialog = inject(MatDialog);


  purchaseOrderID!: string;
  orderID!: string;
  supplierID!: string;
  orderDate!: string;
  deliveryDate!: string;
  status: string = "承認待ち";
  isApproved: string = "N";
  approvedBy!: string;
  approvedAt!: string;
  subtotal: number = 0;
  tax: number = 0.00;
  totalAmount: number = 0.00;

  createAt!: string;//建立時間
  createClerk!: string;//建立員工名稱

  updateAt!: string;//更新時間
  updateClerk!: string;//更新員工名稱

  //更新合計
  subTotal: number = 0.00;
  updatedSubTotal() {
    let money = this.infos.reduce((sum, item) => sum + item.subtotal, 0);
    this.subTotal = Number(money.toFixed(2));

    this.updateTotalAmount();
  }

  updateTotalAmount() {
    this.totalAmount = this.subTotal + (this.tax || 0);
    this.totalAmount = Number(this.totalAmount.toFixed(2));
  }




  //返回
  return() {
    this.clearForm();
    this.router.navigateByUrl('/TransformPage/poPage');
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


        for (let item of this.infos) {
          infoData.push({
            "poDetailID": item.poDetailID,
            "purchaseOrderID": item.purchaseOrderID,
            "materialID": item.materialID,
            "processingType": item.processingType,
            "quantity": item.quantity,
            "unitPrice": item.unitPrice,
            "subtotal": item.subtotal,
            "thickness": item.thickness,
            "width": item.width,
            "length": item.length,
            "weight": item.weight,
            "diameter": item.diameter,
            "outerDiameter": item.outerDiameter,
            "innerThickness": item.innerThickness,
            "cuttingSize": item.cuttingSize,
            "surfaceTreatment": item.surfaceTreatment,
            "specification": item.specification,
            "createAt": this.createAt,
            "createClerkNm": this.createClerk,
            "updateAt": this.createAt,
            "updateBy": this.createClerk,
          })
        }

        let req = {
          "purchaseOrderID": this.purchaseOrderID,
          "orderID": this.orderID,
          "supplierID": this.supplierID,
          "orderDate": this.orderDate,
          "deliveryDate": this.deliveryDate,
          "status": this.status,
          "isApproved": this.isApproved,
          "approvedBy": this.approvedBy,
          "approvedAt": this.approvedAt,
          "subtotal": this.subTotal,
          "tax": this.tax,
          "totalAmount": this.totalAmount,
          "createAt": this.createAt,//要用現在時間
          "createBy": this.createClerk,
          "updateAt": this.createAt,//要用現在時間
          "updateBy": this.createClerk,
          "poInfoList": infoData,
        }

        console.log(req);
        this.http.postApi("http://localhost:8080/purchaseOrder/add_PO", req)
          .subscribe({

            next: (res: any) => {
              if (this.orderID) {
                this.http.postApi("http://localhost:8080/order/set_PO", this.orderID)
                  .subscribe((res: any) => {
                    console.log(res);
                  })
              }

              // 將成功訊息存儲到 sessionStorage 中
              sessionStorage.setItem('successMessage', 'データが正常に送信されました!');

              this.clearForm();
              this.router.navigateByUrl('/TransformPage/poPage');
            },
            error: (err: any) => {
              console.log(err);
            }



          })
      }
    })
  }




  //清理表格
  clearForm() {
    this.dataService.targetOrderID = null;
    this.dataService.setPOIDs = [];
  }

  targetID!: string;
  orderData!: Array<any>;
  allOrderData!: Array<any>;

  //讀取訂單資料
  readOrder() {
    if (this.dataService.targetOrderID) {

      let req = {
        "orderID": this.dataService.targetOrderID,
        "orderInfoIDList": this.dataService.setPOIDs
      }

      this.http.postApi("http://localhost:8080/order/get_select_order", req)
        .subscribe((res: any) => {
          console.log(res);

          this.orderData = [res.order];
          this.infos = this.orderData[0].orderInfoList;

          this.index = this.infos.length;
          this.orderID = this.orderData[0].orderID;
          this.subTotal = this.orderData[0].subtotal;
          this.tax = this.orderData[0].tax;
          this.totalAmount = this.orderData[0].totalAmount;
        })

    }
  }

  //讀取所有訂單編號
  readOrders() {
    this.http.getApi("http://localhost:8080/order/get_order_ids")
      .subscribe((res: any) => {
        console.log(res);

        this.allOrderData = res;
      })
  }

  //當選擇訂單編號時
  change(targetID: string) {
    if (targetID == "") {

      //採購單明細資料
      let poData1Info = {
        poDetailID: null,//採購單明細編號
        purchaseOrderID: null,//採購單號
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
      this.infos.push(poData1Info);

      this.orderData = [];
      this.subTotal = 0;
      this.tax = 0;
      this.totalAmount = 0;
      this.orderID = '';
      return;
    }

    this.http.postApi("http://localhost:8080/order/get__order", targetID)
      .subscribe((res: any) => {

        this.orderData = [res.order];
        this.infos = this.orderData[0].orderInfoList;

        this.index = this.infos.length;
        this.orderID = this.orderData[0].orderID;
        this.subTotal = this.orderData[0].subtotal;
        this.tax = this.orderData[0].tax;
        this.totalAmount = this.orderData[0].totalAmount;
      })

  }

  //明細========================================

  infos: Array<any> = []
  index!: number

  ngOnInit(): void {

    //採購單明細資料
    let poData1Info = {
      poDetailID: null,//採購單明細編號
      purchaseOrderID: null,//採購單號
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

    this.infos.push(poData1Info);
    this.index = this.infos.length;

    this.readOrders();
    this.readOrder();
    this.dataService.targetOrderID = null;
    this.allOrderData = this.dataService.orderData;
  }



  add() {
    //採購單明細資料
    let poData1Info = {
      poDetailID: null,//採購單明細編號
      purchaseOrderID: null,//採購單號
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

    this.infos.push(poData1Info);
    this.index = this.infos.length;
  }


  delete(index: number) {
    this.infos.splice(index, 1);
    this.index = this.infos.length;
  }

  updateSubtotal(item: any) {
    item.subtotal = item.unitPrice * item.quantity;
    if (item.subtotal % 1 != 0) {
      item.subtotal = Number(item.subtotal.toFixed(2));
    }

    this.updatedSubTotal();
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
