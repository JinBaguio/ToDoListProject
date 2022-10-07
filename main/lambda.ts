import { Service } from '../src/services/Service';
import { CmpnyModel } from '../src/models/CmpnyModel';
import { LoggingModel } from '../src/models/loggingModel';
import { Authorizer } from '../authorizer/authorizer'

const myServices =  new Service();
const auth =  new Authorizer();

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

  //------------------------------------------------------- Client Admin CRUD -------------------------------------------------------//

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

