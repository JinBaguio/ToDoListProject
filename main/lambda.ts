import { Service } from '../src/services/Service';
import { CmpnyModel } from '../src/models/CmpnyModel';
import { LoggingModel } from '../src/models/loggingModel';
import { Authorizer } from '../authorizer/authorizer'

const myServices =  new Service();
const auth =  new Authorizer();

const blockedChars = new RegExp(/[?,=,!,+,\-,&,$,:,;,',‘,%,[,"]/gmi);
const blockedValue = new RegExp(/[?,=,!,%,+,&,$,:,;,[,‘,"]/gmi);
const blockedDate = new RegExp(/[?,!,+,&,$,;,',‘,%,[,"]/gmi);


  //------------------------------------------------------- Salary Hero CRUD -------------------------------------------------------//

  export async function salaryHero (event: any, context: any, callback: (...args: any[]) => void) : Promise <any> {
    var token = event.params.header['Authorization'];  
    var [authResult] : any = await Promise.all([auth.authorize(token)]);

      if(authResult['authResult'] == 'Authorized' && authResult.userRole.indexOf('Admin')){  
        if(event.body.actionType == 0){  //For logging purposes
          return new Promise(resolve => { 
              let myList = new LoggingModel(event.body.actionId, event.body.actionDetails, event.body.userId);
              myServices.insertToLogs(myList).then((result) => {
                let response = {
                    contentType: "application/json",
                    statusCode: 200,
                    body: JSON.stringify({            
                        message: "Action has been logged."
                    })
                  };
                resolve(response);
              });
          });
        }
        else if (event.body.actionType == 1){ //For create/insert
          return new Promise(resolve => {
            let myList = new CmpnyModel(event.body.actionId, event.body.actionDetails, event.body.userId, event.body.company, event.body.actionDt, event.body.userId);
              myServices.insertCompany(myList).then((result) => {
                let response = {
                    contentType: "application/json",
                    statusCode: 200,
                    body: JSON.stringify({            
                        data: result
                    })
                  };
                resolve(response);
            });
          });
        } else if (event.body.actionType == 2){ //For read/get
          return new Promise(resolve => {
            myServices.getCompany(event.body.userId).then((result) => {
              let response = {
                  contentType: "application/json",
                  statusCode: 200,
                  body: JSON.stringify({            
                      data: result
                  })
                };
              resolve(response);
          });
        });
      } else if (event.body.actionType == 3){ //For update
          return new Promise(resolve => {
            let myList = new CmpnyModel(event.body.actionId, event.body.actionDetails, event.body.userId, event.body.company, event.body.actionDt, event.body.userId);
              myServices.updateCompany(myList).then((result) => {
                let response = {
                    contentType: "application/json",
                    statusCode: 200,
                    body: JSON.stringify({            
                        data: result
                    })
                  };
                resolve(response);
            });
          });
    } else if (event.body.actionType == 4){ //For delete
        return new Promise(resolve => {
          let companyId = event.body.companyId;
          let userId = event.body.userId
          myServices.deleteCompany(companyId, userId).then((result) => {
            let response = {
                contentType: "application/json",
                statusCode: 200,
                body: JSON.stringify({            
                    data: result
                })
              };
            resolve(response);
          });
      });
    } else if (event.body.actionType == 5){ //For client Admin
        if(authResult.userRole == 'clientAdmin') {
          return new Promise(resolve => {
            let myList = new CmpnyModel(event.body.actionId, event.body.actionDetails, event.body.userId, event.body.company, event.body.actionDt, event.body.userId);
              myServices.insertClient(myList, event.body.userId).then((result) => {
                let response = {
                    contentType: "application/json",
                    statusCode: 200,
                    body: JSON.stringify({            
                        data: result
                    })
                  };
                resolve(response);
            });
        });
      }
  }
  else {
    let response = {
        contentType: "application/json",
        statusCode: 500,
        message: "Internal Server Error"
      };
      callback(null, response);
    }
} else {
      let response = {
        contentType: "application/json",
        statusCode: 401,
        message: "Unauthorized access!"
      };
    callback(null, response);
  }
}

  //------------------------------------------------------- Client Admin Crud -------------------------------------------------------//

  export async function clientAdmin (event: any, context: any, callback: (...args: any[]) => void) : Promise <any> {
    var token = event.params.header['Authorization'];  
    var [authResult] : any = await Promise.all([auth.authorize(token)]);

      if(authResult['authResult'] == 'Authorized' && authResult.userRole == "clientAdmin"){  
        if (event.body.actionType == 1){ //For create/insert
          return new Promise(resolve => {
            let myList = new CmpnyModel(event.body.actionId, event.body.actionDetails, event.body.userId, event.body.company, event.body.actionDt, event.body.userId);
              myServices.insertCompany(myList).then((result) => {
                let response = {
                    contentType: "application/json",
                    statusCode: 200,
                    body: JSON.stringify({            
                        data: result
                    })
                  };
                resolve(response);
            });
          });
        } else if (event.body.actionType == 2){ //For read/get
          return new Promise(resolve => {
            myServices.getCompany(event.body.userId).then((result) => {
              let response = {
                  contentType: "application/json",
                  statusCode: 200,
                  body: JSON.stringify({            
                      data: result
                  })
                };
              resolve(response);
          });
        });
      } else if (event.body.actionType == 3){ //For update
          return new Promise(resolve => {
            let myList = new CmpnyModel(event.body.actionId, event.body.actionDetails, event.body.userId, event.body.company, event.body.actionDt, event.body.userId);
              myServices.updateCompany(myList).then((result) => {
                let response = {
                    contentType: "application/json",
                    statusCode: 200,
                    body: JSON.stringify({            
                        data: result
                    })
                  };
                resolve(response);
            });
          });
    } else if (event.body.actionType == 4){ //For delete
        return new Promise(resolve => {
          let companyId = event.body.companyId;
          let userId = event.body.userId
          myServices.deleteCompany(companyId, userId).then((result) => {
            let response = {
                contentType: "application/json",
                statusCode: 200,
                body: JSON.stringify({            
                    data: result
                })
              };
            resolve(response);
          });
      });
    } 
  else {
    let response = {
        contentType: "application/json",
        statusCode: 500,
        message: "Internal Server Error"
      };
      callback(null, response);
    }
} else {
      let response = {
        contentType: "application/json",
        statusCode: 401,
        message: "Unauthorized access!"
      };
    callback(null, response);
  }
}

  //------------------------------------------------------- GET/UPDATE GID/SSN -------------------------------------------------------//

//   export async function processGidSsnHandler (event: any, context: any, callback: (...args: any[]) => void): Promise <any> {
//    initializeVariables();

//     var token = event.params.header['Authorization'];  
//     var [authResult] : any = await Promise.all([auth.authorize(token)]);

//     if(authResult['authResult'] == 'Authorized'){
//       //0 - display
//       //1 - update
//       if(event.body.actionType == 0){
//         return new Promise(resolve => {
//           let optioneeId = event.body.optioneeId;
//           let checker: boolean = blockedChars.exec(optioneeId) != null;
//             if (checker != true) {
//               myServices.getGidSsn(optioneeId).then((result) => {
//                 let response = {
//                     contentType: "application/json",
//                     statusCode: 200,
//                     body: JSON.stringify({            
//                         data: result
//                     })
//                   };
//                 resolve(response);
//               });
//             } else {          
//                 let response = {
//                   contentType: "application/json",
//                   statusCode: 500,
//                   message: "Internal Server Error"
//                 };
//                 callback(null, response);
//               }
//           });
//       }else if (event.body.actionType == 1) {    
//         return new Promise(resolve => {
//           let myList = new GidSsnModel(event.body.personnelNumber, event.body.newGid);
//           let PersonnelNbrchecker = myList.PersonnelNumber;
//           let Gidchecker = myList.NewGidSsn;
//           let checker: boolean = blockedChars.exec(PersonnelNbrchecker) != null || blockedChars.exec(Gidchecker) != null
//             if (checker != true) {
//               myServices.updateGidSsn(myList).then((result) => {
//                 let response = {
//                     contentType: "application/json",
//                     statusCode: 200,
//                     body: JSON.stringify({            
//                         data: result
//                     })
//                   };
//                   resolve(response);
//               });
//             } else {          
//               let response = {
//                 contentType: "application/json",
//                 statusCode: 500,
//                 message: "Internal Server Error"
//               };
//               callback(null, response);
//             }
//         });
//       }else if (event.body.actionType == 2) {
//         return new Promise(resolve => {

//           var bucketName;

//           if (process.env.sqlDomain.indexOf('DS.DEV')!= -1){
//             bucketName = "1064-myholdings-pem-stage";
//           } else if (process.env.sqlDomain.indexOf('DIR')!= -1){
//             bucketName = "1064-myholdings-pem-prod";
//           }
//           console.log(bucketName);

//           let prePath = 'Employee Type/';
          
//           let buffer = Buffer.from(event.body.base64, 'base64');
//           let fileName = event.body.fileName;
//           let typeOfContent;
          
//           if(fileName.indexOf('csv') != -1) {
//               typeOfContent = 'text/csv';
//           }
//           else {
//               typeOfContent = 'mime_type';
//           }
//           var S3 = new AWS.S3();
//           var uploadParams = {Bucket: bucketName, Key: prePath + fileName, Body: buffer, ContentType: typeOfContent};      
//           S3.putObject(uploadParams, function(err, data) {
//             if (err) {
//                 let response = {
//                   statusCode: 404,
//                   data: data,
//                   error: err,
//                   message: "Failed to upload file!"
//               };
//                 resolve(response);
//             } else {
//               var splitFileName = (fileName).split('.');
//               var getFileTypeName = splitFileName[splitFileName.length - 1];
//               var allowedFileType = "csv";
//                 if(allowedFileType.indexOf(event.body.FileType)!= -1 && allowedFileType.indexOf(getFileTypeName)!= -1) {

//                   console.log("File uploaded");

//                   let prePath = 'Employee Type/';                  
//                   let file = "EmployeeType.csv";

//                   var s3 = new AWS.S3();
//                   var params = { Bucket: bucketName, Key: prePath + file};
//                   s3.getObject(params, function(err, data) {
//                     if(err) {
//                       let response = {
//                             statusCode: 404,
//                             message: "File does not exist!",
//                             error: err
//                             };
//                         resolve(response);
//                       }
//                     else {
//                       var stream = s3.getObject(params).createReadStream()
//                       console.log("Stream File");
//                       let data_arr = [];
//                       let csvStream = fastcsv
//                       .parse()
//                       .on("data", function(data) {
//                         data_arr.push(data);
//                       })
//                       .on('end', () => {
//                         data_arr.shift();

//                         myServices.employeeType(data_arr).then((result) => {
                            
//                           var deletebucketName;
                          
//                           if (process.env.sqlDomain.indexOf('DS.DEV')!= -1){
//                             deletebucketName = "1064-myholdings-pem-stage";
//                           } else if (process.env.sqlDomain.indexOf('DIR')!= -1){
//                             deletebucketName = "1064-myholdings-pem-prod";
//                           }

//                           let prePath = 'Employee Type/';                  
//                           let file = "EmployeeType.csv";
//                           var s3 = new AWS.S3();
//                           var deleteParams = { Bucket: deletebucketName, Key: prePath + file};
//                           s3.deleteObject(deleteParams, function(err, data) {
//                             if(err) {
//                               let response = {
//                                     statusCode: 404,
//                                     message: "File does not exist!",
//                                     error: err
//                                     };
//                                 resolve(response);
//                               }
//                             else {
//                               let response = {
//                                   contentType: "application/json",
//                                   statusCode: 200,
//                                   body: JSON.stringify({            
//                                     message: "Successfully processed!"
//                                   })
//                                 };
//                               console.log("File deleted");
//                             resolve(response);
//                           } 
//                         })
//                       });
//                     });
//                   stream.pipe(csvStream);
//                   }  
//                 })
//               } 
//             }
//           })
//         })
//       } else {
//         let response = {
//           contentType: "application/json",
//           statusCode: 500,
//           message: "Internal Server Error"
//         };
//         callback(null, response);
//       }
//   } else {
//       let response = {
//         contentType: "application/json",
//         statusCode: 401,
//         message: "Unauthorized access!"
//       };
//     callback(null, response);
//   }
// }

//   //------------------------------------------------------- VALIDATE RE-ENROLLMENT -------------------------------------------------------//

//   export async function validateReEnrollmentHandler (event: any, context: any, callback: (...args: any[]) => void): Promise <any> {

//   var token = event.params.header['Authorization'];  
//   var [authResult] : any = await Promise.all([auth.authorize(token)]);
    
//     if(authResult['authResult'] == 'Authorized'){
//       return new Promise(resolve => {
//         let offerNum = event.body.offerNum;
//         let optId = event.body.optId;
//         let checker : boolean = blockedChars.exec(offerNum) != null || blockedChars.exec(optId) != null;
//           if (checker != true) {
//             myServices.validateEnrollment(offerNum, optId).then((result) => {
//                 let response = {
//                     contentType: "application/json",
//                     statusCode: 200,
//                     body: JSON.stringify({            
//                         data: result
//                     })
//                   };
//                 resolve(response);
//             });
//           } else {
//             let response = {
//               contentType: "application/json",
//               statusCode: 500,
//               message: "Internal Server Error"
//             };
//             callback(null, response);
//           }
//       });
//     }else{
//       let response = {
//         contentType: "application/json",
//         statusCode: 401,
//         message: "Unauthorized access!"
//       };
//     callback(null, response);
//   }
// }

//   //------------------------------------------------------- ESPP/VEIP RE-ENROLLMENT -------------------------------------------------------//

//   export async function processEsppVeipReEnrollmentHandler (event: any, context: any, callback: (...args: any[]) => void): Promise <any> {

//   var token = event.params.header['Authorization'];  
//   var [authResult] : any = await Promise.all([auth.authorize(token)]);
    
//     if(authResult['authResult'] == 'Authorized'){
//       //0 - display offering
//       //1 - ReEnroll ESPP/VEIP
//         if(event.body.actionType == 0){
//           let programId = event.body.programId;
//           if(programId == 3){
//             return new Promise(resolve => {
//               myServices.displayOfferingEspp().then((result) => {
//                 let response = {
//                       contentType: "application/json",
//                       statusCode: 200,
//                       body: JSON.stringify({            
//                           data: result
//                       })
//                     };
//                   resolve(response);
//               });
//             });
//           }
//           if(programId == 1){
//             return new Promise(resolve => {
//               myServices.displayOfferingVeip().then((result) => {
//                 let response = {
//                       contentType: "application/json",
//                       statusCode: 200,
//                       body: JSON.stringify({            
//                           data: result
//                       })
//                     };
//                   resolve(response);
//               });
//             });
//           } else {
//               let response = {
//                 contentType: "application/json",
//                 statusCode: 500,
//                 message: "Internal Server Error"
//               };
//               callback(null, response);
//             }
//           }
//         if(event.body.actionType == 1){
//           let myList = new ReEnrollVeipEsppModel(event.body.personnelNumber, event.body.offeringNumber, event.body.enrollmentDate, event.body.enrollmentPercentage, event.body.spName);
//           let PersonnelNbrChecker = myList.PersonnelNumber;
//           let OfferingNbrChecker = myList.OfferingNumber;
//           let EnrollDtChecker = myList.EnrollmentDate;
//           let EnrollPcntChecker = myList.EnrollmentPercentage;
//           let checker: boolean = blockedChars.exec(PersonnelNbrChecker) != null || blockedChars.exec(OfferingNbrChecker) != null || blockedChars.exec(EnrollDtChecker) != null || blockedChars.exec(EnrollPcntChecker) != null
//             if(event.body.spName.indexOf('VEIP') != -1){
//               if (checker != true) {    
//                 return new Promise(resolve => {
//                   myServices.processEsppReEnrollment(myList).then((result) => {
//                       if(result != null){
//                         console.log('FE:' + result);
//                           var lambda = new AWS.Lambda();          
//                           let passParam = {
//                                   body: {
//                                     "actionType": 1,
//                                     "personnelNumber" : event.body.personnelNumber,
//                                     "offeringNumber": event.body.offeringNumber,
//                                     "enrollmentDate": event.body.enrollmentDate,
//                                     "enrollmentPercentage": event.body.enrollmentPercentage,
//                                     "spName": 'dbo.Prc_UPD_VEIP_PayrollHist'
//                                   }
//                               };  
                      
//                           var params ={
//                             FunctionName: '1064_EA_sql_processEsppVeipReEnroll_Be',
//                             InvocationType: 'RequestResponse',
//                             LogType:'Tail',
//                             Payload : JSON.stringify(passParam)
//                           };

//                           lambda.invoke(params, function(err,data) {                
//                             if(!err){        
//                               let payloadData = JSON.parse(data.Payload);
//                               console.log('BE:' + payloadData);
//                               let response = {
//                                 contentType: "application/json",
//                                 statusCode: 200,
//                                 body: JSON.stringify({            
//                                     dataFE: 'FE:' + result,
//                                     dataBE: 'BE:' + payloadData
//                                 })
//                               };
//                               resolve(response);                    
//                             }else{
//                                 console.log(err);
//                             } 
//                           });
//                         }
//                     });            
//                 }); 
//               } else {
//                   let response = {
//                     contentType: "application/json",
//                     statusCode: 500,
//                     message: "Internal Server Error"
//                   };
//                 callback(null, response);
//               }
//           }else {
//             return new Promise(resolve => {
//               let PersonnelNbrChecker = myList.PersonnelNumber;
//               let OfferingNbrChecker = myList.OfferingNumber;
//               let EnrollDtChecker = myList.EnrollmentDate;
//               let EnrollPcntChecker = myList.EnrollmentPercentage;
//               let checker: boolean = blockedChars.exec(PersonnelNbrChecker) != null || blockedChars.exec(OfferingNbrChecker) != null || blockedChars.exec(EnrollDtChecker) != null || blockedChars.exec(EnrollPcntChecker) != null    
//                 if (checker != true) {     
//                   myServices.processEsppReEnrollment(myList).then((result) => {
//                       let response = {
//                         contentType: "application/json",
//                         message: "Successfully Re-Enrolled",
//                         statusCode: 200,
//                         body: JSON.stringify({            
//                             data: result
//                         })
//                       };
//                       resolve(response);
//                   });
//                 } else {
//                     let response = {
//                       contentType: "application/json",
//                       statusCode: 500,
//                       message: "Internal Server Error"
//                     };
//                   callback(null, response);
//                 }     
//               });
//             }
//         } else {
//             let response = {
//               contentType: "application/json",
//               statusCode: 500,
//               message: "Internal Server Error"
//             };
//           callback(null, response);
//         }
//     }else{
//       let response = {
//         contentType: "application/json",
//         statusCode: 401,
//         message: "Unauthorized access!"
//       };
//       callback(null, response);
//     }
// }

// //------------------------------------------------------- ESPP/VEIP RE-ENROLLMENT -------------------------------------------------------//
// export function processVeipBeReEnrollmentHandler (event: any, context: any, callback: (...args: any[]) => void): void {

//   let myList = new ReEnrollVeipEsppModel(event.body.personnelNumber, event.body.offeringNumber, event.body.enrollmentDate, event.body.enrollmentPercentage, event.body.spName);
//   myServices.processEsppReEnrollment(myList).then((result) => {
//       callback(null, result);
//   });
// }

// /*START: JJJ User Story 288639 - SR Automation - Assign Code 3 to Grants */
// //------------------------------------------------------- JJJ GET/UPDATE GRANT CODE 3 -------------------------------------------------------//

// export async function processGrantCodeHandler (event: any, context: any, callback: (...args: any[]) => void): Promise <any> {

//   var token = event.params.header['Authorization'];  
//   var [authResult] : any = await Promise.all([auth.authorize(token)]);

//   if(authResult['authResult'] == 'Authorized'){
//     //0 - display
//     //1 - update
//     if(event.body.actionType == 0){
//       return new Promise(resolve => {
//         let myList =  new GrantCodeModel(event.body.grants, event.body.processType, event.body.updatedBy);
//           myServices.getGrantCode(myList).then((result) => {
//             let response = {
//               contentType: "application/json",
//               statusCode: 200,
//               body: JSON.stringify({            
//                   data: result
//               })
//             };
//           resolve(response);
//         });  
//       });
//     }else if (event.body.actionType == 1) {    
//       return new Promise(resolve => {
//         let myList =  new GrantCodeModel(event.body.grants, event.body.processType, event.body.updatedBy);
//         let ProcessTypeChecker = myList.ProcessType;
//         let UpdatedByChecker = myList.UpdatedBy;
//         let checker: boolean = blockedChars.exec(ProcessTypeChecker) != null || blockedChars.exec(UpdatedByChecker) != null
//           if (checker != true) {
//               myServices.updateGrantCode(myList).then((result) => {
//                 let response = {
//                   contentType: "application/json",
//                   statusCode: 200,
//                   body: JSON.stringify({            
//                     data: result
//                   })
//                 };
//               resolve(response);
//             });
//           }else {
//                 let response = {
//                   contentType: "application/json",
//                   statusCode: 500,
//                   message: "Internal Server Error"
//                 };
//                 callback(null, response);
//               }
//           });
//     } else {
//       let response = {
//         contentType: "application/json",
//         statusCode: 500,
//         message: "Internal Server Error"
//       };
//       callback(null, response);
//     }
// } else{
//     let response = {
//       contentType: "application/json",
//       statusCode: 401,
//       message: "Unauthorized access!"
//     };
//     callback(null, response);
//   }
// }
// /*END: JJJ User Story 288639 - SR Automation - Assign Code 3 to Grants */

// //------------------------------------------------------- TERMINATION CANCELLATION -------------------------------------------------------//

// export async function processTerminationCancellationHandler (event: any, context: any, callback: (...args: any[]) => void): Promise <any> {

//   var token = event.params.header['Authorization'];  
//   var [authResult] : any = await Promise.all([auth.authorize(token)]);

//   if(authResult['authResult'] == 'Authorized'){
//     //0 - display
//     //1 - update
//     if(event.body.actionType == 0){
//       return new Promise(resolve => {
//         let optioneeId = event.body.optioneeId;
//         let checker: boolean = blockedChars.exec(optioneeId) != null;
//           if (checker != true) {
//             myServices.getOptioneeId(optioneeId).then((result) => {
//               let response = {
//                   contentType: "application/json",
//                   statusCode: 200,
//                   body: JSON.stringify({            
//                       data: result
//                   })
//                 };
//               resolve(response);
//           });
//         } else {
//             let response = {
//               contentType: "application/json",
//               statusCode: 500,
//               message: "Internal Server Error"
//             };
//             callback(null, response);
//           }
//       });
//     }
//     else if (event.body.actionType == 1){    
//       return new Promise(resolve => {
//         let myList = new TermCancellationModel(event.body.personnelNumber,event.body.updatedBy);
//         let PersonnelNbrchecker = myList.PersonnelNumber;
//         let Eidchecker = myList.EnterpriseID;
//         let checker: boolean = blockedChars.exec(PersonnelNbrchecker) != null || blockedChars.exec(Eidchecker) != null
//           if (checker != true) {
//             myServices.processTermCancellation(myList).then((result) => {
//               let response = {
//                   contentType: "application/json",
//                   statusCode: 200,
//                   body: JSON.stringify({            
//                       data: result
//                   })
//                 };
//               resolve(response);
//             });
//           } else {
//               let response = {
//                 contentType: "application/json",
//                 statusCode: 500,
//                 message: "Internal Server Error"
//               };
//               callback(null, response);
//             }
//         });
//     } else {
//         let response = {
//           contentType: "application/json",
//           statusCode: 500,
//           message: "Internal Server Error"
//         };
//         callback(null, response);
//       }
// } else{
//     let response = {
//       contentType: "application/json",
//       statusCode: 401,
//       message: "Unauthorized access!"
//     };
//     callback(null, response);
//   }
// }

// //------------------------------------------------------- GET OPTIONEE ID -------------------------------------------------------//

// export async function pullOptIdHandler (event: any, context: any, callback: (...args: any[]) => void): Promise <any> {

//   var token = event.params.header['Authorization'];  
//   var [authResult] : any = await Promise.all([auth.authorize(token)]);

//   if(authResult['authResult'] == 'Authorized'){
//     if(event.body.actionType == 0){
//       return new Promise(resolve => {
//         let eid = event.body.eid;
//         let checker: boolean = blockedChars.exec(eid) != null;
//           if (checker != true) {
//             myServices.getOptId(eid).then((result) => {
//               let response = {
//                   contentType: "application/json",
//                   statusCode: 200,
//                   body: JSON.stringify({            
//                       data: result
//                   })
//                 };
//               resolve(response);
//             });
//           } else {
//               let response = {
//                 contentType: "application/json",
//                 statusCode: 500,
//                 message: "Internal Server Error"
//               };
//               callback(null, response);
//             }
//         });
//     }else if (event.body.actionType == 1){    
//         return new Promise(resolve => {
//           let ssn = event.body.ssn;
//           let checker: boolean = blockedChars.exec(ssn) != null;
//             if (checker != true) {
//               myServices.getCurrentGid(ssn).then((result) => {
//                 let response = {
//                     contentType: "application/json",
//                     statusCode: 200,
//                     body: JSON.stringify({            
//                         data: result
//                     })
//                   };
//                   resolve(response);
//               });
//             } else {
//                 let response = {
//                   contentType: "application/json",
//                   statusCode: 500,
//                   message: "Internal Server Error"
//                 };
//                 callback(null, response);
//               }
//           });
//     } else {
//         let response = {
//           contentType: "application/json",
//           statusCode: 500,
//           message: "Internal Server Error"
//         };
//       callback(null, response);
//     }
// } else{
//     let response = {
//       contentType: "application/json",
//       statusCode: 401,
//       message: "Unauthorized access!"
//     };
//     callback(null, response);
//   }
// }


// /*START: JJJ Workitem 1347027 - SR Tools Automation */
// //------------------------------------------------------- OFFICER CODE UPDATES -------------------------------------------------------//

// export async function processOfficerCodeUpdatesHandler (event: any, context: any, callback: (...args: any[]) => void): Promise <any> {

//   var token = event.params.header['Authorization'];  
//   var [authResult] : any = await Promise.all([auth.authorize(token)]);

//   if(authResult['authResult'] == 'Authorized'){
//     //0 - display list by OptioneeID
//     //1 - display list by OfficerCd
//     //2 - update
//     var actionType = event.body.actionType
//     if(actionType == 0 || actionType == 1){
//       return new Promise(resolve => {
//         let myList = new OfficerCodeModel(event.body.optioneeIDs, event.body.officerCd, event.body.description, event.body.processType, event.body.updatedBy);
//         let DescChecker = myList.Description;
//         let officerCdchecker = myList.OfficerCd;
//         let processTypechecker = myList.ProcessType;
//         let updatedBychecker = myList.UpdatedBy;
//         let checker: boolean = blockedValue.exec(DescChecker) != null || blockedChars.exec(officerCdchecker) != null || blockedChars.exec(processTypechecker) != null || blockedChars.exec(updatedBychecker) != null 
//           if (checker != true) {
//             myServices.getOfficerCodeList(actionType, myList).then((result) => {
//               let response = {
//                   contentType: "application/json",
//                   statusCode: 200,
//                   body: JSON.stringify({            
//                       data: result
//                   })
//                 };
//               resolve(response);
//             });
//           } else {
//               let response = {
//                 contentType: "application/json",
//                 statusCode: 500,
//                 message: "Internal Server Error"
//               };
//               callback(null, response);
//             }
//       });
//     }
//     else if (actionType == 2){    
//       return new Promise(resolve => {
//         let myList = new OfficerCodeModel(event.body.optioneeIDs, event.body.officerCd, event.body.description, event.body.processType, event.body.updatedBy);
//         let DescChecker = myList.Description;
//         let officerCdchecker = myList.OfficerCd;
//         let processTypechecker = myList.ProcessType;
//         let updatedBychecker = myList.UpdatedBy;
//         let checker: boolean = blockedValue.exec(DescChecker) != null || blockedChars.exec(officerCdchecker) != null || blockedChars.exec(processTypechecker) != null || blockedChars.exec(updatedBychecker) != null 
//           if (checker != true) {
//             myServices.updateOfficerCode(myList).then((result) => {
//               let response = {
//                   contentType: "application/json",
//                   statusCode: 200,
//                   body: JSON.stringify({            
//                       data: result
//                   })
//                 };
//                 resolve(response);
//             });
//           } else {
//               let response = {
//                 contentType: "application/json",
//                 statusCode: 500,
//                 message: "Internal Server Error"
//               };
//               callback(null, response);
//             }
//         });
//     } else {
//         let response = {
//           contentType: "application/json",
//           statusCode: 500,
//           message: "Internal Server Error"
//         };
//       callback(null, response);
//     }
// } else{
//     let response = {
//       contentType: "application/json",
//       statusCode: 401,
//       message: "Unauthorized access!"
//     };
//     callback(null, response);
//   }
// }
// /*END: JJJ Workitem 1347027 - SR Tools Automation */

// //------------------------------------------------------- GRANT/REMOVE EA Upload Tools Access -------------------------------------------------------//

// export async function eaAccessToolHandler (event: any, context: any, callback: (...args: any[]) => void): Promise <any> {

//   var token = event.params.header['Authorization'];  
//   var [authResult] : any = await Promise.all([auth.authorize(token)]);

//   if(authResult['authResult'] == 'Authorized'){
//     //0 - grant access FE 
//     //1 - grant access BE
//     //2 - remove access FE
//     //3 - remove access BE
//     if(event.body.actionType == 0){
//       return new Promise(resolve => {
//         let myList = new EAAccessModel(event.body.enterpriseId, event.body.updatedBy, event.body.updateType);
//         let EidCdChecker = myList.EnterpriseID;
//         let UpdatedByChecker = myList.UpdatedBy;
//         let UpdateTypeChecker = myList.UpdateType;
//         let checker: boolean = blockedChars.exec(EidCdChecker) != null || blockedChars.exec(UpdatedByChecker) != null || blockedChars.exec(UpdateTypeChecker) != null
//           if (checker != true) {  
//               myServices.grantAccessFE(myList).then((result) => {
//                 let response = {
//                     contentType: "application/json",
//                     statusCode: 200,
//                     body: JSON.stringify({            
//                         data: result
//                     })
//                   };
//                 resolve(response);
//             });
//           } else {
//               let response = {
//                 contentType: "application/json",
//                 statusCode: 500,
//                 message: "Internal Server Error"
//               };
//               callback(null, response);
//             }
//         });
//     } else if (event.body.actionType == 1) {
//         return new Promise(resolve => {
//           let myList = new EAAccessModel(event.body.enterpriseId, event.body.updatedBy, event.body.updateType);
//           let EidCdChecker = myList.EnterpriseID;
//           let UpdatedByChecker = myList.UpdatedBy;
//           let UpdateTypeChecker = myList.UpdateType;
//           let checker: boolean = blockedChars.exec(EidCdChecker) != null || blockedChars.exec(UpdatedByChecker) != null || blockedChars.exec(UpdateTypeChecker) != null
//             if (checker != true) { 
//                 myServices.grantAccessBE(myList).then((result) => {
//                   let response = {
//                       contentType: "application/json",
//                       statusCode: 200,
//                       body: JSON.stringify({            
//                           data: result
//                       })
//                     };
//                   resolve(response);
//               });
//             } else {
//               let response = {
//                 contentType: "application/json",
//                 statusCode: 500,
//                 message: "Internal Server Error"
//               };
//               callback(null, response);
//             }
//         });
//     } else if (event.body.actionType == 2) {
//         return new Promise(resolve => {
//           let myList = new EAAccessModel(event.body.enterpriseId, event.body.updatedBy, event.body.updateType);
//           let EidCdChecker = myList.EnterpriseID;
//           let UpdatedByChecker = myList.UpdatedBy;
//           let UpdateTypeChecker = myList.UpdateType;
//           let checker: boolean = blockedChars.exec(EidCdChecker) != null || blockedChars.exec(UpdatedByChecker) != null || blockedChars.exec(UpdateTypeChecker) != null
//             if (checker != true) { 
//                 myServices.removeAccessFE(myList).then((result) => {
//                   let response = {
//                       contentType: "application/json",
//                       statusCode: 200,
//                       body: JSON.stringify({            
//                           data: result
//                       })
//                     };
//                   resolve(response);
//               });
//             } else {
//               let response = {
//                 contentType: "application/json",
//                 statusCode: 500,
//                 message: "Internal Server Error"
//               };
//               callback(null, response);
//             }
//         });
//     } else if (event.body.actionType == 3) {    
//         return new Promise(resolve => {
//           let myList = new EAAccessModel(event.body.enterpriseId, event.body.updatedBy, event.body.updateType);
//           let EidCdChecker = myList.EnterpriseID;
//           let UpdatedByChecker = myList.UpdatedBy;
//           let UpdateTypeChecker = myList.UpdateType;
//           let checker: boolean = blockedChars.exec(EidCdChecker) != null || blockedChars.exec(UpdatedByChecker) != null || blockedChars.exec(UpdateTypeChecker) != null
//             if (checker != true) { 
//                 myServices.removeAccessBE(myList).then((result) => {
//                   let response = {
//                       contentType: "application/json",
//                       statusCode: 200,
//                       body: JSON.stringify({            
//                           data: result
//                       })
//                     };
//                     resolve(response);
//                 });
//             } else {
//               let response = {
//                 contentType: "application/json",
//                 statusCode: 500,
//                 message: "Internal Server Error"
//               };
//               callback(null, response);
//             }
//         });
//     } else {
//         let response = {
//             contentType: "application/json",
//             statusCode: 500,
//             message: "Internal Server Error"
//         };
//         callback(null, response);
//     }
// }else {
//       let response = {
//         contentType: "application/json",
//         statusCode: 401,
//         message: "Unauthorized access!"
//       };
//     callback(null, response);
//   }
//}

