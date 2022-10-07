import { SalesTransferModel } from '../models/salesTransferModel';
import { GidSsnModel } from '../models/gidSsnModel';
import { ReEnrollVeipEsppModel } from '../models/reEnrollVeipEsppModel';
import { LoggingModel } from '../models/loggingModel';
import { GrantCodeModel } from '../models/grantCodeModel'; //JJJ
import { TermCancellationModel } from '../models/processTermCancellationModel';
import { EAAccessModel } from '../models/eaAccessModel';
import { OfficerCodeModel } from '../models/officerCodeModel';

const sql = require('mssql');
const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });
const kms = new AWS.KMS();

 let connString = {};

 async function decryptor(encryptedText) {

    // return new Promise(resolve => {
    //     kms.decrypt({ CiphertextBlob: new Buffer(encryptedText, 'base64') }, (err, data) => {
    //         if (err) {
    //             console.log('Decrypt error:', err);
    //         }
    //         else{
    //             resolve(data.Plaintext.toString('ascii'));
    //         }
    //     });
    // });

    try {
        const req = {
            CiphertextBlob: Buffer.from(encryptedText, 'base64')
            ,EncryptionContext: { LambdaFunctionName: process.env.LambdaFunctionName },
        };
        
        const data = await kms.decrypt(req).promise();
       // console.log(data.Plaintext.toString('ascii'));
        return(data.Plaintext.toString('ascii'));
    } 
    catch (err) {
        console.log('Decrypt error:', err);
        throw err;
    }
} 

async function initializeVariables () {

    //const [user, password] = await Promise.all([decryptor(process.env.sqlUser),decryptor(process.env.sqlPassword)]);
    const password = await decryptor(process.env.sqlPassword);

    connString =  {    
        "server": process.env.sqlServer,
        "user":   process.env.sqlUser,
        "password": password,
        "domain": process.env.sqlDomain,
        "database": process.env.sqlDBName,
        "connectionTimeout": 300000,
        "requestTimeout": 300000,
        "port": process.env.sqlPort,
        "driver": 'tedious',
        "options": {
            "encrypt": true
        }
    };
}

async function initializeVariables2 () {

    const password = await decryptor(process.env.sqlPassword);

    connString =  {    
        "server": process.env.sqlServer,
        "user":   process.env.sqlUser,
        "password": password,
        "domain": process.env.sqlDomain,
        "database": process.env.sqlDBName,
        "connectionTimeout": 300000,
        "requestTimeout": 300000,
        "port": process.env.sqlPort,
        "driver": 'tedious',
        "options": {
            "encrypt": true,
            "packetSize": 16384 
        }
    };
}



export class sqlRepository {

    public async getSpecificGrant(): Promise<any> {
        await initializeVariables();
        sql.close();
        return sql.connect(connString)
            .then(() => {
                var request = new sql.Request();
                //var query = "SELECT Top 1 Grant_ID  FROM [a1064_myHol_EOWIN].dbo.Grantz ORDER BY Substring(GRANT_ID,4,LEN(GRANT_ID)) DESC";
                var query = "SELECT TOP 1 Grant_ID FROM [a1064_myhol_EOWIN].dbo.Grantz WHERE Grant_ID NOT LIKE '___V%' AND Grant_ID NOT LIKE '%D_' AND Grant_ID NOT LIKE '%D__' ORDER BY SUBSTRING(GRANT_ID,4,LEN(GRANT_ID)) DESC";
                return request.query(query);
            })
            .then((recordset) => {
                sql.close();
                return recordset['recordset'];
            }).catch((error) => {
                sql.close();
                throw error;
            });
    }

    public async getGidSsn(optionee_Id: string): Promise<any> {
        await initializeVariables();
        sql.close();
        return sql.connect(connString)
            .then(() => {
                var request = new sql.Request();
                //var query = "SELECT tpl.PeopleKey ,tpt.OPTIONEE_ID ,tpl.GlobalID FROM Tbl_PeopleKey_Lkup tpl JOIN Tbl_People_Trans tpt ON tpt.PeopleKey = tpl.PeopleKey WHERE tpt.OPTIONEE_ID = '" + optionee_Id + "'";
                var query = "SELECT  tpl.PeopleKey, tpt.OPTIONEE_ID, tpl.GlobalID ,(SELECT SSN_PLAN_ID FROM Tbl_People_Trans tpt WHERE tpt.OPTIONEE_ID = '" + optionee_Id + "') as 'Current' FROM Tbl_PeopleKey_Lkup tpl JOIN Tbl_People_Trans tpt ON tpt.PeopleKey = tpl.PeopleKey WHERE tpt.OPTIONEE_ID = '" + optionee_Id +"'";
                return request.query(query);
            })
            .then((recordset) => {
                sql.close();
                return recordset['recordset'];
            }).catch((error) => {
                sql.close();
                throw error;
            });
    }


     public async updateGidSsn(myList : GidSsnModel) : Promise<any> {
        await initializeVariables();
        sql.close();    
        return sql.connect(connString).then(pool => {
             // Stored procedure          
             return pool.request()
             .input('OptId', sql.VarChar(10), myList.PersonnelNumber)
             .input('Gid', sql.VarChar(10), myList.NewGidSsn)
             .execute('Prc_UPD_GID')
         }).then(recordset => {
             sql.close();
             return recordset['rowsAffected'];
         }).catch(err => {
             sql.close();
             console.log(err);
             // ... error checks
         })   
         sql.on('error', err => {
             console.log(err);
             // ... error handler
         })
     }

     public async processEsppReEnrollment(myList : ReEnrollVeipEsppModel) : Promise<any> {
        await initializeVariables();
        sql.close(); 
        
        console.log(myList);

        return sql.connect(connString).then(pool => {
             // Stored procedure          
             return pool.request()
             .input('OptID', sql.VarChar(10), myList.PersonnelNumber)
             .input('Offering', sql.VarChar(10), myList.OfferingNumber)
             .input('EnrlDt', sql.VarChar(10), myList.EnrollmentDate)
             .input('EnrollPercent', sql.Int, myList.EnrollmentPercentage)
             .execute(myList.Sp_Name)
         }).then(recordset => {
             sql.close();
             return recordset['rowsAffected'];
         }).catch(err => {
             sql.close();
             console.log(err);
             // ... error checks
         })   
         sql.on('error', err => {
             console.log(err);
             // ... error handler
         })
     }

     public async displayOfferingEspp() : Promise<any> {
        await initializeVariables();
        sql.close();

        return sql.connect(connString)
            .then(() => {
                var request = new sql.Request();
                var query = "SELECT OFFER_NUM, OFF_PER_ID FROM ESP_OFFERING_PERIODS ORDER BY OFF_PER_ID DESC";
                return request.query(query);
            })
            .then((recordset) => {
                sql.close();
                return recordset['recordset'];
            }).catch((error) => {
                sql.close();
                throw error;
            });
     }

     public async displayOfferingVeip() : Promise<any> {
        await initializeVariables();
        sql.close();

        return sql.connect(connString)
            .then(() => {
                var request = new sql.Request();
                var query = "SELECT OFFER_NUM, OFF_PER_ID FROM Web_Tbl_VeipOfferPrd_Lkup ORDER BY OFF_PER_ID DESC";
                return request.query(query);
            })
            .then((recordset) => {
                sql.close();
                return recordset['recordset'];
            }).catch((error) => {
                sql.close();
                throw error;
            });
     }

     public async getGrantList(myList : SalesTransferModel): Promise<any> {
        await initializeVariables();
        sql.close();
        return sql.connect(connString)
            .then(() => {
                var request = new sql.Request();
                var query = "SELECT GRANT_ID, SUM(Trans_Shrs) as Shares, CONVERT(VARCHAR(10), Trans_Dt, 111) AS Trans_Dt, Trans_Prc, Trans_type FROM [1064_MYHOL_ASPDB].DBO.TBL_RSU_EMPDET_TRANS WHERE Opt_id = '" + myList.PersonnelNumber + "' and Trans_Dt = '" + myList.TransactionDate + "' GROUP BY GRANT_ID, Trans_Dt, Trans_Type, Trans_Prc, Trans_type ORDER BY Shares desc";
                return request.query(query);
            })
            .then((recordset) => {
                sql.close();
                return recordset['recordset'];
            }).catch((error) => {
                sql.close();
                throw error;
            });
    }

    public async validateEnrollment(offer_Num: number, opt_Id: string): Promise<any> {
        await initializeVariables();
        sql.close();
        return sql.connect(connString)
            .then(() => {
                var request = new sql.Request();
                var query = "SELECT opt.Opt_Id ,esp.Offer_Num ,opt.Name_Coded ,opt.Name_First ,CASE esp.Enrl_Stat WHEN 0 THEN 'Enrolled' WHEN 1 THEN 'Withdrawn' WHEN 2 THEN 'On Hold' END AS [Status] ,esp.Enrl_Prcnt AS [Contribution_Percentage] ,esp.Enrl_Dt ,esp.Activ_Dt ,esp.User_Id FROM [A1064_MyHol_EOWin].dbo.Esp_Enrollment esp JOIN [A1064_MyHol_EOWin].dbo.Optionee opt ON esp.Opt_Num = opt.Opt_Num WHERE opt.Opt_id = '" + opt_Id + "' AND esp.Offer_Num =" + offer_Num;

                var query2 = "SELECT PEOPLEKEY, EMPL_STATUS, JOBCODE, Y_JOBCODE_DESCR FROM [1064_MYHOL_ASPDB].DBO.TBL_PEOPLE_TRANS WHERE PEOPLEKEY IN (SELECT PEOPLEKEY FROM [1064_MYHOL_ASPDB]..TBL_PEOPLE_TRANS WHERE OPTIONEE_ID ='" + opt_Id + "')";

                var query3 = "SELECT * FROM [1064_MYHOL_ASPDB].dbo.Tbl_Dlta_JobKey_Base a LEFT JOIN [1064_MYHOL_ASPDB].dbo.Tbl_Dlta_JobCode_Lkup b ON a.Job_Key_Id = b.SAP_JobCode WHERE a.STATUS = 'A' and a.job_key_id not in (10000025, 10000130)";

                return request.query(query + query2 + query3);
            })
            .then((recordset) => {
                sql.close();
                return recordset['recordsets'];
            }).catch((error) => {
                sql.close();
                throw error;
            });
    }

    public async processSalesTransferDeletion(myList : SalesTransferModel) : Promise<any> {
        await initializeVariables();
        sql.close(); 
        
        console.log(myList);

        return sql.connect(connString).then(pool => {
             // Stored procedure          
             return pool.request()
             .input('chvOptioneeID', sql.VarChar(10), myList.PersonnelNumber)
             .input('chvCmd1', sql.VarChar(sql.MAX), myList.SqlCommand1)
             .input('chvCmd2', sql.VarChar(sql.MAX), myList.SqlCommand2)
             //.input('chvTransDt', sql.VarChar(20), myList.TransactionDate)
             .execute('Prc_Sale_Transfer_Deletion')
         }).then(recordset => {
             sql.close();
             return recordset['rowsAffected'];
         }).catch(err => {
             sql.close();
             console.log(err);
             // ... error checks
         })   
         sql.on('error', err => {
             console.log(err);
             // ... error handler
         })
     }

     public async insertToLogs(myList: LoggingModel): Promise<any> {
        await initializeVariables();

        sql.close();
        return sql.connect(connString)
            .then(() => {
                var request = new sql.Request();
                var query = "Insert into dbo.ServiceRequestLogs (ActionID, ActionDetails, [User]) Values ('" + myList.ActionId + "', '" + myList.ActionDetails + "', '" + myList.EnterpriseId + "')";
                return request.query(query);
            })
            .then((recordset) => {
                sql.close();
                return recordset['recordset'];
            }).catch((error) => {
                sql.close();
                throw error;
            });
    }

    /*START: JJJ User Story 288639 - SR Automation - Assign Code 3 to Grants */
    public async getGrantCode(myList: GrantCodeModel): Promise<any> {
        await initializeVariables();
        sql.close();
        return sql.connect(connString)
            .then(() => {
                var request = new sql.Request();
                var query = "SELECT GRANT_ID, ISNULL(GRANT_CD3, '') AS GRANT_CD3 FROM [A1064_Myhol_EOWIN].DBO.Grantz WHERE GRANT_ID IN (" + myList.Grants + ")";
                return request.query(query);
            })
            .then((recordset) => {
                sql.close();
                return recordset['recordset'];
            }).catch((error) => {
                sql.close();
                throw error;
            });
    }

    public async updateGrantCode(myList : GrantCodeModel) : Promise<any> {
        await initializeVariables();
        sql.close();    
        return sql.connect(connString).then(pool => {
             // Stored procedure          
             return pool.request()
             .input('chvGrants', sql.VarChar(700), myList.Grants)
             .input('intType', sql.Int, myList.ProcessType)
             .input('updatedBy', sql.VarChar(50), myList.UpdatedBy)
             .execute('Prc_Update_GrantCd3')
         }).then(recordset => {
             sql.close();
             return recordset['rowsAffected'];
         }).catch(err => {
             sql.close();
             console.log(err);
             // ... error checks
         })   
         sql.on('error', err => {
             console.log(err);
             // ... error handler
         })
     }
     /*END: JJJ User Story 288639 - SR Automation - Assign Code 3 to Grants */

     public async processTermCancellation(myList : TermCancellationModel) : Promise<any> {
        await initializeVariables();
        sql.close(); 
        console.log(myList);  
        return sql.connect(connString).then(pool => {
             // Stored procedure          
             return pool.request()
             .input('OptID', sql.VarChar(10), myList.PersonnelNumber)
             .input('Eid', sql.VarChar(30), myList.EnterpriseID)
             .execute('Prc_Cancel_Termination')
         }).then(recordset => {
             sql.close();
             return recordset['rowsAffected'];
         }).catch(err => {
             sql.close();
             console.log(err);
         })   
     }

     public async checkOptioneeId(optionee_Id: string): Promise<any> {
        await initializeVariables();
        sql.close();
        return sql.connect(connString)
            .then(() => {
                var request = new sql.Request();
                var query = "SELECT OPTIONEE_ID,CONVERT(VARCHAR(30),TERMINATION_DT,101) AS TERMINATION_DT,TERMINATION_ID FROM TBL_PEOPLE_TRANS WHERE OPTIONEE_ID = '" + optionee_Id + "'";
                console.log("QUERY",query);
                return request.query(query);
            })
            .then((recordset) => {
                sql.close();
                return recordset['recordset'];
            }).catch((error) => {
                sql.close();
                throw error;
            });
        }

    /*START: ACS SR Automation - Pull Opt ID*/
    public async getOptId(eid: string): Promise<any> {
        await initializeVariables();
        sql.close();
        return sql.connect(connString)
        .then(() => {
            var request = new sql.Request();
            var query = "SELECT OPTIONEE_ID, NAME, InternetMail, SSN_PLAN_ID FROM Tbl_People_Trans WHERE EMAIL_SHORT = '" + eid + "'";
            return request.query(query);
        })
        .then((recordset) => {
            sql.close();
            return recordset['recordset'];
        }).catch((error) => {
            sql.close();
            throw error;
        });
    }

    /*END: ACS SR Automation - Pull Opt ID*/


    /*START: JJA SR Automation - Pull Opt ID using GID/SSN*/
    public async getCurrentGid(ssn: string): Promise<any> {
        await initializeVariables();
        sql.close();
        return sql.connect(connString)
        .then(() => {
            var request = new sql.Request();
            var query = "SELECT a.OPTIONEE_ID, a.NAME, a.InternetMail, a.SSN_PLAN_ID FROM Tbl_People_Trans a JOIN (SELECT DISTINCT Peoplekey, SSN from [1064_MyHol_AesRpt].dbo.Optionee_Dim) b ON a.Peoplekey = b.Peoplekey WHERE b.SSN = '" + ssn + "'";
            return request.query(query);
        })
        .then((recordset) => {
            sql.close();
            return recordset['recordset'];
        }).catch((error) => {
            sql.close();
            throw error;
        });
    }

    /*END: JJA SR Automation - Pull Opt ID using GID/SSN*/


    /*START: JJJ Workitem 1347027 - SR Tools Automation */
    public async getOfficerCodeList(actionType: number, myList : OfficerCodeModel): Promise<any> {
        await initializeVariables();
        sql.close();
        return sql.connect(connString)
            .then(() => {
                var request = new sql.Request();                
                if(actionType == 0){
                    var strCondition = "WHERE OPTIONEE_ID IN (" + myList.OptioneeIDs + ") "
                }
                else{                    
                    if(myList.OfficerCd == 1 && myList.Description != null){
                        var strCondition = "WHERE OFFICER_CODE IN (" + myList.OfficerCd.toString() + ") and [Description] like "
                        if(myList.Description == "Pre-Clearance"){
                            strCondition = strCondition + "'Pre-Clearance%' "
                        }else{
                            strCondition = strCondition + "'Section 16%' "
                        }
                    }else{
                        var strCondition = "WHERE OFFICER_CODE IN (" + myList.OfficerCd.toString() + ") "
                    }
                }
                                
                var query = "SELECT * FROM GetOfficerCdList_vw WITH (NOLOCK) " +
                "" + strCondition + "" +
                "ORDER BY OPTIONEE_ID ASC"

                return request.query(query);        
            })
            .then((recordset) => {
                sql.close();
                return recordset['recordset'];
            }).catch((error) => {
                sql.close();
                throw error;
            });
    }

    public async updateOfficerCode(myList : OfficerCodeModel) : Promise<any> {
        await initializeVariables();
        sql.close();    
        return sql.connect(connString).then(pool => {
             // Stored procedure
             console.log("myList.OptioneeIDs values: " + myList.OptioneeIDs); 
             console.log("myList.OptioneeIDs.length: " + myList.OptioneeIDs.length);          
             return pool.request()
             .input('chvOptioneeIDs', sql.VarChar(4000), myList.OptioneeIDs)
             .input('intType', sql.Int, myList.ProcessType)
             .input('updatedBy', sql.VarChar(50), myList.UpdatedBy)
             .execute('Prc_Upd_OfficerCode')
         }).then(recordset => {
             sql.close();
             return recordset['rowsAffected'];
         }).catch(err => {
             sql.close();
             console.log(err);
             // ... error checks
         })   
         sql.on('error', err => {
             console.log(err);
             // ... error handler
         })
     }
     /*END: JJJ Workitem 1347027 - SR Tools Automation */

     public async grantAccessFE (myList : EAAccessModel): Promise<any> {
        await initializeVariables();
        sql.close();
        console.log(myList);  
        return sql.connect(connString).then(pool => {
            // Stored procedure          
             return pool.request()
             .input('chvEid', sql.VarChar(30), myList.EnterpriseID)
             .input('chvUpdatedBy', sql.VarChar(30), myList.UpdatedBy)
             .input('updateType', sql.VarChar(30), myList.UpdateType)
             .execute('Prc_Grnt_Rvk_EA_Tool_FE')
            }).then(recordset => {
                sql.close();
                return recordset['rowsAffected'];
            }).catch(err => {
                sql.close();
                console.log(err);
            })  
        }
        
     public async grantAccessBE (myList : EAAccessModel): Promise<any> {
        await initializeVariables();
        sql.close();
        console.log(myList);  
        return sql.connect(connString).then(pool => {
            // Stored procedure          
             return pool.request()
             .input('chvEid', sql.VarChar(30), myList.EnterpriseID)
             .input('chvUpdatedBy', sql.VarChar(30), myList.UpdatedBy)
             .input('updateType', sql.VarChar(30), myList.UpdateType)
             .execute('Prc_Grnt_Rvk_EA_Tool_BE')
            }).then(recordset => {
                sql.close();
                return recordset['rowsAffected'];
            }).catch(err => {
                sql.close();
                console.log(err);
            })  
        }

     public async removeEAAccessFE (myList : EAAccessModel): Promise<any> {
        await initializeVariables();
        sql.close();
        console.log(myList);  
        return sql.connect(connString).then(pool => {
            // Stored procedure          
            return pool.request()
            .input('chvEid', sql.VarChar(30), myList.EnterpriseID)
            .input('chvUpdatedBy', sql.VarChar(30), myList.UpdatedBy)
            .input('updateType', sql.VarChar(30), myList.UpdateType)
            .execute('Prc_Grnt_Rvk_EA_Tool_FE')
            }).then(recordset => {
                sql.close();
                return recordset['rowsAffected'];
            }).catch(err => {
                sql.close();
                console.log(err);
            })  
        }
            
     public async removeEAAccessBE (myList : EAAccessModel): Promise<any> {
        await initializeVariables();
        sql.close();
        console.log(myList);  
        return sql.connect(connString).then(pool => {
            // Stored procedure          
            return pool.request()
            .input('chvEid', sql.VarChar(30), myList.EnterpriseID)
            .input('chvUpdatedBy', sql.VarChar(30), myList.UpdatedBy)
            .input('updateType', sql.VarChar(30), myList.UpdateType)
            .execute('Prc_Grnt_Rvk_EA_Tool_BE')
            }).then(recordset => {
                sql.close();
                return recordset['rowsAffected'];
            }).catch(err => {
                sql.close();
                console.log(err);
            })  
        }
        
    public async insertToEmployeeLkup(data_arr): Promise<any> {
        await initializeVariables2();
        sql.close();
        return sql.connect(connString)
        .then(async function (pool) {
            var dataArr = data_arr;
            if (dataArr != null) {
                const table = new sql.Table('dbo.Tbl_EmployeeType_Upload_Lkup');
                table.create = false; // presuming table already exists
                table.columns.add('optionee_id', sql.Char(10), { nullable: false });
                table.columns.add('employee_type', sql.VarChar(50), { nullable: false });
                table.columns.add('effective_date', sql.VarChar(40), { nullable: false });
                // Add rows
                dataArr.forEach(row => table.rows.add.apply(table.rows,row));
                const request = pool.request();
                const results = await request.bulk(table);
                console.log(`rows affected ${results.rowsAffected}`);
                console.log("Inserted to Lkup");
                return request.query(results);
            }       
        }).then((recordset) => {
            sql.close();
            return recordset['rowsAffected'];
        }).catch((error) => {
            sql.close();
            throw error;
        });

    }

    public async deleteRecEmployeeLkup(): Promise<any> {
        await initializeVariables2();
        sql.close();
        return sql.connect(connString)
        .then(() => {
            var request = new sql.Request();
            var query = "DELETE FROM [Tbl_EmployeeType_Upload_Lkup]";
            console.log("Truncated Lkup");
            return request.query(query);
        })
        .then((recordset) => {
            sql.close();
            return recordset['recordset'];
        }).catch((error) => {
            sql.close();
            throw error;
        });
    }

    public async insertToEmployeeHist(data_arr): Promise<any> {
        await initializeVariables2();
        sql.close();
        return sql.connect(connString)
        .then(async function (pool) {
            var dataArr = data_arr;
            if (dataArr != null) {
                const table = new sql.Table('dbo.Tbl_EmployeeType_Upload_Hist');
                table.create = false; // presuming table already exists
                table.columns.add('optionee_id', sql.Char(10), { nullable: false });
                table.columns.add('employee_type', sql.VarChar(50), { nullable: false });
                table.columns.add('effective_date', sql.VarChar(40), { nullable: false });
                // Add rows
                dataArr.forEach(row => table.rows.add.apply(table.rows,row));
                const request = pool.request();
                const results = await request.bulk(table);
                console.log(`rows affected ${results.rowsAffected}`);
                console.log("Inserted to Hist");
                return request.query(results);
            }       
        }).then((recordset) => {
            sql.close();
            return recordset['rowsAffected'];
        }).catch((error) => {
            sql.close();
            throw error;
        });

    }

    public async updateTPT(): Promise<any> {
        await initializeVariables2();
        sql.close();
        return sql.connect(connString).then(pool => {
            // Stored procedure          
            return pool.request()
            .execute('Prc_Espp_Upd_EmployeeType')
            }).then(recordset => {
                sql.close();
                console.log("Updated TPT");
                return recordset['rowsAffected'];
            }).catch(err => {
                sql.close();
                console.log(err);
            })  
        }
    
    
}

