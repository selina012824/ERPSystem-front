import { CommonModule, DatePipe } from '@angular/common';
import { Component, HostListener, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { DataService } from '../@service/dataService';
import { cloneDeep } from 'lodash';
import { HttpClientService } from '../@http-services/http.services';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-quotation',
  imports: [CommonModule, MatIconModule, FormsModule],
  templateUrl: './edit-quotation.component.html',
  styleUrl: './edit-quotation.component.scss'
})
export class EditQuotationComponent {
  constructor(private router: Router, private dataService: DataService, private http: HttpClientService) { }
  readonly dialog = inject(MatDialog);

  targetID!: string;
  quotationData!: Array<any>;
  originData!: Array<any>;

  ngOnInit(): void {
    let req = this.dataService.editID;
    this.http.postApi("http://localhost:8080/quotation/get__quotation", req).subscribe((res: any) => {
      console.log(res);

      this.quotationData = [res.quotation];

      this.infos = this.quotationData[0].quotationInfoList
      this.index = this.infos.length;
      this.subTotal = this.quotationData[0].subtotal;
      this.totalAmount = this.quotationData[0].totalAmount;
    })

  }

  subTotal: number = 0.00;
  // 合計更新
  updatedSubTotal() {
    let money = this.infos.reduce((sum, item) => sum + item.subtotal, 0);
    this.subTotal = Number(money.toFixed(2));

    this.updateTotalAmount();
  }

  totalAmount: number = 0.00;
  // 総額更新
  updateTotalAmount() {
    this.totalAmount = this.subTotal + this.quotationData[0].tax;
    this.totalAmount = Number(this.totalAmount.toFixed(2));
  }



  // 一覧画面に戻る
  return() {


    this.router.navigateByUrl('/TransformPage/quotationPage');
  }

  // 見積書更新処理（確認 → API 呼出し）
  send() {
    //呼叫確認框
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      data: { message: "送信してもよろしいですか？" },
      width: "400px",
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result == "sure") {
        let infoData = [];

        // 現在時刻取得
        let datePipe = new DatePipe('en-US');
        let now = new Date();
        let formattedDateTime = datePipe.transform(now, 'yyyy-MM-ddTHH:mm:ss')!;


        for (let item of this.infos) {
          infoData.push({
            "quotationDetailID": item.quotationDetailID,
            "quotationID": this.dataService.editID,
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
            "createAt": this.quotationData[0].createAt,
            "createClerkNm": this.quotationData[0].createClerkNm,
            "updateAt": formattedDateTime,
            "updateBy": "員工C",// 今後はログインユーザー名に置換予定
          })
        }

        for (let item of this.quotationData) {
          item.updateBy = "員工C";
          item.updateAt = formattedDateTime;
          item.quotationInfoList = infoData;
          item.subtotal = this.subTotal;
          item.total = this.totalAmount;
          item.totalAmount = this.totalAmount;
        }

        console.log(this.quotationData);
        let req = this.quotationData[0];

        this.http.postApi("http://localhost:8080/quotation/edit_quotation", req)
          .subscribe({

            next: (res) => {
              sessionStorage.setItem('successMessage', 'データが正常に送信されました!');
              this.router.navigateByUrl('/TransformPage/quotationPage');
            },
            error: (err) => {
              console.log(err);
            }

          })
      }
    })
  }

  //================= 明細処理 =================//

  infos: Array<any> = [];
  index!: number;



  // 明細追加
  add() {
    let quotationData1Info = {
      quotationDetailID: null,
      quotationID: null,
      materialID: null,
      processingType: null,

      quantity: 0,
      unitPrice: 0.00,
      subtotal: 0.00,

      thickness: null,
      width: null,
      length: null,
      weight: null,
      diameter: null,
      outerDiameter: null,
      innerThickness: null,
      cuttingSize: null,
      surfaceTreatment: null,
      specification: null,

      createAt: null,
      createClerk: null,

      updateAt: null,
      updateClerk: null,
    }

    this.infos.push(quotationData1Info);
    this.index = this.infos.length;
  }

  // 明細削除
  delete(index: number) {
    this.infos.splice(index, 1);
    this.index = this.infos.length;
    this.updatedSubTotal();
  }



  // 小計更新（数量 x 単価）
  updateSubtotal(item: any) {
    item.subtotal = item.unitPrice * item.quantity;
    if (item.subtotal % 1 != 0) {
      item.subtotal = Number(item.subtotal.toFixed(2));
    }

    this.updatedSubTotal();
  }


  //=================== ページ上下移動ボタン関連 ===================//

  showButton: Boolean = false;
  private hideTimeout: any;  // ボタン非表示のためのタイマー記録

  toButtom() {
    if (this.isAtBottom()) {
      // ページ最下部にいる場合、最上部にスクロール
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // それ以外の場合、最下部にスクロール
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
    }
  }

  // ページが最下部にいるかどうか判定
  isAtBottom(): boolean {
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;
    return scrollPosition + windowHeight >= docHeight;
  }

  // ページが最上部にいるかどうか判定
  isAtTop(): boolean {
    return window.scrollY === 0;
  }

  // スクロール時の監視処理
  @HostListener('window:scroll', [])
  onWindowScroll() {

    this.showButton = true;

    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }

    this.hideTimeout = setTimeout(() => {
      this.showButton = false;
    }, 4000);
  }
}
