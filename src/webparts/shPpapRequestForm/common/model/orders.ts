export interface IOrdersListItem {
  ID: string;
  ItemNbr: string;
  PPAPOrderNumber: string;
  ItemNm: string;
  SQANm: string;
  PARMANm: string;
  PPAPplannedweek: string;
  PPAPPartWeightCode: string;
  PPAPPartWeight: string;
  RevisionCode: string;
  DrawingVersion: string;
  ItemValidIssue: string;
  GPSDrawingNumber: string;
  SQASection:string, 
  SQACd:string, 
  PPAPorderdate:string, 
  PPAPOrderarrweek:string, 
  PPAPapprovalweek:string, 
  PPAPPlanY:string,
  SupplierEmail: string
}

export interface ISelectedOrdersListItem extends IOrdersListItem{
  rcFlag: boolean,
  wcFlag: boolean,
  weightFlag: boolean,
  dvFlag: boolean,
  
}
