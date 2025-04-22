import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatDialogContent, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-receiving-filter',
  imports: [MatDialogContent, MatIconModule, MatSelectModule, FormsModule, MatOption],
  templateUrl: './receiving-filter.component.html',
  styleUrl: './receiving-filter.component.scss'
})
export class ReceivingFilterComponent {
  readonly dialogRef = inject(MatDialogRef<ReceivingFilterComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA)

  // 關閉對話框
  closeDialog(): void {
    this.dialogRef.close();
  }


  // 篩選條件的模型
  filter = {
    quotationDateStart: '',
    quotationDateEnd: '',
    validityDateStart: '',
    validityDateEnd: '',
    source: null
  };


  // 執行搜尋操作
  search(): void {
    console.log('篩選條件：', this.filter);
    // 在這裡執行篩選邏輯，或者返回篩選結果
    this.dialogRef.close(this.filter); // 返回篩選結果
  }
}
