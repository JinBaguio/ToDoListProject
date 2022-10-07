var jwt = require('jsonwebtoken');

export class Authorizer {
    public async authorize(getToken){

        var certFile = await this.getKey(getToken);
        return new Promise(resolve => {
            try {
              jwt.verify(getToken, certFile, function(err: any, decoded: any) {
                if(err){
                  console.log("Error: " + err);
                  let response401 = {
                    contentType: "application/json",
                    statusCode: 401,
                    authResult: 'Unauthorized',
                    message: err
                  }
                  resolve(response401);   
                }
                else{   
                  console.log("Authorizer");
                  let issuer = decoded['iss'];
                  let userId = decoded['userId']; 
                  let userRole = decoded['role'];
                    if (((issuer.indexOf('appName') != -1 || issuer.indexOf('appName') != -1))) {
                        let response = {
                                contentType: "application/json",
                                statusCode: 200,
                                authResult: 'Authorized',
                                userId: userId,
                                userRole: userRole,
                                issuer: issuer
                            }
                            resolve (response);
                        }
                    else{
                    let response401 = {
                        contentType: "application/json",
                        statusCode: 401,
                        authResult: 'Unauthorized',
                        message: err
                        }
                    resolve (response401);
                    }
                }    
              });  
            } 
            catch(err) {
              console.log("Error: " + err);
              let response401 = {
                contentType: "application/json",
                statusCode: 401,
                authResult: 'Unauthorized',
                message: err
              }
              resolve (response401);   
            }
        });
    }

        public getKey(getToken){       
            var certUri;
            var decoded = jwt.decode(getToken, {complete: true});
            var header = decoded.header
            var LambdaEnv;

            if(LambdaEnv.indexOf('DEV')!= -1){
                certUri = '<application certification url>';
            }
            else if(LambdaEnv.indexOf('DIR')!= -1){
                certUri = '<application certification url>';
            }

            var jwksClient = require('jwks-rsa');
            var client = jwksClient({
            jwksUri: certUri
            });

            return new Promise(resolve => {
            client.getSigningKey(header.kid, function(err, key) {
                if(err){
                    resolve(err);
                }
                else {
                    var signingKey = key.publicKey || key.rsaPublicKey;
                    resolve(signingKey);
                }
            });
        });
    }
}
