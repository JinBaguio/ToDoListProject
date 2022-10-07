
import { LoggingModel } from '../models/loggingModel';
import { CmpnyModel } from '../models/cmpnyModel';

const sql = require('mssql');
const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });
const kms = new AWS.KMS();

 let connString = {};

 async function decryptor(encryptedText) {
    try {
        const req = {
            CiphertextBlob: Buffer.from(encryptedText, 'base64')
            ,EncryptionContext: { LambdaFunctionName: process.env.LambdaFunctionName },
        };
        
        const data = await kms.decrypt(req).promise();
        return(data.Plaintext.toString('ascii'));
    } 
    catch (err) {
        console.log('Decrypt error:', err);
        throw err;
    }
} 

async function initializeVariables () {
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

export class sqlRepository {

    public async getCompany(): Promise<any> {
        await initializeVariables();
        sql.close();
        return sql.connect(connString)
            .then(() => {
                var request = new sql.Request();
                var query = "SELECT CompanyID, CompanyDetails, CompanyName, CompanyAddress, CompanyCountry, UserID FROM dbo.Tbl_Company";
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

    public async deleteCompany(companyId: number): Promise<any> {
        await initializeVariables();
        sql.close();
        return sql.connect(connString)
            .then(() => {
                var request = new sql.Request();
                var query = "DELETE FROM dbo.Tbl_Company WHERE CompanyID = '" + companyId + "'";
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


    public async getUserDetails(userId: number):Promise<any> {
        await initializeVariables();
        sql.close();
        return sql.connect(connString)
            .then(() => {
                var request = new sql.Request();
                var query = "SELECT UserID, FirstName, LastName, Contact, Address, IsAdmin, AdminType FROM dbo.[User] WHERE UserID ='" + userId + "'";
                return request.query(query);
            }).then((recordset) => {
                sql.close();          
                return recordset['recordset'];           
            }).catch((error) => {
                sql.close();
                throw error;
            });
        }

    public async updateUserDtls(userId: number): Promise<any> {
        await initializeVariables();
        sql.close(); 
        return sql.connect(connString).then(pool => {
                // Stored procedure          
                return pool.request()
                .input('UserID', sql.VarChar(12), userId)
                .execute('Prc_Update_UserTbl')
            }).then(recordset => {
                sql.close();
                return recordset['rowsAffected'];
            }).catch(err => {
                sql.close();
                console.log(err);
            }) 
    }

     public async updateCompany(myList : CmpnyModel): Promise<any> {
        await initializeVariables();
        sql.close(); 
        console.log(myList);  
        return sql.connect(connString).then(pool => {
             // Stored procedure          
             return pool.request()
             .input('CompanyId', sql.VarChar(12), myList.CompanyId)
             .execute('Prc_Update_TblCompany')
         }).then(recordset => {
             sql.close();
             return recordset['rowsAffected'];
         }).catch(err => {
             sql.close();
             console.log(err);
         }) 
    }


     public async insertToLogs(myList: LoggingModel): Promise<any> {
        await initializeVariables();
        sql.close();
        return sql.connect(connString)
            .then(() => {
                var request = new sql.Request();
                var query = "Insert into dbo.Tbl_Company_Logs (ActionID, ActionDetails, UserId) Values ('" + myList.ActionId + "', '" + myList.ActionDetails + "', '" + myList.UserId + "')";
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

    public async insertCompany(myList: CmpnyModel): Promise<any> {
        await initializeVariables();
        sql.close();
        return sql.connect(connString)
            .then(() => {
                var request = new sql.Request();
                var query = "Insert into dbo.Tbl_Company (CompanyID, CompanyDetails, CompanyName, CompanyAddress, CompanyCountry, UserID) Values ('" + myList.CompanyId + "', '" + myList.CompanyDetails + "', '" + myList.CompanyNm + "', '" + myList.CompanyAddrs + "', '" + myList.CompanyCntry + "', '" + myList.UserID + "')";
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
    
}

