import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { DataService } from '../@service/dataService';
import { HttpClientService } from '../@http-services/http.services';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-partner',
  imports: [MatIconModule, RouterLink, RouterLinkActive, MatButtonModule, MatMenuModule, FormsModule],
  templateUrl: './partner.component.html',
  styleUrl: './partner.component.scss'
})
export class PartnerComponent {

  constructor(private router: Router, private dataService: DataService, private http: HttpClientService) { }
  readonly dialog = inject(MatDialog);

  //取引先一覧ページに表示される項目
  partners: {
    partnerID: string;
    partnerType: string;
    partnerName: string;
    contactor: string;
    phone: string;
    cellphone: string;
  }[] = [];

  //換頁
  paginatedData: any[] = [];
  pageIndex: number = 0; // 當前頁數
  pageSize: number = 5;  // 每頁顯示 5 筆資料
  totalPages: number = 0; // 總頁數

  index!: number;

  successMessage: string = '';
  ngOnInit(): void {
    // 交易夥伴新增成功時會跳出訊息
    this.successMessage = sessionStorage.getItem('successMessage') || '';

    // 3秒後清除訊息
    setTimeout(() => {
      sessionStorage.removeItem('successMessage');
      this.successMessage = '';
    }, 3000);

    // 串API
    this.http.getApi("http://localhost:8080/partner/get_all_partner").subscribe((res: any) => {
      console.log(res);

      this.partners = []
      for (let item of res.partner) {
        let data = {
          partnerID: item.partnerID,
          partnerType: JSON.parse(item.partnerType),
          partnerName: item.partnerName,
          contactor: item.contactor,
          phone: item.phone,
          cellphone: item.cellphone
        }

        this.partners.push(data);
      }
      this.index = this.partners.length;
      this.totalPages = Math.ceil(this.index / this.pageSize); // 計算總頁數
      this.updatePaginatedData();
    })
  }


  partnerID!: string;
  partnerType: string = "";
  partnerName!: string;
  contactor!: string;
  phone!: string;
  cellphone!: string;

  // 搜索
  search() {
    let req = {
      "partnerID": this.partnerID,
      "partnerType": this.partnerType,
      "partnerName": this.partnerName,
      "contactor": this.contactor,
      "phone": this.phone,
      "cellphone": this.cellphone,
    }

    this.http.postApi("http://localhost:8080/partner/multiSearch", req).subscribe((res: any) => {

      this.partners = []
      for (let item of res.partner) {
        let data = {
          partnerID: item.partnerID,
          partnerType: JSON.parse(item.partnerType),
          partnerName: item.partnerName,
          contactor: item.contactor,
          phone: item.phone,
          cellphone: item.cellphone
        }

        this.partners.push(data);
      }
      this.index = this.partners.length;
      this.totalPages = Math.ceil(this.index / this.pageSize); // 計算總頁數
      this.updatePaginatedData();
    })
  }

  // 初始化搜索欄
  initializeSearchData() {
    this.partnerID = "";
    this.partnerType = "";
    this.partnerName = "";
    this.contactor = "";
    this.phone = "";
    this.cellphone = "";
  }

  //重置
  reset() {
    this.http.getApi("http://localhost:8080/partner/get_all_partner").subscribe((res: any) => {
      console.log(res);

      this.partners = []
      for (let item of res.partner) {
        let data = {
          partnerID: item.partnerID,
          partnerType: JSON.parse(item.partnerType),
          partnerName: item.partnerName,
          contactor: item.contactor,
          phone: item.phone,
          cellphone: item.cellphone
        }

        this.partners.push(data);
      }
      this.index = this.partners.length;
      this.totalPages = Math.ceil(this.index / this.pageSize); // 計算總頁數
      this.updatePaginatedData();
    })
  }





  //前往資訊頁面
  toInfo(targetID: string) {
    this.dataService.infoID = targetID;
    this.router.navigateByUrl('/TransformPage/partnerInfoPage');
  }

  edit(targetID: string, event: Event) {
    this.stopEvent(event);
    this.dataService.editID = targetID;
    this.router.navigateByUrl('/TransformPage/editPartnerPage');
  }

  //防止操作按鈕觸及toInfo()方法
  stopEvent(event: Event): void {
    event.stopPropagation();
  }

  // 更新分頁資料
  updatePaginatedData(): void {
    const startIndex = this.pageIndex * this.pageSize;
    this.paginatedData = this.partners.slice(startIndex, startIndex + this.pageSize);
  }

  // 改變分頁
  onPageChange(newPageIndex: number): void {
    if (newPageIndex >= 0 && newPageIndex < this.totalPages) {
      this.pageIndex = newPageIndex;
      this.updatePaginatedData();
    }
  }

}
