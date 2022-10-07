export class CmpnyModel {
    CompanyId: number
    CompanyDetails: string
    CompanyAddrs: string
    CompanyNm: string
    CompanyCntry: Date
    UserID: any
 
     constructor(CompanyId: number, CompanyDetails: string, CompanyAddrs: string, CompanyNm: string, CompanyCntry: Date, UserID: any){
         this.CompanyId = CompanyId;
         this.CompanyDetails = CompanyDetails;
         this.CompanyAddrs = CompanyAddrs;
         this.CompanyNm = CompanyNm;
         this.CompanyCntry = CompanyCntry;
         this.UserID = UserID
     }
 }