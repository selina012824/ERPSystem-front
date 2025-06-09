import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { DataService } from '../@service/dataService';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-transform-page',
  imports: [RouterOutlet, MatIconModule, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './transform-page.component.html',
  styleUrl: './transform-page.component.scss'
})
export class TransformPageComponent {

  constructor(private router: Router, private dataService: DataService) { }
  logIn: Boolean = true;
  isSideAreaOpen: Boolean = false;

  toggleSideArea() {
    this.isSideAreaOpen = !this.isSideAreaOpen;
  }

  logout() {
    sessionStorage.setItem('successMessage', 'ログアウト成功しました');
    this.dataService.employeeID = "";
    this.router.navigateByUrl('/');
    this.router.navigateByUrl('/').then(() => {
      location.reload();
    });
  }

  ngOnInit(): void {

    if (this.logIn) {
      //報價單明細資料
      let quotationData1Info = {
        quotationDetailID: "Q1",//報價單明細編號
        quotationID: "1234567",//報價單號
        materialID: "M123",//材料編號
        processingType: "不銹鋼板材",//加工類型

        quantity: 20,//數量
        unitPrice: 32.4,//單價
        subtotal: 648,//小計

        thickness: 0.51,//厚度
        width: 1.24,//寬度
        length: 2.48,//長度
        weight: 4.5,//重量
        diameter: 0.26,//直徑
        outerDiameter: 0.73,//外徑
        innerThickness: 0.37,//內徑
        cuttingSize: 1.5,//待切尺寸
        surfaceTreatment: "磨平",//表面處理
        specification: "依公司規定xx號yy項處理",//規格說明

        createAt: "2025-03-13 15:30:00",//建立時間
        createClerk: "林曉美",//建立員工名稱

        updateAt: "2025-03-16 9:50:00",//更新時間
        updateClerk: "李XX",//更新員工名稱
      }

      let quotationInfos = [];
      quotationInfos.push(quotationData1Info);


      //報價單假資料
      let quotationData1 = {

        quotationID: "Q1234567",//報價單號
        quotationDate: "2025-03-13",//報價日期
        quotationType: "1",//報價來源

        customerID: "C1",//客戶編號
        customerName: "王曉明",//客戶名稱
        customerNickname: "曉",//客戶簡稱
        contactor: "王曉明",//聯絡人
        inResponse: "王曉明",//負責人
        phone: "075512345",//電話號碼
        cellPhone: "0912345678",//手機號碼
        faxNumber: "EKSLDMO112",//傳真號碼
        taxNumber: "81234567",//統一編號
        address: "高雄市大樹區義守大學國際大樓11F",//客戶地址
        shipAddress: "高雄市大樹區義守大學國際大樓11F",//送貨地址
        invoiceAddress: "高雄市大樹區義守大學國際大樓11F",//發票地址
        payBy: "銀行轉帳",//付款方式

        subtotal: 648,
        tax: 20,
        total: 668,
        totalAmount: 668,

        validDate: "2025-03-20",//有效期限
        remark: "1.交貨時，請先連絡xxx先生，以備安排收貨  2.提供樣品1份，以便確認品質後下單",//備註
        ifSetOrder: "1",//是否建立了訂單
        setOrderDate: "2025-03-16",//建立訂單時間

        createAt: "2025-03-13 15:30:00",//建立時間
        createClerk: "林曉美",//建立員工名稱

        updateAt: "2025-03-16 9:50:00",//更新時間
        updateClerk: "李XX",//更新員工名稱

        quotationInfo: quotationInfos//報價單明細

      }

      this.dataService.quotationData.push(quotationData1);



      //訂單=============================================================================

      let orderInfos1 = {
        orderDetailID: "Q1",//訂單明細編號
        orderID: "1234567",//訂單編號
        materialID: "M123",//材料編號
        processingType: "不銹鋼板材",//加工類型

        quantity: 20,//數量
        unitPrice: 32.4,//單價
        subtotal: 648,//小計

        thickness: 0.51,//厚度
        width: 1.24,//寬度
        length: 2.48,//長度
        weight: 4.5,//重量
        diameter: 0.26,//直徑
        outerDiameter: 0.73,//外徑
        innerThickness: 0.37,//內徑
        cuttingSize: 1.5,//待切尺寸
        surfaceTreatment: "磨平",//表面處理
        specification: "依公司規定xx號yy項處理",//規格說明

        createAt: "2025-03-13 15:30:00",//建立時間
        createClerk: "林曉美",//建立員工名稱

        updateAt: "2025-03-16 9:50:00",//更新時間
        updateClerk: "李XX",//更新員工名稱
      }

      // 訂單明細2
      let orderInfos2 = {
        orderDetailID: "Q2", // 訂單明細編號
        orderID: "1234567", // 訂單編號
        materialID: "M124", // 材料編號
        processingType: "不鏽鋼管", // 加工類型
        quantity: 15, // 數量
        unitPrice: 25.6, // 單價
        subtotal: 384, // 小計
        thickness: 0.30, // 厚度
        width: 1.20, // 寬度
        length: 2.30, // 長度
        weight: 3.8, // 重量
        diameter: 0.20, // 直徑
        outerDiameter: 0.60, // 外徑
        innerThickness: 0.35, // 內徑
        cuttingSize: 1.2, // 待切尺寸
        surfaceTreatment: "陽極氧化", // 表面處理
        specification: "依客戶要求處理", // 規格說明
        createAt: "2025-03-14 10:00:00", // 建立時間
        createClerk: "王小明", // 建立員工名稱
        updateAt: "2025-03-17 8:20:00", // 更新時間
        updateClerk: "張XX" // 更新員工名稱
      };

      // 訂單明細3
      let orderInfos3 = {
        orderDetailID: "Q3", // 訂單明細編號
        orderID: "1234567", // 訂單編號
        materialID: "M125", // 材料編號
        processingType: "不鏽鋼角鐵", // 加工類型
        quantity: 10, // 數量
        unitPrice: 48.0, // 單價
        subtotal: 480, // 小計
        thickness: 0.45, // 厚度
        width: 1.15, // 寬度
        length: 2.00, // 長度
        weight: 5.0, // 重量
        diameter: 0.22, // 直徑
        outerDiameter: 0.70, // 外徑
        innerThickness: 0.40, // 內徑
        cuttingSize: 1.4, // 待切尺寸
        surfaceTreatment: "電鍍", // 表面處理
        specification: "依國際標準", // 規格說明
        createAt: "2025-03-14 15:30:00", // 建立時間
        createClerk: "劉一鳴", // 建立員工名稱
        updateAt: "2025-03-17 10:30:00", // 更新時間
        updateClerk: "張XX" // 更新員工名稱
      };

      let orderInfos = [];
      orderInfos.push(orderInfos1);

      let orderData1 = {
        orderID: "O1234567",//訂單編號
        estScrapID: "E12",//預估廢料編號
        customerID: "C1",//客戶編號
        orderDate: "2025-03-16",//訂單成立日期
        deliveryDate: "2025-04-16",//預計交期
        status: "待處理",//狀態(會有終止、完成、待處理、等待派工、派工中、派工終止、派工完成、等待再派工、再派工中、再派工終止、再派工完成、等待出貨、出貨中)
        subtotal: 1512,//合計
        tax: 138,//稅收
        totalAmount: 1650,  //總金額
        paymentTerms: "銀行轉帳",//付款條件
        createAt: "2025-03-16 15:30:00",//建立時間
        createClerk: "林曉美",//建立員工名稱

        updateAt: "2025-03-16 9:50:00",//更新時間
        updateClerk: "李XX",//更新員工名稱
        orderInfo: [orderInfos1, orderInfos2, orderInfos3]
      }

      // 訂單資料2
      let orderData2 = {
        orderID: "O1234568", // 訂單編號
        estScrapID: "E13", // 預估廢料編號
        customerID: "C2", // 客戶編號
        orderDate: "2025-03-18", // 訂單成立日期
        deliveryDate: "2025-04-18", // 預計交期
        status: "派工處理中", // 訂單狀態
        subtotal: 1512,//合計
        tax: 232,//稅額
        totalAmount: 1744, // 總金額
        paymentTerms: "現金付款", // 付款條件
        createAt: "2025-03-18 10:30:00", // 建立時間
        createClerk: "王小明", // 建立員工名稱
        updateAt: "2025-03-19 11:50:00", // 更新時間
        updateClerk: "張XX", // 更新員工名稱
        orderInfo: [orderInfos1, orderInfos2, orderInfos3] // 訂單明細
      };

      // 訂單資料2
      let orderData3 = {
        orderID: "O1234569", // 訂單編號
        estScrapID: "E13", // 預估廢料編號
        customerID: "C2", // 客戶編號
        orderDate: "2025-03-18", // 訂單成立日期
        deliveryDate: "2025-04-18", // 預計交期
        status: "採購處理中", // 訂單狀態
        subtotal: 1512,//合計
        tax: 232,//稅額
        totalAmount: 1744, // 總金額
        paymentTerms: "現金付款", // 付款條件
        createAt: "2025-03-18 10:30:00", // 建立時間
        createClerk: "王小明", // 建立員工名稱
        updateAt: "2025-03-19 11:50:00", // 更新時間
        updateClerk: "張XX", // 更新員工名稱
        orderInfo: [orderInfos1, orderInfos2, orderInfos3] // 訂單明細
      };


      // 訂單資料4
      let orderData4 = {
        orderID: "O1234570", // 訂單編號
        estScrapID: "E14", // 預估廢料編號
        customerID: "C4", // 客戶編號
        orderDate: "2025-03-20", // 訂單成立日期
        deliveryDate: "2025-04-20", // 預計交期
        status: "再派工處理中", // 訂單狀態
        subtotal: 864,//合計
        tax: 134,//稅額
        totalAmount: 998, // 總金額
        paymentTerms: "先付一半訂金，納品後結清", // 付款條件
        createAt: "2025-03-20 08:30:00", // 建立時間
        createClerk: "李志強", // 建立員工名稱
        updateAt: "2025-03-21 12:30:00", // 更新時間
        updateClerk: "蘇XX", // 更新員工名稱
        orderInfo: [orderInfos2, orderInfos3] // 訂單明細
      };

      // 訂單資料7
      let orderData7 = {
        orderID: "O1234573", // 訂單編號
        estScrapID: "E14", // 預估廢料編號
        customerID: "C4", // 客戶編號
        orderDate: "2025-03-20", // 訂單成立日期
        deliveryDate: "2025-04-20", // 預計交期
        status: "派工終止", // 訂單狀態
        subtotal: 864,//合計
        tax: 134,//稅額
        totalAmount: 998, // 總金額
        paymentTerms: "先付一半訂金，納品後結清", // 付款條件
        createAt: "2025-03-20 08:30:00", // 建立時間
        createClerk: "李志強", // 建立員工名稱
        updateAt: "2025-03-21 12:30:00", // 更新時間
        updateClerk: "蘇XX", // 更新員工名稱
        orderInfo: [orderInfos2, orderInfos3] // 訂單明細
      };

      // 訂單資料8
      let orderData8 = {
        orderID: "O1234574", // 訂單編號
        estScrapID: "E14", // 預估廢料編號
        customerID: "C4", // 客戶編號
        orderDate: "2025-03-20", // 訂單成立日期
        deliveryDate: "2025-04-20", // 預計交期
        status: "派工完成", // 訂單狀態
        subtotal: 864,//合計
        tax: 134,//稅額
        totalAmount: 998, // 總金額
        paymentTerms: "先付一半訂金，納品後結清", // 付款條件
        createAt: "2025-03-20 08:30:00", // 建立時間
        createClerk: "李志強", // 建立員工名稱
        updateAt: "2025-03-21 12:30:00", // 更新時間
        updateClerk: "蘇XX", // 更新員工名稱
        orderInfo: [orderInfos2, orderInfos3] // 訂單明細
      };

      // 訂單資料9
      let orderData9 = {
        orderID: "O1234575", // 訂單編號
        estScrapID: "E14", // 預估廢料編號
        customerID: "C4", // 客戶編號
        orderDate: "2025-03-20", // 訂單成立日期
        deliveryDate: "2025-04-20", // 預計交期
        status: "再派工終止", // 訂單狀態
        subtotal: 864,//合計
        tax: 134,//稅額
        totalAmount: 998, // 總金額
        paymentTerms: "先付一半訂金，納品後結清", // 付款條件
        createAt: "2025-03-20 08:30:00", // 建立時間
        createClerk: "李志強", // 建立員工名稱
        updateAt: "2025-03-21 12:30:00", // 更新時間
        updateClerk: "蘇XX", // 更新員工名稱
        orderInfo: [orderInfos2, orderInfos3] // 訂單明細
      };

      // 訂單資料10
      let orderData10 = {
        orderID: "O1234576", // 訂單編號
        estScrapID: "E14", // 預估廢料編號
        customerID: "C4", // 客戶編號
        orderDate: "2025-03-20", // 訂單成立日期
        deliveryDate: "2025-04-20", // 預計交期
        status: "再派工完成", // 訂單狀態
        subtotal: 864,//合計
        tax: 134,//稅額
        totalAmount: 998, // 總金額
        paymentTerms: "先付一半訂金，納品後結清", // 付款條件
        createAt: "2025-03-20 08:30:00", // 建立時間
        createClerk: "李志強", // 建立員工名稱
        updateAt: "2025-03-21 12:30:00", // 更新時間
        updateClerk: "蘇XX", // 更新員工名稱
        orderInfo: [orderInfos2, orderInfos3] // 訂單明細
      };

      // 訂單資料10
      let orderData11 = {
        orderID: "O1234577", // 訂單編號
        estScrapID: "E14", // 預估廢料編號
        customerID: "C4", // 客戶編號
        orderDate: "2025-03-20", // 訂單成立日期
        deliveryDate: "2025-04-20", // 預計交期
        status: "終止", // 訂單狀態
        subtotal: 864,//合計
        tax: 134,//稅額
        totalAmount: 998, // 總金額
        paymentTerms: "先付一半訂金，納品後結清", // 付款條件
        createAt: "2025-03-20 08:30:00", // 建立時間
        createClerk: "李志強", // 建立員工名稱
        updateAt: "2025-03-21 12:30:00", // 更新時間
        updateClerk: "蘇XX", // 更新員工名稱
        orderInfo: [orderInfos2, orderInfos3] // 訂單明細
      };
      // 訂單資料10
      let orderData12 = {
        orderID: "O1234578", // 訂單編號
        estScrapID: "E14", // 預估廢料編號
        customerID: "C4", // 客戶編號
        orderDate: "2025-03-20", // 訂單成立日期
        deliveryDate: "2025-04-20", // 預計交期
        status: "完成", // 訂單狀態
        subtotal: 864,//合計
        tax: 134,//稅額
        totalAmount: 998, // 總金額
        paymentTerms: "先付一半訂金，納品後結清", // 付款條件
        createAt: "2025-03-20 08:30:00", // 建立時間
        createClerk: "李志強", // 建立員工名稱
        updateAt: "2025-03-21 12:30:00", // 更新時間
        updateClerk: "蘇XX", // 更新員工名稱
        orderInfo: [orderInfos2, orderInfos3] // 訂單明細
      };

      this.dataService.orderData.push(orderData1);
      this.dataService.orderData.push(orderData2);
      this.dataService.orderData.push(orderData3);
      this.dataService.orderData.push(orderData4);
      this.dataService.orderData.push(orderData7);
      this.dataService.orderData.push(orderData8);
      this.dataService.orderData.push(orderData9);
      this.dataService.orderData.push(orderData10);
      this.dataService.orderData.push(orderData11);
      this.dataService.orderData.push(orderData12);


      //採購單=============================================================================

      let poInfoData1 = {
        poDetailID: "P1", // 採購單明細編號
        purchaseOrderID: "1234567", // 訂單編號
        materialID: "M123",//材料編號
        processingType: "不銹鋼板材",//加工類型

        quantity: 20,//數量
        unitPrice: 32.4,//單價
        subtotal: 648,//小計

        thickness: 0.51,//厚度
        width: 1.24,//寬度
        length: 2.48,//長度
        weight: 4.5,//重量
        diameter: 0.26,//直徑
        outerDiameter: 0.73,//外徑
        innerThickness: 0.37,//內徑
        cuttingSize: 1.5,//待切尺寸
        surfaceTreatment: "磨平",//表面處理
        specification: "依公司規定xx號yy項處理",//規格說明

        createAt: "2025-03-13 15:30:00",//建立時間
        createClerk: "林曉美",//建立員工名稱

        updateAt: "2025-03-16 9:50:00",//更新時間
        updateClerk: "李XX",//更新員工名稱
      }

      let poData1 = {
        purchaseOrderID: "P1234567",
        orderID: "O1234569",
        supplierID: "XX廠商",
        orderDate: "2025-03-21",
        deliveryDate: "2025-04-12",
        status: "簽核完成",
        isApproved: "Y",
        approvedBy: "林曉美",
        approvedAt: "2025-03-13 15:30:00",
        subtotal: 648,
        tax: 23,
        totalAmount: 671,

        createAt: "2025-03-13 15:30:00",//建立時間
        createClerk: "林曉美",//建立員工名稱

        updateAt: "2025-03-16 9:50:00",//更新時間
        updateClerk: "李XX",//更新員工名稱

        poInfo: [poInfoData1]

      }

      let poData2 = {
        purchaseOrderID: "P1234568",
        orderID: "O1234569",
        supplierID: "XX廠商",
        orderDate: "2025-03-21",
        deliveryDate: "2025-04-12",
        status: "簽核完成",
        isApproved: "N",
        approvedBy: "林曉美",
        approvedAt: "2025-03-13 15:30:00",
        subtotal: 648,
        tax: 23,
        totalAmount: 671,

        createAt: "2025-03-13 15:30:00",//建立時間
        createClerk: "林曉美",//建立員工名稱

        updateAt: "2025-03-16 9:50:00",//更新時間
        updateClerk: "李XX",//更新員工名稱

        poInfo: [poInfoData1]

      }

      this.dataService.poData.push(poData1);
      this.dataService.poData.push(poData2);

      //進貨單=============================================================================
      let receivingInfoData1 = {
        receivingDetailID: "R1",
        receivingID: "R1234567",
        materialID: "M123",
        quantityReceived: 20,
        quantityAccepted: 18,
        quantityRejected: 2,
        storageLocation: "A1倉庫",
        stockStatus: "未入庫"
      }


      let receivingData1 = {
        receivingID: "R1234567",
        purchaseOrderID: "P1234567",
        receivingDate: "2025-04-12",
        status: "待處理",
        inspector: "李XX",
        inspectionResult: "N",
        supplierID: "XX廠商",

        createAt: "2025-03-13 15:30:00",//建立時間
        createClerk: "林曉美",//建立員工名稱

        updateAt: "2025-03-16 9:50:00",//更新時間
        updateClerk: "李XX",//更新員工名稱

        invoiceStatus: "未開立",

        receivingInfo: [receivingInfoData1]
      }

      let receivingData2 = {
        receivingID: "R1234568",
        purchaseOrderID: "P1234567",
        receivingDate: "2025-04-12",
        status: "進貨中",
        inspector: "李XX",
        inspectionResult: "Y",
        supplierID: "XX廠商",

        createAt: "2025-03-13 15:30:00",//建立時間
        createClerk: "林曉美",//建立員工名稱

        updateAt: "2025-03-16 9:50:00",//更新時間
        updateClerk: "李XX",//更新員工名稱

        invoiceStatus: "未開立",

        receivingInfo: [receivingInfoData1]
      }


      let receivingData3 = {
        receivingID: "R1234569",
        purchaseOrderID: "P1234567",
        receivingDate: "2025-04-12",
        status: "完成",
        inspector: "李XX",
        inspectionResult: "Y",
        supplierID: "XX廠商",

        createAt: "2025-03-13 15:30:00",//建立時間
        createClerk: "林曉美",//建立員工名稱

        updateAt: "2025-03-16 9:50:00",//更新時間
        updateClerk: "李XX",//更新員工名稱

        invoiceStatus: "未開立",

        receivingInfo: [receivingInfoData1]
      }



      this.dataService.receivingData.push(receivingData1);
      this.dataService.receivingData.push(receivingData2);
      this.dataService.receivingData.push(receivingData3);

      //派工單=============================================================================

      let workOrderInfos1 = {
        workOrderDetailID: "W1", // 派工單明細編號
        workOrderID: "1234567", // 派工單號
        materialID: "M124", // 材料編號
        processingType: "不鏽鋼管", // 加工類型
        quantity: 15, // 數量
        unitPrice: 25.6, // 單價
        subtotal: 384, // 小計
        thickness: 0.30, // 厚度
        width: 1.20, // 寬度
        length: 2.30, // 長度
        weight: 3.8, // 重量
        diameter: 0.20, // 直徑
        outerDiameter: 0.60, // 外徑
        innerThickness: 0.35, // 內徑
        cuttingSize: 1.2, // 待切尺寸
        surfaceTreatment: "陽極氧化", // 表面處理
        specification: "依客戶要求處理", // 規格說明
        createAt: "2025-03-14 10:00:00", // 建立時間
        createClerk: "王小明", // 建立員工名稱
        updateAt: "2025-03-17 8:20:00", // 更新時間
        updateClerk: "張XX" // 更新員工名稱
      };

      let workOrderData1 = {
        workOrderID: "W1234567",
        orderID: "O1234568",
        status: "待處理",
        plannedStartDate: "2025-03-21",
        plannedEndDate: "2025-04-12",
        actualStartDate: "",
        actualEndDate: "",
        createAt: "2025-03-18 10:30:00", // 建立時間
        createClerk: "王小明", // 建立員工名稱
        updateAt: "2025-03-19 11:50:00", // 更新時間
        updateClerk: "張XX", // 更新員工名稱
        workOrderInfo: [workOrderInfos1],
      }

      let workOrderData2 = {
        workOrderID: "W1234568",
        orderID: "O1234568",
        status: "派工中",
        plannedStartDate: "2025-03-21",
        plannedEndDate: "2025-04-12",
        actualStartDate: "2025-03-22",
        actualEndDate: "",
        createAt: "2025-03-20 08:30:00", // 建立時間
        createClerk: "李志強", // 建立員工名稱
        updateAt: "2025-03-21 12:30:00", // 更新時間
        updateClerk: "蘇XX", // 更新員工名稱
        workOrderInfo: [workOrderInfos1],
      }

      let workOrderData5 = {
        workOrderID: "W1234571",
        orderID: "O1234570",
        status: "再派工中",
        plannedStartDate: "2025-03-21",
        plannedEndDate: "2025-04-12",
        actualStartDate: "2025-03-22",
        actualEndDate: "",
        createAt: "2025-03-20 08:30:00", // 建立時間
        createClerk: "李志強", // 建立員工名稱
        updateAt: "2025-03-21 12:30:00", // 更新時間
        updateClerk: "蘇XX", // 更新員工名稱
        workOrderInfo: [workOrderInfos1],
      }

      let workOrderData3 = {
        workOrderID: "W1234569",
        orderID: "O1234574",
        status: "完成",
        plannedStartDate: "2025-03-21",
        plannedEndDate: "2025-04-12",
        actualStartDate: "2025-03-22",
        actualEndDate: "2025-04-13",
        createAt: "2025-03-20 08:30:00", // 建立時間
        createClerk: "李志強", // 建立員工名稱
        updateAt: "2025-03-21 12:30:00", // 更新時間
        updateClerk: "蘇XX", // 更新員工名稱
        workOrderInfo: [workOrderInfos1],
      }
      let workOrderData4 = {
        workOrderID: "W1234570",
        orderID: "O1234573",
        status: "終止",
        plannedStartDate: "2025-03-21",
        plannedEndDate: "2025-04-12",
        actualStartDate: "2025-03-22",
        actualEndDate: "",
        createAt: "2025-03-20 08:30:00", // 建立時間
        createClerk: "李志強", // 建立員工名稱
        updateAt: "2025-03-21 12:30:00", // 更新時間
        updateClerk: "蘇XX", // 更新員工名稱
        workOrderInfo: [workOrderInfos1],
      }

      this.dataService.workOrderData.push(workOrderData1);
      this.dataService.workOrderData.push(workOrderData2);
      this.dataService.workOrderData.push(workOrderData5);
      this.dataService.workOrderData.push(workOrderData3);
      this.dataService.workOrderData.push(workOrderData4);

      //再派工單===========================================================================
      let reWorkOrderInfos1 = {
        reWorkOrderDetailID: "RW1", // 再派工單明細編號
        reWorkOrderID: "W1234567", // 再派工單號
        materialID: "M124", // 材料編號
        processingType: "不鏽鋼管", // 加工類型
        quantity: 15, // 數量
        unitPrice: 25.6, // 單價
        subtotal: 384, // 小計
        thickness: 0.30, // 厚度
        width: 1.20, // 寬度
        length: 2.30, // 長度
        weight: 3.8, // 重量
        diameter: 0.20, // 直徑
        outerDiameter: 0.60, // 外徑
        innerThickness: 0.35, // 內徑
        cuttingSize: 1.2, // 待切尺寸
        surfaceTreatment: "陽極氧化", // 表面處理
        specification: "依客戶要求處理", // 規格說明
        createAt: "2025-03-14 10:00:00", // 建立時間
        createClerk: "王小明", // 建立員工名稱
        updateAt: "2025-03-17 8:20:00", // 更新時間
        updateClerk: "張XX" // 更新員工名稱
      };

      let reWorkOrderData1 = {
        reWorkOrderID: "RW1234567",//再派工單號
        orderID: "O1234569",//訂單編號
        workOrderID: "W1234571",//(再)派工單號
        status: "待處理",
        plannedStartDate: "2025-04-02",
        plannedEndDate: "2025-04-10",
        actualStartDate: "",
        actualEndDate: "",
        createAt: "2025-03-20 08:30:00", // 建立時間
        createClerk: "李志強", // 建立員工名稱
        updateAt: "2025-03-21 12:30:00", // 更新時間
        updateClerk: "蘇XX", // 更新員工名稱
        reWorkOrderInfo: [reWorkOrderInfos1],
      }

      let reWorkOrderData2 = {
        reWorkOrderID: "RW1234568",//再派工單號
        orderID: "O1234569",//訂單編號
        workOrderID: "W1234571",//(再)派工單號
        status: "派工中",
        plannedStartDate: "2025-04-02",
        plannedEndDate: "2025-04-10",
        actualStartDate: "2025-04-03",
        actualEndDate: "",
        createAt: "2025-03-20 08:30:00", // 建立時間
        createClerk: "李志強", // 建立員工名稱
        updateAt: "2025-03-21 12:30:00", // 更新時間
        updateClerk: "蘇XX", // 更新員工名稱
        reWorkOrderInfo: [reWorkOrderInfos1],
      }

      let reWorkOrderData3 = {
        reWorkOrderID: "RW1234569",//再派工單號
        orderID: "O1234569",//訂單編號
        workOrderID: "RW1234568",//(再)派工單號
        status: "再派工中",
        plannedStartDate: "2025-04-02",
        plannedEndDate: "2025-04-10",
        actualStartDate: "2025-04-03",
        actualEndDate: "2025-04-11",
        createAt: "2025-03-20 08:30:00", // 建立時間
        createClerk: "李志強", // 建立員工名稱
        updateAt: "2025-03-21 12:30:00", // 更新時間
        updateClerk: "蘇XX", // 更新員工名稱
        reWorkOrderInfo: [reWorkOrderInfos1],
      }

      let reWorkOrderData4 = {
        reWorkOrderID: "RW1234570",//再派工單號
        orderID: "O1234569",//訂單編號
        workOrderID: "RW1234568",//(再)派工單號
        status: "終止",
        plannedStartDate: "2025-04-02",
        plannedEndDate: "2025-04-10",
        actualStartDate: "2025-04-03",
        actualEndDate: "",
        createAt: "2025-03-20 08:30:00", // 建立時間
        createClerk: "李志強", // 建立員工名稱
        updateAt: "2025-03-21 12:30:00", // 更新時間
        updateClerk: "蘇XX", // 更新員工名稱
        reWorkOrderInfo: [reWorkOrderInfos1],
      }

      let reWorkOrderData5 = {
        reWorkOrderID: "RW1234571",//再派工單號
        orderID: "O1234569",//訂單編號
        workOrderID: "RW1234568",//(再)派工單號
        status: "完成",
        plannedStartDate: "2025-04-02",
        plannedEndDate: "2025-04-10",
        actualStartDate: "2025-04-03",
        actualEndDate: "2025-04-03",
        createAt: "2025-03-20 08:30:00", // 建立時間
        createClerk: "李志強", // 建立員工名稱
        updateAt: "2025-03-21 12:30:00", // 更新時間
        updateClerk: "蘇XX", // 更新員工名稱
        reWorkOrderInfo: [reWorkOrderInfos1],
      }

      this.dataService.reWorkOrderData.push(reWorkOrderData1);
      this.dataService.reWorkOrderData.push(reWorkOrderData2);
      this.dataService.reWorkOrderData.push(reWorkOrderData3);
      this.dataService.reWorkOrderData.push(reWorkOrderData4);
      this.dataService.reWorkOrderData.push(reWorkOrderData5);
    }

    this.logIn = false
  }
}

