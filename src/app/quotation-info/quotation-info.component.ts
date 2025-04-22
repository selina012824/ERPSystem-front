import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, HostListener, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { DataService } from '../@service/dataService';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { HttpClientService } from '../@http-services/http.services';

@Component({
  selector: 'app-quotation-info',
  imports: [MatIconModule, CommonModule],
  templateUrl: './quotation-info.component.html',
  styleUrl: './quotation-info.component.scss'
})
export class QuotationInfoComponent {

  constructor(private router: Router, private dataService: DataService, private http: HttpClientService, private cdRef: ChangeDetectorRef) { }

  readonly dialog = inject(MatDialog);

  targetID!: string;
  quotationData!: Array<any>;

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    let req = this.dataService.infoID;
    this.http.postApi("http://localhost:8080/quotation/get__quotation", req).subscribe((res: any) => {
      console.log(res);

      this.quotationData = [res.quotation];

      this.cdRef.detectChanges();

      if (this.dataService.printID !== "") {
        this.setupPrintListener();
        this.print();
        this.dataService.printID = "";
      }
    })




  }

  // 一覧ページへ戻る
  return() {
    this.router.navigateByUrl('/TransformPage/quotationPage');
  }

  // 印刷
  print() {
    window.print();
  }


  // 印刷後の処理を設定
  setupPrintListener() {
    window.onafterprint = () => {
      // 印刷後に元のページへ戻る（印刷ボタンから遷移してきた場合）
      if (this.dataService.printID !== "") {
        this.router.navigateByUrl('/TransformPage/quotationPage');
      }
    };
  }


  // 注文作成ボページへ遷移
  setOrder(targetID: string) {
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
