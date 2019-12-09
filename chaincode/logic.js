'use strict';
const shim = require('fabric-shim');
const util = require('util');
const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

function encrypt(text) {
 let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
 let encrypted = cipher.update(text);
 encrypted = Buffer.concat([encrypted, cipher.final()]);
 return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
}

function decrypt(text) {
 let iv = Buffer.from(text.iv, 'hex');
 let encryptedText = Buffer.from(text.encryptedData, 'hex');
 let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
 let decrypted = decipher.update(encryptedText);
 decrypted = Buffer.concat([decrypted, decipher.final()]);
 return decrypted.toString();
}
let Chaincode = class {
 
   async Init(stub) {
       console.info('=========== Instantiated Validation Chaincode===========');
       return shim.success();
            }

async Invoke(stub) {
    let ret = stub.getFunctionAndParameters();
    console.info(ret);

    let method = this[ret.fcn];
    if (!method) {
      console.error('no function of name:' + ret.fcn + ' found');
      throw new Error('Received unknown function ' + ret.fcn + ' invocation');
            }
    try {
      let payload = await method(stub, ret.params);
      return shim.success(payload);
         } 
    catch (err) {
      console.log(err);
      return shim.error(err);
            }
     }
  
async signUp(stub, args) {
      if (args.length != 2) {
     return Buffer.from('Incorrect number of arguments. Expecting 2');
            }
   let credentialsAsBytes = await stub.getState(args[0]); 
   if (!credentialsAsBytes || credentialsAsBytes.toString().length <= 0) {
   console.info('**Storing Credentials on Blockchain**');

   const credentials  = {userName:args[0],password:args[1]};
   let data = JSON.stringify(credentials);
   let cipher = encrypt(data);
   
   await stub.putState(args[0], Buffer.from(JSON.stringify(cipher)));
   console.info('*Signup Successfull..Your Username is '+args[0]);
   return Buffer.from('Signup Successfull..Your Username is '+args[0]);
        }
     else {
   return Buffer.from('Username is already taken.!');
      }
  }

async login(stub, args) {
  if (args.length != 2) {
     return Buffer.from('Incorrect number of arguments. Expecting 2');
        }
    
  let userName=args[0];
  let password=args[1];
  let credentialsAsBytes = await stub.getState(args[0]); 
    
  if (!credentialsAsBytes || credentialsAsBytes.toString().length <= 0) {
    return Buffer.from('Incorrect Username..!');
         }
  else{
  let data= JSON.parse(credentialsAsBytes);
  let decryptData= decrypt(data);
  let credentials= JSON.parse(decryptData);
  if (password!=credentials.password) {
  return Buffer.from('Incorrect Password..!');
        }

  //Functions go here after signin
  console.log('Login Successfull..✓');
  return Buffer.from('Login Successfull..');
      }
  }

}

shim.start(new Chaincode());
