export interface quotationDataInfo {
  quotationDetailID?: string,//報價單明細編號
  quotationID?: string,//報價單號
  materialID?: string,//材料編號
  processingType?: string,//加工類型

  quantity: number,//數量
  unitPrice: number,//單價
  subtotal: number,//小計

  thickness?: number,//厚度
  width?: number,//寬度
  length?: number,//長度
  weight?: number,//重量
  diameter?: number,//直徑
  outerDiameter?: number,//外徑
  innerThickness?: number,//內徑
  cuttingSize?: number,//待切尺寸
  surfaceTreatment?: string,//表面處理
  specification?: string,//規格說明

  createAt?: string,//建立時間
  createClerk?: string,//建立員工名稱

  updateAt?: string,//更新時間
  updateClerk?: string,//更新員工名稱
}
