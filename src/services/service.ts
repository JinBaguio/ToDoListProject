import { sqlRepository } from '../repositories/sqlRepository';
import { LoggingModel } from '../models/loggingModel';
import { CmpnyModel } from '../models/CmpnyModel';

export class Service {
    private sqlRepo = new sqlRepository();   
        constructor() {
    }

    public getCompany(userId: any): Promise<any> {
        return this.sqlRepo.getUserDetails(userId).then(()=>{
            if(userId != null) {
                return this.sqlRepo.getCompany();
            } else {
                return JSON.stringify('Invalid Transaction');
            }
        });
    }

    public deleteCompany(companyId: number, userId: any): Promise<any> {
        return this.sqlRepo.getUserDetails(userId).then(()=>{
            if(userId != null) {
                return this.sqlRepo.deleteCompany(companyId);
            } else {
                return JSON.stringify('Invalid Transaction');
            }
        });
    }

    public updateCompany(myList: CmpnyModel): Promise<any> {
        return this.sqlRepo.getUserDetails(myList.UserID).then(()=>{
            if(myList.UserID != null) {
                return this.sqlRepo.updateCompany(myList);
            } else {
                return JSON.stringify('Invalid Transaction');
            }
        });
    }

    public insertToLogs (myList: LoggingModel) : Promise<any> {
        return this.sqlRepo.insertToLogs(myList);
    }

    public insertCompany(myList: CmpnyModel): Promise<any> {
        return this.sqlRepo.getUserDetails(myList.UserID).then(()=>{
            if(myList.UserID != null) {
                return this.sqlRepo.insertCompany(myList);
            } else {
                return JSON.stringify('Invalid Transaction');
            }
        });
    }

    public insertClient(myList: CmpnyModel, userId: number): Promise<any> {
        return this.sqlRepo.getUserDetails(userId).then(()=>{
            return this.sqlRepo.updateUserDtls(userId).then(()=>{
                if(myList.UserID == null) {
                    return this.sqlRepo.insertCompany(myList.UserID)
                } else {
                    return JSON.stringify('Invalid Transaction');
                }
            });
        })
    }
}
