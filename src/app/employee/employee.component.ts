import { Component, inject } from '@angular/core';
import { DataService } from '../@service/dataService';
import { HttpClientService } from '../@http-services/http.services';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-employee',
  imports: [MatIconModule, RouterLink, RouterLinkActive, MatButtonModule, MatMenuModule, FormsModule],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.scss'
})
export class EmployeeComponent {

  constructor(private router: Router, private dataService: DataService, private http: HttpClientService) { }
  readonly dialog = inject(MatDialog);

  //従業員一覧ページに表示される項目
  employees: {
    employeeID: string;
    employeeName: string;
    birthday: string;
    cellphone: string;
    email: string;
  }[] = [];

  //換頁
  paginatedData: any[] = [];
  pageIndex: number = 0; // 當前頁數
  pageSize: number = 5;  // 每頁顯示 5 筆資料
  totalPages: number = 0; // 總頁數

  index!: number;

  successMessage: string = '';
  ngOnInit(): void {
    // 員工新增成功時會跳出訊息
    this.successMessage = sessionStorage.getItem('successMessage') || '';

    // 3秒後清除訊息
    setTimeout(() => {
      sessionStorage.removeItem('successMessage');
      this.successMessage = '';
    }, 3000);

    // API
    this.http.getApi("http://localhost:8080/employee/get_all_employee").subscribe((res: any) => {
      console.log(res);

      this.employees = []
      for (let item of res.employee) {
        let data = {
          employeeID: item.employeeID,
          employeeName: item.employeeName,
          birthday: item.birthday,
          cellphone: item.cellphone,
          email: item.email,
        }

        this.employees.push(data);
      }
      this.index = this.employees.length;
      this.totalPages = Math.ceil(this.index / this.pageSize); // 計算總頁數
      this.updatePaginatedData();
    })
  }

  employeeID!: string;
  employeeName!: string;
  birthday!: string;
  cellphone!: string;
  email!: string;

  // 搜索
  search() {
    let req = {
      "employeeID": this.employeeID,
      "employeeName": this.employeeName,
      "birthday": this.birthday,
      "cellphone": this.cellphone,
      "email": this.email,
    }

    this.http.postApi("http://localhost:8080/employee/multiSearch", req).subscribe((res: any) => {

      this.employees = []
      for (let item of res.employee) {
        let data = {
          employeeID: item.employeeID,
          employeeName: item.employeeName,
          birthday: item.birthday,
          cellphone: item.cellphone,
          email: item.email,
        }

        this.employees.push(data);
      }
      this.index = this.employees.length;
      this.totalPages = Math.ceil(this.index / this.pageSize); // 計算總頁數
      this.updatePaginatedData();
    })
  }

  // 初始化搜索欄
  initializeSearchData() {
    this.employeeID = "";
    this.employeeName = "";
    this.birthday = "";
    this.cellphone = "";
    this.email = "";
  }

  //重置
  reset() {
    // API
    this.http.getApi("http://localhost:8080/employee/get_all_employee").subscribe((res: any) => {
      console.log(res);

      this.employees = []
      for (let item of res.employee) {
        let data = {
          employeeID: item.employeeID,
          employeeName: item.employeeName,
          birthday: item.birthday,
          cellphone: item.cellphone,
          email: item.email,
        }

        this.employees.push(data);
      }
      this.index = this.employees.length;
      this.totalPages = Math.ceil(this.index / this.pageSize); // 計算總頁數
      this.updatePaginatedData();
    })
  }

  //前往資訊頁面
  toInfo(targetID: string) {
    this.dataService.infoID = targetID;
    this.router.navigateByUrl('/TransformPage/employeeInfoPage');
  }

  edit(targetID: string, event: Event) {
    this.stopEvent(event);
    this.dataService.editID = targetID;
    this.router.navigateByUrl('/TransformPage/editEmployeePage');
  }

  //防止操作按鈕觸及toInfo()方法
  stopEvent(event: Event): void {
    event.stopPropagation();
  }

  // 更新分頁資料
  updatePaginatedData(): void {
    const startIndex = this.pageIndex * this.pageSize;
    this.paginatedData = this.employees.slice(startIndex, startIndex + this.pageSize);
  }

  // 改變分頁
  onPageChange(newPageIndex: number): void {
    if (newPageIndex >= 0 && newPageIndex < this.totalPages) {
      this.pageIndex = newPageIndex;
      this.updatePaginatedData();
    }
  }
}
