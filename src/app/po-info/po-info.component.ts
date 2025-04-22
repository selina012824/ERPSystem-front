import { CommonModule } from '@angular/common';
import { Component, HostListener, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { DataService } from '../@service/dataService';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { HttpClientService } from '../@http-services/http.services';


@Component({
  selector: 'app-po-info',
  imports: [MatIconModule, CommonModule, FormsModule],
  templateUrl: './po-info.component.html',
  styleUrl: './po-info.component.scss'
})
export class PoInfoComponent {
  constructor(private router: Router, private dataService: DataService, private http: HttpClientService) { }

  readonly dialog = inject(MatDialog);

  targetID!: string;
  poData!: Array<any>;


  ngOnInit(): void {

    this.http.postApi("http://localhost:8080/purchaseOrder/get_PO", this.dataService.infoID)
      .subscribe((res: any) => {
        this.poData = [res.purchaseOrder]

        this.disabledSetReceiving();
      })

  }

  return() {
    this.router.navigateByUrl('/TransformPage/poPage');
  }

  print() {

  }

  setReceiving(targetID: string) {
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      data: { message: "入荷伝票を作成しますか" },
      width: "400px",
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result == "sure") {
        this.dataService.setReceivingID = targetID;
        this.router.navigateByUrl('/TransformPage/addReceivingPage');
      }

    })
  }

  //成立進貨單按鈕是否可操作判定===========================================
  disabledSetReceivingButton: Boolean = false;
  disabledSetReceiving() {
    if (this.poData[0].isApproved == "N") {
      this.disabledSetReceivingButton = true;
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
