import { Routes } from '@angular/router';
import { TransformPageComponent } from './transform-page/transform-page.component';
import { HomePageComponent } from './home-page/home-page.component';
import { QuotationComponent } from './quotation/quotation.component';
import { AddQuotationComponent } from './add-quotation/add-quotation.component';
import { QuotationInfoComponent } from './quotation-info/quotation-info.component';
import { EditQuotationComponent } from './edit-quotation/edit-quotation.component';
import { OrderComponent } from './order/order.component';
import { OrderInfoComponent } from './order-info/order-info.component';
import { EditOrderComponent } from './edit-order/edit-order.component';
import { AddOrderComponent } from './add-order/add-order.component';
import { PurchaseOrderComponent } from './purchase-order/purchase-order.component';
import { PoInfoComponent } from './po-info/po-info.component';
import { AddPOComponent } from './add-po/add-po.component';
import { EditPOComponent } from './edit-po/edit-po.component';
import { ReceivingInfoComponent } from './receiving-info/receiving-info.component';
import { AddReceivingComponent } from './add-receiving/add-receiving.component';
import { EditReceivingComponent } from './edit-receiving/edit-receiving.component';
import { ReceivingComponent } from './receiving/receiving.component';
import { AddWorkOrderComponent } from './add-work-order/add-work-order.component';
import { WorkOrderComponent } from './work-order/work-order.component';
import { WorkOrderInfoComponent } from './work-order-info/work-order-info.component';
import { EditWorkOrderComponent } from './edit-work-order/edit-work-order.component';
import { ReWorkOrderInfoComponent } from './re-work-order-info/re-work-order-info.component';
import { ReWorkOrderComponent } from './re-work-order/re-work-order.component';
import { AddReWorkOrderComponent } from './add-re-work-order/add-re-work-order.component';
import { EditReWorkOrderComponent } from './edit-re-work-order/edit-re-work-order.component';
import { PartnerComponent } from './partner/partner.component';
import { PartnerInfoComponent } from './partner-info/partner-info.component';
import { AddPartnerComponent } from './add-partner/add-partner.component';
import { EditPartnerComponent } from './edit-partner/edit-partner.component';
import { EmployeeComponent } from './employee/employee.component';
import { AddEmployeeComponent } from './add-employee/add-employee.component';
import { EmployeeInfoComponent } from './employee-info/employee-info.component';
import { EditEmployeeComponent } from './edit-employee/edit-employee.component';
import { Register1Component } from './register/register1/register1.component';
import { Register2Component } from './register/register2/register2.component';
import { Register3Component } from './register/register3/register3.component';

export const routes: Routes = [
  {
    path: "TransformPage", component: TransformPageComponent,
    children: [
      { path: "homePage", component: HomePageComponent },
      { path: "quotationPage", component: QuotationComponent },
      { path: "addQuotationPage", component: AddQuotationComponent },
      { path: "quotationInfoPage", component: QuotationInfoComponent },
      { path: "editQuotationPage", component: EditQuotationComponent },

      { path: "orderPage", component: OrderComponent },
      { path: "addOrderPage", component: AddOrderComponent },
      { path: "orderInfoPage", component: OrderInfoComponent },
      { path: "editOrderPage", component: EditOrderComponent },

      { path: "poPage", component: PurchaseOrderComponent },
      { path: "addPOPage", component: AddPOComponent },
      { path: "poInfoPage", component: PoInfoComponent },
      { path: "editPOPage", component: EditPOComponent },

      { path: "receivingPage", component: ReceivingComponent },
      { path: "addReceivingPage", component: AddReceivingComponent },
      { path: "receivingInfoPage", component: ReceivingInfoComponent },
      { path: "editReceivingPage", component: EditReceivingComponent },

      { path: "workOrderPage", component: WorkOrderComponent },
      { path: "addWorkOrderPage", component: AddWorkOrderComponent },
      { path: "workOrderInfoPage", component: WorkOrderInfoComponent },
      { path: "editWorkOrderPage", component: EditWorkOrderComponent },

      { path: "reWorkOrderPage", component: ReWorkOrderComponent },
      { path: "addReWorkOrderPage", component: AddReWorkOrderComponent },
      { path: "reWorkOrderInfoPage", component: ReWorkOrderInfoComponent },
      { path: "editReWorkOrderPage", component: EditReWorkOrderComponent },

      { path: "partnerPage", component: PartnerComponent },
      { path: "partnerInfoPage", component: PartnerInfoComponent },
      { path: "addPartnerPage", component: AddPartnerComponent },
      { path: "editPartnerPage", component: EditPartnerComponent },

      { path: "employeePage", component: EmployeeComponent },
      { path: "employeeInfoPage", component: EmployeeInfoComponent },
      { path: "addEmployeePage", component: AddEmployeeComponent },
      { path: "editEmployeePage", component: EditEmployeeComponent },
    ]
  },
  { path: "register1Page", component: Register1Component },
  { path: "register2Page", component: Register2Component },
  { path: "register3Page", component: Register3Component },
];
