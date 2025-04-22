import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})

export class DataService {
  //報價單
  quotationData: Array<any> = [];

  //訂單
  orderData: Array<any> = [];

  //採購單
  poData: Array<any> = [];

  //進貨單
  receivingData: Array<any> = [];

  //派工單
  workOrderData: Array<any> = [];

  //再派工單
  reWorkOrderData: Array<any> = []

  editID!: string;
  copyID!:string;
  infoID!: string;
  printID:string="";
  setOrderID!: string | null;
  setPOID!:string | null;

  targetOrderID!: string | null;
  targetWorkOrderID!:string | null;
  setPOIDs!: string[];
  setWorkOrderIDs!: string[];
  setReceivingID!: string | null;
  setReWorkOrders!:string[];

}
