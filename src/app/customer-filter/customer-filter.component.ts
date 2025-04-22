import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { HttpClientService } from '../@http-services/http.services';

@Component({
  selector: 'app-customer-filter',
  imports: [MatFormField, MatLabel, MatInputModule, MatSelect, MatOption, MatFormFieldModule, FormsModule],
  templateUrl: './customer-filter.component.html',
  styleUrl: './customer-filter.component.scss'
})
export class CustomerFilterComponent {
  readonly dialogRef = inject(MatDialogRef<CustomerFilterComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA)
  constructor(private http: HttpClientService) { }

  partnerData!: Array<any>;

  partnerID!: string;
  partnerName!: string;
  partnerNickName!: string;
  partnerType: string = "";
  inResponse!: string;
  contactor!: string;
  phone!: string;
  cellphone!: string;
  faxNumber!: string;
  taxNumber!: string;
  address!: string;
  shipAddress!: string;
  invoiceAddress!: string;
  payment!: string;

  ngOnInit(): void {
    this.http.getApi("http://localhost:8080/partner/get_all_partner").subscribe((res: any) => {
      console.log(res);

      this.partnerData = []
      for (let item of res.partner) {
        let data = {
          partnerID: item.partnerID,
          partnerType: JSON.parse(item.partnerType),
          partnerName: item.partnerName,
          partnerNickName: item.partnerNickName,
          inResponse: item.inResponse,
          contactor: item.contactor,
          phone: item.phone,
          cellphone: item.cellphone,
          faxNumber: item.faxNumber,
          taxNumber: item.taxNumber,
          address: item.address,
          shipAddress: item.shipAddress,
          invoiceAddress: item.invoiceAddress,
          payment: item.payment,
        }

        this.partnerData.push(data);
      }
    })
  }

  // 検索
  searchCustomer() {
    let req = {
      "partnerID": this.partnerID,
      "partnerType": this.partnerType,
      "partnerName": this.partnerName,
      "partnerNickName": this.partnerName,
      "inResponse": this.inResponse,
      "contactor": this.contactor,
      "phone": this.phone,
      "cellphone": this.cellphone,
      "faxNumber": this.faxNumber,
      "taxNumber": this.taxNumber,
      "address": this.address,
      "shipAddress": this.shipAddress,
      "invoiceAddress": this.invoiceAddress,
      "payment": this.payment,
    }

    this.http.postApi("http://localhost:8080/partner/customerSearch", req).subscribe((res: any) => {

      this.partnerData = []
      for (let item of res.partner) {
        let data = {
          partnerID: item.partnerID,
          partnerType: JSON.parse(item.partnerType),
          partnerName: item.partnerName,
          partnerNickName: item.partnerNickName,
          inResponse: item.inResponse,
          contactor: item.contactor,
          phone: item.phone,
          cellphone: item.cellphone,
          faxNumber: item.faxNumber,
          taxNumber: item.taxNumber,
          address: item.address,
          shipAddress: item.shipAddress,
          invoiceAddress: item.invoiceAddress,
          payment: item.payment,
        }

        this.partnerData.push(data);
      }
    })
  }

  reset() {

    this.http.getApi("http://localhost:8080/partner/get_all_partner").subscribe((res: any) => {
      console.log(res);
      this.partnerID = "";
      this.partnerType = "";
      this.partnerName = "";
      this.partnerName = "";
      this.inResponse = "";
      this.contactor = "";
      this.phone = "";
      this.faxNumber = "";
      this.taxNumber = "";
      this.address = "";
      this.shipAddress = "";
      this.invoiceAddress = "";
      this.payment = "";

      this.partnerData = []
      for (let item of res.partner) {
        let data = {
          partnerID: item.partnerID,
          partnerType: JSON.parse(item.partnerType),
          partnerName: item.partnerName,
          partnerNickName: item.partnerNickName,
          inResponse: item.inResponse,
          contactor: item.contactor,
          phone: item.phone,
          cellphone: item.cellphone,
          faxNumber: item.faxNumber,
          taxNumber: item.taxNumber,
          address: item.address,
          shipAddress: item.shipAddress,
          invoiceAddress: item.invoiceAddress,
          payment: item.payment,
        }

        this.partnerData.push(data);
      }
    })
  }

  selectCustomer(target: string) {
    this.dialogRef.close(target);
  }


  //展開詳細資料
  showAdvanced: Boolean = false;
  toggleAdvanced() {
    this.showAdvanced = !this.showAdvanced;
  }

  close() {
    this.dialogRef.close();
  }

}
