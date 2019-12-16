 /*
 * SPDX-License-Identifier: MIT
 * Licensed to @Author: Salman Dabbakuti(https://github.com/Salmandabbakuti)
 * Permissioned Use Only
 *See the License for the specific language governing permissions and limitations under the License.
 */

'use strict';
const shim = require('fabric-shim');
const util = require('util');
const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const iv = Buffer.alloc(16, 0);

 function encrypt(data,password){
  const key = crypto.scryptSync(password, 'salt', 32);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  console.log(encrypted);
  return encrypted;
}

 function decrypt(cipherData,pasword){
 	const key = crypto.scryptSync(password, 'salt', 32);
 	const decipher = crypto.createDecipheriv(algorithm, key, iv);
   let decrypted = decipher.update(cipherData, 'hex', 'utf8');
   decrypted += decipher.final('utf8');
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
      if (args.length != 3) {
     return Buffer.from('Incorrect number of arguments. Expecting 2');
            }
   let credentialsAsBytes = await stub.getState(args[0]); 
   if (!credentialsAsBytes || credentialsAsBytes.toString().length <= 0) {
   console.info('**Storing Credentials on Blockchain**');

   const credentials  = {userName:args[0],password:args[1]};
   let data = JSON.stringify(credentials);
   let cipher = encrypt(data,args[2]);
   
   await stub.putState(args[0], Buffer.from(JSON.stringify(cipher)));
   console.info('*Signup Successfull..Your Username is '+args[0]);
   return Buffer.from('Signup Successfull..Your Username is '+args[0]);
        }
     else {
   return Buffer.from('Username is already taken.!');
      }
  }

async login(stub, args) {
  if (args.length != 3) {
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
  let decryptData= decrypt(data,args[2]);
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
