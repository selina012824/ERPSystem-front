import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, HostListener, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { DataService } from '../@service/dataService';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { HttpClientService } from '../@http-services/http.services';

@Component({
  selector: 'app-receiving-info',
  imports: [MatIconModule, CommonModule, FormsModule],
  templateUrl: './receiving-info.component.html',
  styleUrl: './receiving-info.component.scss'
})
export class ReceivingInfoComponent {
  constructor(private router: Router, private dataService: DataService, private http: HttpClientService, private cdRef: ChangeDetectorRef) { }

  targetID!: string;
  receivingData!: Array<any>;

  readonly dialog = inject(MatDialog);



  ngAfterViewInit(): void {

    let req = this.dataService.infoID;
    this.http.postApi("http://localhost:8080/receiving/get_receiving", req).subscribe((res: any) => {
      console.log(res);

      this.receivingData = [res.receiving];

      this.cdRef.detectChanges(); // 強制刷新檢測，確保 DOM 已完全渲染


    })
  }

  return() {
    this.router.navigateByUrl('/TransformPage/receivingPage');
  }

  print() {

  }

  finishReceiving(targetID: string) {
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      data: { message: "入荷を完了しますか？" },
      height: "35%",
      width: "25%",
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result == "sure") {

      }
    })
  }

  //完成進貨按鈕是否可操作判斷====================
  disabledFinishButton: Boolean = false;

  disabledFinish() {
    if (this.receivingData[0].inspectionResult == "N" || this.receivingData[0].status == "完成") {
      this.disabledFinishButton = true
    }
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
