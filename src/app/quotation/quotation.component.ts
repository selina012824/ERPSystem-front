import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { DataService } from '../@service/dataService';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import { HttpClientService } from '../@http-services/http.services';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-quotation',
  imports: [MatIconModule, RouterLink, RouterLinkActive, MatButtonModule, MatMenuModule, FormsModule, CommonModule],
  templateUrl: './quotation.component.html',
  styleUrl: './quotation.component.scss'
})
export class QuotationComponent {

  constructor(private router: Router, private dataService: DataService, private http: HttpClientService) { }

  readonly dialog = inject(MatDialog);

  // 見積書一覧ページで表示するデータ
  quotations: {
    quotationID: string;
    customerID: string;
    quotationDate: string;
    validDate: string;
    totalAmount: number;
    quotationType: string;
    ifSetOrder: string;
    clerkName: string;
  }[] = [];

  // 検索項目
  quotationID!: string;
  customerID!: string;
  quotationType: string = "";
  quotationStartDate!: string;
  quotationEndDate!: string;
  validStartDate!: string;
  validEndDate!: string;

  index!: number;


  // ページネーション関連
  paginatedData: any[] = [];
  pageIndex: number = 0;  // 現在のページ番号
  pageSize: number = 5;   // 1ページあたりの件数
  totalPages: number = 0; // 総ページ数

  statusMessage: string = '';
  ngOnInit(): void {

    // 見積書登録成功の時にメッセージを表示
    this.statusMessage = sessionStorage.getItem('successMessage') || '';

    // 3秒後にメッセージを非表示
    setTimeout(() => {
      sessionStorage.removeItem('successMessage');
      this.statusMessage = '';
    }, 3000);

    this.quotations = []
    this.http.getApi("http://localhost:8080/quotation/get_all_quotation").subscribe({
      next: (res: any) => {
        for (let item of res.quotationList) {
          let data = {
            quotationID: item.quotationID,
            customerID: item.customerID,
            quotationDate: item.quotationDate,
            validDate: item.validityPeriod,
            totalAmount: item.totalAmount,
            quotationType: item.quotationType,
            ifSetOrder: item.ifSetOrder,
            clerkName: item.createClerkNm
          }

          this.quotations.push(data);
        }
        this.index = this.quotations.length;
        this.totalPages = Math.ceil(this.index / this.pageSize);
        this.updatePaginatedData();
      },

      error: (res: any) => {
        this.statusMessage = "データの読み込みに失敗しました。もう一度お試しください";
        setTimeout(() => {
          this.statusMessage = '';
        }, 3000);
      }
    })


  }

  // 検索
  search() {

    let req = {
      "quotationID": this.quotationID,
      "customerID": this.customerID,
      "quotationType": this.quotationType,
      "quotationStartDate": this.quotationStartDate,
      "quotationEndDate": this.quotationEndDate,
      "validStartDate": this.validStartDate,
      "validEndDate": this.validEndDate,
    }

    console.log(req);


    this.http.postApi("http://localhost:8080/quotation/multi_search", req).subscribe((res: any) => {
      console.log(res);
      this.quotations = [];
      for (let item of res.quotationList) {
        let data = {
          quotationID: item.quotationID,
          customerID: item.customerID,
          quotationDate: item.quotationDate,
          validDate: item.validityPeriod,
          totalAmount: item.totalAmount,
          quotationType: item.quotationType,
          ifSetOrder: item.ifSetOrder,
          clerkName: item.createClerkNm
        }

        this.quotations.push(data);
      }
      this.index = this.quotations.length;
      this.totalPages = Math.ceil(this.index / this.pageSize);
      this.updatePaginatedData();

    })
  }


  // 詳細ページへ遷移
  toInfo(targetID: string) {
    this.dataService.infoID = targetID;
    this.router.navigateByUrl('/TransformPage/quotationInfoPage');
  }

  // 検索条件を初期化
  initializeSearchData() {
    this.quotationID = "";
    this.customerID = "";
    this.quotationType = "";
    this.quotationStartDate = "";
    this.quotationEndDate = "";
    this.validStartDate = "";
    this.validEndDate = "";
  }

  // 全データ取得（リセット処理）
  reset() {
    this.http.getApi("http://localhost:8080/quotation/get_all_quotation").subscribe((res: any) => {
      console.log(res);

      this.quotations = [];

      for (let item of res.quotationList) {
        let data = {
          quotationID: item.quotationID,
          customerID: item.customerID,
          quotationDate: item.quotationDate,
          validDate: item.validityPeriod,
          totalAmount: item.totalAmount,
          quotationType: item.quotationType,
          ifSetOrder: item.ifSetOrder,
          clerkName: item.createClerkNm
        }

        this.quotations.push(data);
      }
      this.index = this.quotations.length;
      this.totalPages = Math.ceil(this.index / this.pageSize);
      this.updatePaginatedData();

    })
  }

  // クリック時のイベントを中止（ボタン操作の誤作動防止）
  stopEvent(event: Event): void {
    event.stopPropagation();
  }

  // 編集ページへ遷移
  edit(targetID: string, event: Event) {
    this.stopEvent(event);
    this.dataService.editID = targetID;
    this.router.navigateByUrl('/TransformPage/editQuotationPage');
  }

  // 注文作成ボページへ遷移
  setOrder(targetID: string, event: Event) {
    this.stopEvent(event);
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      data: { message: "注文を作成しますか?" },
      width: "400px",
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result == "sure") {
        this.dataService.setOrderID = targetID;
        this.router.navigateByUrl('/TransformPage/addOrderPage');
      }
    })

  }

  // 見積書作成ページへ遷移（データコピー）
  copy(targetID: string, event: Event) {
    this.stopEvent(event);
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      data: { message: "見積書を複製しますか?" },
      width: "400px",
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result == "sure") {
        this.dataService.copyID = targetID;
        this.router.navigateByUrl('/TransformPage/addQuotationPage');
      }
    })
  }

  //　TODO:印刷
  print(target: string) {
    this.dataService.printID = target;
    this.dataService.infoID = target;
    this.router.navigateByUrl('/TransformPage/quotationInfoPage');

  }


  // 表示対象のデータを更新（ページネーション用）
  updatePaginatedData(): void {
    const startIndex = this.pageIndex * this.pageSize;
    this.paginatedData = this.quotations.slice(startIndex, startIndex + this.pageSize);
  }

  // ページ変更処理
  onPageChange(newPageIndex: number): void {
    if (newPageIndex >= 0 && newPageIndex < this.totalPages) {
      this.pageIndex = newPageIndex;
      this.updatePaginatedData();
    }
  }



}



