import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatDialogContent, MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { HttpClientService } from '../@http-services/http.services';

@Component({
  selector: 'app-order-filter',
  imports: [MatDialogContent, MatIconModule, MatSelectModule, FormsModule, MatDialogTitle],
  templateUrl: './order-filter.component.html',
  styleUrl: './order-filter.component.scss'
})
export class OrderFilterComponent {
  constructor(private http: HttpClientService) { }
  readonly dialogRef = inject(MatDialogRef<OrderFilterComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA)

  // 關閉對話框
  closeDialog(): void {
    this.dialogRef.close();
  }


  // 篩選條件的模型
  orderID!: string;
  estScrapID!: string;
  customerID!: string;
  status!: string;
  orderStartDate!: string;
  orderEndDate!: string;
  deliveryStartDate!: string;
  deliveryEndDate!: string;


  // 執行搜尋操作
  search(){

    let req = {
      "orderID": this.orderID,
      "estScrapID": this.estScrapID,
      "customerID": this.customerID,
      "status": this.status,
      "orderStartDate": this.orderStartDate,
      "orderEndDate": this.orderEndDate,
      "deliveryStartDate": this.deliveryStartDate,
      "deliveryEndDate": this.deliveryEndDate,
    }

    console.log(req);


    this.http.postApi("http://localhost:8080/order/multi_search", req).subscribe((res: any) => {
      console.log(res);

      if (res.code == 200) {
        this.dialogRef.close(res.orderList);
      }

    })
  }

}
