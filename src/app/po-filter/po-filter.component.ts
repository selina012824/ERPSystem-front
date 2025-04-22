import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatDialogContent, MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { HttpClientService } from '../@http-services/http.services';

@Component({
  selector: 'app-po-filter',
  imports: [MatDialogContent, MatIconModule, MatSelectModule, FormsModule, MatOption, MatDialogTitle],
  templateUrl: './po-filter.component.html',
  styleUrl: './po-filter.component.scss'
})
export class PoFilterComponent {
  constructor(private http: HttpClientService) { }
  readonly dialogRef = inject(MatDialogRef<PoFilterComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA)

  // 關閉對話框
  closeDialog(): void {
    this.dialogRef.close();
  }


  // 篩選條件的模型
  purchaseOrderID!: string;
  orderID!: string;
  supplierID!: string;
  status!: string;
  isApproved!:string;
  orderStartDate!: string;
  orderEndDate!: string;
  deliveryStartDate!: string;
  deliveryEndDate!: string;


  // 執行搜尋操作
  search(){
    let req = {
      "purchaseOrderID": this.purchaseOrderID,
      "orderID": this.orderID,
      "supplierID": this.supplierID,
      "status": this.status,
      "isApproved":this.isApproved,
      "orderStartDate": this.orderStartDate,
      "orderEndDate": this.orderEndDate,
      "deliveryStartDate": this.deliveryStartDate,
      "deliveryEndDate": this.deliveryEndDate,
    }

    this.http.postApi("http://localhost:8080/purchaseOrder/multi_search", req).subscribe((res: any) => {
      console.log(res);

      if (res.code == 200) {
        this.dialogRef.close(res.purchaseOrderList);
      }

    })
  }
}
