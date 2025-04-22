import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatDialogContent, MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { HttpClientService } from '../@http-services/http.services';
import { DataService } from '../@service/dataService';

@Component({
  selector: 'app-quotation-filter',
  imports: [MatDialogContent, MatIconModule, MatOption, MatSelectModule, FormsModule, MatDialogTitle],
  templateUrl: './quotation-filter.component.html',
  styleUrl: './quotation-filter.component.scss'
})
export class QuotationFilterComponent {

  readonly dialogRef = inject(MatDialogRef<QuotationFilterComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA)

  constructor(private http: HttpClientService, private dataService: DataService) { }

  // // 篩選條件的模型
  // filter = {
  //   quotationDateStart: '',
  //   quotationDateEnd: '',
  //   validityDateStart: '',
  //   validityDateEnd: '',
  //   source: null // 默認為 '自社'
  // };

  quotationID!: string;
  customerID!: string;
  quotationType!: string;
  quotationStartDate!: string;
  quotationEndDate!: string;
  validStartDate!: string;
  validEndDate!: string;

  ngOnInit(): void {


  }

  // 關閉對話框
  closeDialog(): void {
    this.dialogRef.close();
  }




  onSelectionChange(event: any) {
    const selectedValue = event.value;

    //   // 如果選擇的值和當前值相同，則清除選擇
    //   if (this.filter.source === selectedValue) {
    //     this.filter.source = null;
    //   }
    // }
    // 執行搜尋操

  }


  search() {

    let req = {
      "quotationID": this.quotationID,
      "customerID": this.customerID,
      "quotationType": this.quotationType,
      "quotationStartDate": this.quotationStartDate,
      "quotationEndDate": this.quotationEndDate,
      "validStartDate": this.validStartDate,
      "validEndDate": this.validEndDate,
    }

    console.log(req);


    this.http.postApi("http://localhost:8080/quotation/multi_search", req).subscribe((res: any) => {
      console.log(res);

      if (res.code == 200) {
        this.dialogRef.close(res.quotationList);
      }

    })
  }

}
