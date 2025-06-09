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
  selector: 'app-add-receiving',
  imports: [CommonModule, MatIconModule, FormsModule],
  templateUrl: './add-receiving.component.html',
  styleUrl: './add-receiving.component.scss'
})
export class AddReceivingComponent {
  constructor(private router: Router, private dataService: DataService, private http: HttpClientService) { }
  readonly dialog = inject(MatDialog);

  receivingID!: string;
  purchaseOrderID: string = "";
  receivingDate!: string;
  status: string = "処理待ち";
  inspector!: string;
  inspectionResult: string = "";
  supplierID!: string;

  createAt!: string;//建立時間
  createClerk!: string;//建立員工名稱

  updateAt!: string;//更新時間
  updateClerk!: string;//更新員工名稱

  invoiceStatus: string = "未発行";



  //返回
  return() {
    this.router.navigateByUrl('/TransformPage/receivingPage');
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
        this.createClerk = this.dataService.employeeID//這邊到時會用註冊名字去寫


        for (let item of this.infos) {
          infoData.push({
            "receivingDetailID": item.receivingDetailID,
            "receivingID": item.receivingID,
            "materialID": item.materialID,
            "quantityReceived": item.quantityReceived,
            "quantityAccepted": item.quantityAccepted,
            "quantityRejected": item.quantityRejected,
            "storageLocation": item.storageLocation,
            "stockStatus": item.stockStatus,
          })
        }

        let req = {
          "receivingID": this.receivingID,
          "purchaseOrderID": this.purchaseOrderID,
          "receivingDate": this.receivingDate,
          "status": this.status,
          "inspector": this.inspector,
          "inspectionResult": this.inspectionResult,
          "supplierID": this.supplierID,
          "invoiceStatus": this.invoiceStatus,
          "createdAt": this.createAt,//要用現在時間
          "createdBy": this.createClerk,
          "updatedAt": this.createAt,//要用現在時間
          "updatedBy": this.createClerk,
          "receivingInfoList": infoData,
        }

        console.log(req);
        this.http.postApi("http://localhost:8080/receiving/add_receiving", req)
          .subscribe({
            next: (res: any) => {
              // 將成功訊息存儲到 sessionStorage 中
              sessionStorage.setItem('successMessage', 'データが正常に送信されました!');

              this.clearForm();
              this.router.navigateByUrl('/TransformPage/receivingPage');
            },
            error:(err:any)=>{
              console.log(err);

            }

          })
      }
    })
  }


  //清理表格
  clearForm() {

  }

  targetID!: string;
  poData!: Array<any>;

  //讀取採購單資訊
  readPO() {
    if (this.dataService.setReceivingID) {

      this.targetID = this.dataService.setReceivingID;
      this.http.postApi("http://localhost:8080/purchaseOrder/get_PO", this.targetID)
        .subscribe((res: any) => {
          console.log(res);

          this.poData = [res.purchaseOrder];
          this.infos = this.poData[0].poInfoList;
          this.purchaseOrderID = this.targetID;
          this.supplierID = this.poData[0].supplierID;
          this.index = this.infos.length;
          for (let item of this.infos) {
            item.stockStatus == "未入荷";
          }
        })

    }
  }

  change(targetID: string) {
    this.http.postApi("http://localhost:8080/purchaseOrder/get_PO", targetID)
      .subscribe((res: any) => {
        console.log(res);

        this.poData = [res.purchaseOrder];
        this.infos = this.poData[0].poInfoList;
        this.purchaseOrderID = this.poData[0].purchaseOrderID;
        this.supplierID = this.poData[0].supplierID;
        this.index = this.infos.length;
        for (let item of this.infos) {
          item.stockStatus == "未入荷";
        }
      })
  }

  allPOIDs!: Array<string>;
  //讀取所有採購單編號
  readPOIDs() {
    this.http.getApi("http://localhost:8080/purchaseOrder/get_ids")
      .subscribe((res: any) => {
        console.log(res);

        this.allPOIDs = res;
      })
  }

  //明細========================================

  infos: Array<any> = []
  index!: number
  allPOData!: Array<any>;

  ngOnInit(): void {

    //進貨單明細資料
    let receivingInfo = {
      receivingDetailID: null,
      receivingID: null,
      materialID: null,
      quantityReceived: 0,
      quantityAccepted: 0,
      quantityRejected: 0,
      storageLocation: null,
      stockStatus: "未入荷"
    }

    this.infos.push(receivingInfo);
    this.index = this.infos.length;

    this.readPO();
    this.readPOIDs();
    this.dataService.setReceivingID = null;
    this.allPOData = this.dataService.poData;
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
