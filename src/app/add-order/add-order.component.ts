import { CommonModule, DatePipe } from '@angular/common';
import { Component, HostListener, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { DataService } from '../@service/dataService';
import { HttpClientService } from '../@http-services/http.services';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CustomerFilterComponent } from '../customer-filter/customer-filter.component';

@Component({
  selector: 'app-add-order',
  imports: [CommonModule, MatIconModule, FormsModule],
  templateUrl: './add-order.component.html',
  styleUrl: './add-order.component.scss'
})
export class AddOrderComponent {

  constructor(private router: Router, private dataService: DataService, private http: HttpClientService) { }
  readonly dialog = inject(MatDialog);

  orderID!: string;//訂單編號
  estScrapID!: string;//預估廢料編號
  customerID!: string;//客戶編號
  orderDate!: string;//訂單成立日期
  deliveryDate!: string;//預計交期
  status!: string;//狀態(會有終止、完成、待處理、等待派工、派工中、派工終止、派工完成、等待再派工、再派工中、再派工終止、再派工完成、等待出貨、出貨中)
  subTotal: number = 0.00;
  tax: number = 0.00;
  totalAmount: number = 0.00;  //總金額
  paymentTerms!: string;//付款條件
  createAt!: string;//建立時間
  createClerk!: string;//建立員工名稱

  updateAt!: string;//更新時間
  updateClerk!: string;//更新員工名稱


  //更新合計
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
    this.router.navigateByUrl('/TransformPage/orderPage');
  }

  //選擇交易夥伴(跳到dialog視窗)
  selectCustomer() {
    const dialogRef = this.dialog.open(CustomerFilterComponent, {
      width: '80vw',
      maxWidth: '100vw',
      height: '90vh',
      panelClass: 'custom-dialog'
    })

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);

      if (result) {
        this.http.postApi("http://localhost:8080/partner/get_partner", result)
          .subscribe((res: any) => {
            console.log(res);
            this.customerID = res.partner.partnerID;
            this.paymentTerms = res.partner.payment
          })
      }
    })
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
            "orderDetailID": item.orderDetailID,
            "orderID": item.orderID,
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
          "orderID": this.orderID,
          "estScrapID": this.estScrapID,
          "customerID": this.customerID,
          "orderDate": this.orderDate,
          "deliveryDate": this.deliveryDate,
          "status": "処理待ち",
          "subtotal": this.subTotal,
          "tax": this.tax,
          "totalAmount": this.totalAmount,
          "payment": this.paymentTerms,
          "createAt": this.createAt,//要用現在時間
          "createBy": this.createClerk,
          "updateAt": this.createAt,//要用現在時間
          "updateBy": this.createClerk,
          "orderInfoList": infoData,
        }

        console.log(req);
        this.http.postApi("http://localhost:8080/order/add_order", req)
          .subscribe({
            next: (res: any) => {
              if (this.dataService.setOrderID) {
                this.http.postApi("http://localhost:8080/quotation/set_order", this.dataService.setOrderID)
                  .subscribe((res: any) => {
                    console.log(res);
                  })
              }

              // 將成功訊息存儲到 sessionStorage 中
              sessionStorage.setItem('successMessage', 'データが正常に送信されました!');

              this.clearForm();
              this.router.navigateByUrl('/TransformPage/orderPage');
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
    this.dataService.setOrderID = null;
  }


  targetID!: string;
  quotationData!: Array<any>;

  //讀取報價單資料
  readQuotation() {
    if (this.dataService.setOrderID) {
      let req = this.dataService.setOrderID

      this.http.postApi("http://localhost:8080/quotation/get__quotation", req).subscribe((res: any) => {

        console.log(res);

        this.quotationData = [res.quotation];
        this.infos = this.quotationData[0].quotationInfoList;
        this.index = this.infos.length;

        this.customerID = this.quotationData[0].customerID
        this.paymentTerms = this.quotationData[0].payment;
        this.tax = this.quotationData[0].tax
        this.subTotal = this.quotationData[0].subtotal
        this.totalAmount = this.quotationData[0].totalAmount
      })
    }
  }


  //明細========================================

  infos: Array<any> = []
  index!: number

  ngOnInit(): void {

    this.infos = [];

    //報價單明細資料
    let orderData1Info = {
      orderDetailID: null,//訂單明細編號
      orderID: null,//訂單編號
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

    this.infos.push(orderData1Info);
    this.index = this.infos.length;

    this.readQuotation();

  }



  add() {
    //訂單明細資料
    let orderData1Info = {
      orderDetailID: null,//報價單明細編號
      orderID: null,//報價單號
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

    this.infos.push(orderData1Info);
    this.index = this.infos.length;
  }


  delete(index: number) {
    this.infos.splice(index, 1);
    this.index = this.infos.length;
    this.updatedSubTotal();
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
