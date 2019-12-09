# hlf-encryption
encrypting state database in hyperledger-fabric 

There are some cases when we will be dealing with sensitive data like storing credit cards data, bank information etc. As part of our business application in distributed ledger.
End-user wanted to secure this confidential information even if the database is compromised. In blockchain,there are minute chances that database is hacked. 
Although chances are less for hacking blockchain database, it is good practice to encrypt user data when storing in blockchain databse. 
We are going to demonstrate encryption of user data via different chaincodes(go and nodejs).

#### Quick demo

```
git clone https://github.com/BCDevs/hlf-encryption.git

cd hlf-encryption
chmod 777 node-start.sh
chmod 777 go-start.sh
./node-start.sh #nodejs chaincode encryption model (credentials storing and validation logic)
./go-start.sh #golang chaincode encryption model (tuna supplychain logic)

```
<img aligin="center" src ="https://github.com/BCDevs/hlf-encryption/blob/node/db.jpg">

#### Cons

>Encryption key will get changed after every chaincode upgrade. So we are not able to decrypt previously stored data.


**©Salman Dabbakuti**
