import { CommonModule, DatePipe } from '@angular/common';
import { Component, HostListener, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { DataService } from '../@service/dataService';
import { FormsModule } from '@angular/forms';
import { HttpClientService } from '../@http-services/http.services';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-po',
  imports: [CommonModule, MatIconModule, FormsModule],
  templateUrl: './edit-po.component.html',
  styleUrl: './edit-po.component.scss'
})
export class EditPOComponent {
  constructor(private router: Router, private dataService: DataService, private http: HttpClientService) { }
  readonly dialog = inject(MatDialog);

  targetID!: string;
  poData!: Array<any>;

  ngOnInit(): void {

    this.http.postApi("http://localhost:8080/purchaseOrder/get_PO", this.dataService.editID)
      .subscribe((res: any) => {
        this.poData = [res.purchaseOrder];

        this.infos = this.poData[0].poInfoList;
        this.index = this.infos.length;
        this.subTotal = this.poData[0].subtotal;
        this.totalAmount = this.poData[0].totalAmount;
      })

    this.allOrderData = this.dataService.orderData;
  }


  subTotal: number = 0.00;
  //更新合計
  updatedSubTotal() {
    let money = this.infos.reduce((sum, item) => sum + item.subtotal, 0);
    this.subTotal = Number(money.toFixed(2));

    this.updateTotalAmount();
  }

  totalAmount: number = 0.00
  updateTotalAmount() {
    this.totalAmount = this.subTotal + this.poData[0].tax;
    this.totalAmount = Number(this.totalAmount.toFixed(2));
  }


  //返回
  return() {
    this.router.navigateByUrl('/TransformPage/poPage');
  }

  //送出
  send() {
    //呼叫確認框
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      data: { message: "送信してもよろしいですか？?" },
      height: "35%",
      width: "25%",
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result == "sure") {
        let infoData = [];

        //取得現在時間
        let datePipe = new DatePipe('en-US');
        let now = new Date();
        let formattedDateTime = datePipe.transform(now, 'yyyy-MM-ddTHH:mm:ss')!;

        for (let item of this.infos) {
          infoData.push({
            "poDetailID": item.poDetailID,
            "purchaseOrderID": this.poData[0].purchaseOrderID,
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
            "createAt": this.poData[0].createAt,
            "createClerkNm": this.poData[0].createBy,
            "updateAt": formattedDateTime,
            "updateBy": this.dataService.employeeID,
          })
        }

        for (let item of this.poData) {
          item.updateBy = this.dataService.employeeID;
          item.updateAt = formattedDateTime;
          item.poInfoList = infoData;
          item.subtotal = this.subTotal;
          item.totalAmount = this.totalAmount;
        }

        let req = this.poData[0];

        this.http.postApi("http://localhost:8080/purchaseOrder/edit_PO", req)
          .subscribe({


            next: (res: any) => {
              // 將成功訊息存儲到 sessionStorage 中
              sessionStorage.setItem('successMessage', 'データが正常に送信されました');
              this.router.navigateByUrl('/TransformPage/poPage');
            },
            error: (err: any) => {
              console.log(err);
            }
          })
      }
    })
  }

  //明細========================================

  infos: Array<any> = []
  index!: number
  allOrderData!: Array<any>;

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
