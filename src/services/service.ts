import { sqlRepository } from '../repositories/sqlRepository';
import { SalesTransferModel } from '../models/salesTransferModel';
import { GidSsnModel } from '../models/gidSsnModel';
import { ReEnrollVeipEsppModel } from '../models/reEnrollVeipEsppModel';
import { LoggingModel } from '../models/loggingModel';
import { GrantCodeModel } from '../models/grantCodeModel'; //JJJ
import { TermCancellationModel } from '../models/processTermCancellationModel';
import { EAAccessModel } from '../models/eaAccessModel';
import { OfficerCodeModel } from '../models/officerCodeModel';


export class FileService {
    private sqlRepo = new sqlRepository();
    
    constructor() {

    }

    public getSpecificGrant(): Promise<any> {
        return this.sqlRepo.getSpecificGrant();
    }
    public getGidSsn(optioneeId: string): Promise<any> {
        return this.sqlRepo.getGidSsn(optioneeId);
    }
    public updateGidSsn(myList: GidSsnModel): Promise<any> {
        return this.sqlRepo.updateGidSsn(myList);
    }
    public processSalesTransferDeletion(myList: SalesTransferModel): Promise<any> {
        return this.sqlRepo.processSalesTransferDeletion(myList);
    }
    public processEsppReEnrollment(myList: ReEnrollVeipEsppModel): Promise<any> {
        return this.sqlRepo.processEsppReEnrollment(myList);
    }
    public displayOfferingEspp(): Promise<any> {
        return this.sqlRepo.displayOfferingEspp();
    }
    public displayOfferingVeip(): Promise<any> {
        return this.sqlRepo.displayOfferingVeip();
    }
    public validateEnrollment(offer_Num: number, opt_Id: string): Promise<any> {
        return this.sqlRepo.validateEnrollment(offer_Num, opt_Id);
    }    
    public getGrantList(myList: SalesTransferModel): Promise<any> {
        return this.sqlRepo.getGrantList(myList);
    }
    public insertToLogs (myList: LoggingModel) : Promise<any> {
        return this.sqlRepo.insertToLogs(myList);
    }
    /*START: JJJ User Story 288639 - SR Automation - Assign Code 3 to Grants */
    public getGrantCode(myList: GrantCodeModel): Promise<any> {
        return this.sqlRepo.getGrantCode(myList);
    }
    public updateGrantCode(myList: GrantCodeModel): Promise<any> {
        return this.sqlRepo.updateGrantCode(myList);
    }
    /*END: JJJ User Story 288639 - SR Automation - Assign Code 3 to Grants */
    public getOptioneeId(optioneeId: string): Promise<any> {
        return this.sqlRepo.checkOptioneeId(optioneeId);
    }
    public processTermCancellation(myList: TermCancellationModel): Promise<any> {
        return this.sqlRepo.processTermCancellation(myList);
    }
     /*START: ACS SR Automation - Pull Opt ID*/
     public getOptId(EnterpriseId: string): Promise<any> {
        return this.sqlRepo.getOptId(EnterpriseId);
    }
    /*END: ACS SR Automation - Pull Opt ID*/

    /*START: JJA SR Automation - Pull Opt ID using GID/SSN*/
    public getCurrentGid(ssn: string): Promise<any> {
        return this.sqlRepo.getCurrentGid(ssn);
    }
    /*END: JJA SR Automation - Pull Opt ID using GID/SSN*/

    /*START: JJJ Workitem 1347027 - SR Tools Automation */
    public getOfficerCodeList(actionType: number, myList: OfficerCodeModel): Promise<any> {
        return this.sqlRepo.getOfficerCodeList(actionType, myList);
    }    
    public updateOfficerCode(myList: OfficerCodeModel): Promise<any> {
        return this.sqlRepo.updateOfficerCode(myList);
    }
    /*END: JJJ Workitem 1347027 - SR Tools Automation */
    public grantAccessFE(myList: EAAccessModel): Promise<any> {
        return this.sqlRepo.grantAccessFE(myList);
    }
    public grantAccessBE(myList: EAAccessModel): Promise<any> {
        return this.sqlRepo.grantAccessBE(myList);
    }
    public removeAccessFE(myList: EAAccessModel): Promise<any> {
        return this.sqlRepo.removeEAAccessFE(myList);
    }
    public removeAccessBE(myList: EAAccessModel): Promise<any> {
        return this.sqlRepo.removeEAAccessBE(myList);
    }
    public employeeType(data_arr): Promise<any> {     
        return this.sqlRepo.deleteRecEmployeeLkup().then(result => {
            return this.sqlRepo.insertToEmployeeLkup(data_arr).then(result=>{ 
                return this.sqlRepo.insertToEmployeeHist(data_arr).then(result=>{
                    return this.sqlRepo.updateTPT().then(result=>{ 
                    }); 
                });
            });
        })
    }
}
