import { ChangeDetectorRef, Component, HostListener, inject } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../@service/dataService';
import { HttpClientService } from '../@http-services/http.services';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-employee-info',
  imports: [MatIconModule, CommonModule, FormsModule],
  templateUrl: './employee-info.component.html',
  styleUrl: './employee-info.component.scss'
})
export class EmployeeInfoComponent {

  constructor(private router: Router, private dataService: DataService, private http: HttpClientService, private cdRef: ChangeDetectorRef) { }
  readonly dialog = inject(MatDialog);

  targetID!: string;
  employeeData!: Array<any>;

  ngAfterViewInit(): void {

    let req = this.dataService.infoID;
    this.http.postApi("http://localhost:8080/employee/get_employee", req).subscribe((res: any) => {
      console.log(res);

      this.employeeData = [res.employee];

      this.cdRef.detectChanges(); // 強制刷新檢測，確保 DOM 已完全渲染

    })
  }
  return() {
    this.router.navigateByUrl('/TransformPage/employeePage');
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
