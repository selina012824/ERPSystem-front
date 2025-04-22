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
  selector: 'app-order-info',
  imports: [MatIconModule, CommonModule, FormsModule],
  templateUrl: './order-info.component.html',
  styleUrl: './order-info.component.scss'
})
export class OrderInfoComponent {
  constructor(private router: Router, private dataService: DataService, private http: HttpClientService, private cdRef: ChangeDetectorRef) { }

  readonly dialog = inject(MatDialog);

  targetID!: string;
  orderData!: Array<any>;


  ngOnInit(): void {




  }

  ngAfterViewInit(): void {
    this.targetID = this.dataService.infoID;

    this.http.postApi("http://localhost:8080/order/get__order", this.targetID).subscribe((res: any) => {
      this.orderData = [res.order];
      console.log(res);

      this.cdRef.detectChanges(); // 強制刷新檢測，確保 DOM 已完全渲染

      if (this.dataService.printID !== "") {
        this.setupPrintListener();
        this.print();
        this.dataService.printID = "";
      }


      this.selectItem = new Array(this.orderData.length).fill(false);
      this.disabledSetWorkOrder();
      this.disabledFinish();
      this.ifEndOrder();
      this.ifFinishOrder();

    })


  }


  return() {
    this.router.navigateByUrl('/TransformPage/orderPage');
  }

  print() {
    window.print();
  }

  // 設置列印完成後的處理
  setupPrintListener() {
    window.onafterprint = () => {
      // 如果是從總攬頁面來的，列印後才導航回總頁面
      if (this.dataService.printID !== "") {
        this.router.navigateByUrl('/TransformPage/quotationPage');
      }
    };
  }


  //成立採購單
  setPO(targetID: string) {
    this.dataService.setPOIDs = this.setIDs;
    this.dataService.targetOrderID = targetID;
    this.router.navigateByUrl('/TransformPage/addPOPage');
  }

  //成立派工單
  setWorkOrder(targetID: string) {
    this.dataService.setWorkOrderIDs = this.setIDs;
    this.dataService.targetOrderID = targetID;
    this.router.navigateByUrl('/TransformPage/addWorkOrderPage');
  }

  //完成訂單
  finishOrder(targetID: string) {
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      data: { message: "注文を完了すると、以後は操作できなくなります。完了してもよろしいですか？" },
      width: "400px",
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result == "sure") {
        this.http.postApi("http://localhost:8080/order/finish_order", targetID).subscribe({
          next: (res: any) => {
            this.router.navigateByUrl('/TransformPage/orderPage');
          }
        })
      }
    })
  }

  // 終止/回復訂單
  endOrder(targetID: string, targetStatus: string) {
    if (targetStatus != "中止") {
      const dialogRef = this.dialog.open(AlertDialogComponent, {
        data: { message: "この注文を中止しますか？" },
        width: "400px",
      })

      dialogRef.afterClosed().subscribe(result => {
        if (result == "sure") {
          this.http.postApi("http://localhost:8080/order/end_order", targetID).subscribe((res: any) => {
            this.router.navigateByUrl('/TransformPage/orderPage');
          })
        }
      })
    } else {
      const dialogRef = this.dialog.open(AlertDialogComponent, {
        data: { message: "この注文を復旧しますか？" },
        width: "400px",
      })

      dialogRef.afterClosed().subscribe(result => {
        if (result == "sure") {

        }
      })
    }
  }


  //成立派工單按鈕是否可操作判定===========================================
  disabledSetWorkOrderButton: Boolean = false;
  allWorkOrderData!: Array<any>;

  //已有既存派工單則不可操作
  disabledSetWorkOrder() {
    this.allWorkOrderData = this.dataService.workOrderData;
    let data = this.allWorkOrderData.filter(item =>
      this.orderData[0].orderID.includes(item.orderID)
    )
    if (data.length != 0) {
      this.disabledSetWorkOrderButton = true;
    }
  }

  //完成訂單按鈕可否操作=================================================
  disabledFinishButton: Boolean = false;

  disabledFinish() {
    // this.allWorkOrderData = this.dataService.workOrderData;
    // let data = this.allWorkOrderData.filter(item =>
    //   this.orderData[0].orderID.includes(item.orderID)
    // )

    // for (let item of data) {
    //   if (item.status == "完成") {
    //     this.disabledFinishButton = false;
    //     return;
    //   }
    // }

    // console.log(this.disabledFinishButton);
  }

  //訂單終止判斷======================================================
  otherDisabledButton: Boolean = false;
  disabledEndButton: Boolean = false;
  ifEndOrder() {
    if (this.orderData[0].status == "中止") {
      this.disabledSetWorkOrderButton = true;
      this.disabledSetWorkOrderButton = true;
      this.disabledFinishButton = true;
      this.otherDisabledButton = true;
    }
  }

  //訂單完成判斷======================================================

  ifFinishOrder() {
    if (this.orderData[0].status == "完了") {
      this.disabledSetWorkOrderButton = true;
      this.disabledSetWorkOrderButton = true;
      this.disabledFinishButton = true;
      this.otherDisabledButton = true;
      this.disabledEndButton = true;

    }
  }

  //選擇事件====================================


  selectItem: boolean[] = [];
  setIDs: string[] = [];
  selectInfo(index: number, targetInfoID: string) {
    this.selectItem[index] = !this.selectItem[index];
    if (this.selectItem[index]) {
      this.setIDs.push(targetInfoID);
    } else {
      const itemIndex = this.setIDs.indexOf(targetInfoID);
      if (itemIndex !== -1) {
        this.setIDs.splice(itemIndex, 1);
      }
    }

    console.log('今選択した明細：', this.setIDs);

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
