import { CommonModule, DatePipe } from '@angular/common';
import { Component, HostListener, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import { HttpClientService } from '../@http-services/http.services';
import { DataService } from '../@service/dataService';
import { CustomerFilterComponent } from '../customer-filter/customer-filter.component';



@Component({
  selector: 'app-add-quotation',
  imports: [CommonModule, MatIconModule, FormsModule],
  templateUrl: './add-quotation.component.html',
  styleUrl: './add-quotation.component.scss'
})
export class AddQuotationComponent {

  constructor(private router: Router, private http: HttpClientService, private dataService: DataService) { }
  readonly dialog = inject(MatDialog);

  quotationID: string | null = null; // 見積書番号
  quotationDate!: string; // 見積日
  quotationType: string = "1"; // 見積元（1=自社、2=他社）

  customerID!: string; // 取引先番号
  customerName!: string; // 取引先名
  customerNickname!: string; // 略称
  contactor!: string; // 担当者
  inResponse!: string; // 責任者
  phone!: string; // 電話番号
  cellPhone!: string; // 携帯電話
  faxNumber!: string; // FAX番号
  taxNumber!: string; // 法人番号
  address!: string; // 住所
  shipAddress!: string; // 納品先住所
  invoiceAddress!: string; // 請求先
  payBy!: string; // 支払方法

  tax: number = 0.00;
  total: number = 0.00;
  totalAmount: number = 0.00;
  validDate!: string;// 有効期限
  remark!: string; // 備考
  ifSetOrder: string = "2"// 注文作成かどうか（1=作成、2=未作成）
  setOrderDate!: string;// 注文作成日
  createAt!: string;// 作成日
  createClerk!: string;// 作成者
  updateAt!: string;// 更新日
  updateClerk!: string;// 更新者

  subTotal: number = 0.00;

  // 合計更新
  updatedSubTotal() {
    let money = this.infos.reduce((sum, item) => sum + item.subtotal, 0);
    this.subTotal = Number(money.toFixed(2));

    this.updateTotalAmount();
  }

  // 総額更新
  updateTotalAmount() {
    this.totalAmount = this.subTotal + (this.tax || 0);
    this.totalAmount = Number(this.totalAmount.toFixed(2));
  }

  readQuotationData() {
    if (this.dataService.copyID != null && this.dataService.copyID != "") {
      this.http.postApi("http://localhost:8080/quotation/get__quotation", this.dataService.copyID)
        .subscribe((res: any) => {
          console.log(res);
          let data = res.quotation;

          this.quotationDate = data.quotationDate;
          this.quotationType = data.quotationType;
          this.customerID = data.customerID;
          this.customerName = data.customerName;
          this.customerNickname = data.customerNickname;
          this.inResponse = data.personInResponse;
          this.contactor = data.contactor;
          this.phone = data.customerPhone;
          this.cellPhone = data.customerCellphone;
          this.faxNumber = data.customerFaxNumber;
          this.taxNumber = data.customerTaxNumber;
          this.address = data.customerAddress;
          this.shipAddress = data.shipAddress;
          this.invoiceAddress = data.invoiceAddress;
          this.payBy = data.payment;
          this.subTotal = data.subtotal;
          this.tax = data.tax;
          this.total = data.total;
          this.totalAmount = data.totalAmount;
          this.validDate = data.validityPeriod;
          this.remark = data.remark;
          this.infos = data.quotationInfoList
        })
    }
  }


  // 一覧画面に戻る
  return() {
    this.dataService.copyID = "";
    this.router.navigateByUrl('/TransformPage/quotationPage');
  }

  // 顧客検索ダイアログを開く
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
        this.notFound = false;
        this.http.postApi("http://localhost:8080/partner/get_partner", result)
          .subscribe((res: any) => {
            console.log(res);
            this.customerID = res.partner.partnerID;
            this.customerName = res.partner.partnerName;
            this.customerNickname = res.partner.partnerNickName;
            this.inResponse = res.partner.inResponse;
            this.contactor = res.partner.contactor;
            this.phone = res.partner.phone;
            this.cellPhone = res.partner.cellphone;
            this.faxNumber = res.partner.faxNumber;
            this.taxNumber = res.partner.taxNumber;
            this.address = res.partner.address;
            this.shipAddress = res.partner.shipAddress;
            this.invoiceAddress = res.partner.invoiceAddress;
            this.payBy = res.partner.payment;
            this.remark = res.partner.remark;
          })
      }
    })
  }

  isSubmitted = false;
  formatError = false;
  notFound = false;
  // 見積書登録処理（確認 → API 呼出し）
  send() {

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

        this.createAt = formattedDateTime;
        this.createClerk = this.dataService.employeeID // 今後はログインユーザー名に置換予定


        for (let item of this.infos) {
          infoData.push({
            "quotationDetailID": item.quotationDetailID,
            "quotationID": item.quotationID,
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
          "quotationID": this.quotationID,
          "quotationDate": this.quotationDate,
          "quotationType": this.quotationType,
          "customerID": this.customerID,
          "customerName": this.customerName,
          "customerNickName": this.customerNickname,
          "personInResponse": this.inResponse,
          "contactor": this.contactor,
          "customerPhone": this.phone,
          "customerCellphone": this.cellPhone,
          "customerFaxNumber": this.faxNumber,
          "customerTaxNumber": this.taxNumber,
          "customerAddress": this.address,
          "shipAddress": this.shipAddress,
          "invoiceAddress": this.invoiceAddress,
          "payment": this.payBy,
          "subtotal": this.subTotal,
          "tax": this.tax,
          "total": this.totalAmount,
          "totalAmount": this.totalAmount,
          "validityPeriod": this.validDate,
          "remark": this.remark,
          "ifSetOrder": this.ifSetOrder,
          "setOrderTime": this.setOrderDate,
          "createAt": this.createAt,
          "createClerkNm": this.createClerk,
          "updateAt": this.createAt,
          "updateBy": this.createClerk,
          "quotationInfoList": infoData,
        }

        console.log(req);
        this.http.postApi("http://localhost:8080/quotation/add_quotation", req)
          .subscribe({

            next: (res) => {
              sessionStorage.setItem('successMessage', 'データが正常に送信されました!');
              this.dataService.copyID = "";
              this.router.navigateByUrl('/TransformPage/quotationPage');
            },

            error: (err:any) => {
              console.log(err);
              this.isSubmitted = true;

              if (this.quotationID && !/^[A-Za-z0-9]+$/.test(this.quotationID)) {
                this.isSubmitted = true;
                this.formatError = true;
              }

              for(let item of err.error){
                if(item.message == "指定された取引先が見つかりません。"){
                 this.isSubmitted = true;
                 this.notFound = true;
                }
                if(item.message == "指定され見積番号が無効です。"){
                  this.formatError = true;
                }
             }

              
            }

          })
      }
    })

  }

  //================= 明細処理 =================//

  infos: Array<any> = []
  index!: number

  ngOnInit(): void {

    // 初期明細データ1件追加
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

      createAt: "",
      createClerk: "",

      updateAt: "",
      updateClerk: "",
    }

    this.infos.push(quotationData1Info);
    this.index = this.infos.length;
    this.readQuotationData();
  }


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

      createAt: "",
      createClerk: "",

      updateAt: "",
      updateClerk: "",
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

  updateValidDate() {
    // 有効期限（見積日+7日）を自動計算
    const quotationDateObj = new Date(this.quotationDate);
    quotationDateObj.setDate(quotationDateObj.getDate() + 7);  // 加 7 天

    // 日付を「yyyy-MM-dd」形式にフォーマット
    const validDateStr = quotationDateObj.toISOString().split('T')[0];
    this.validDate = validDateStr;
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
