echo "Removing key from key store..."

rm -rf ./hfc-key-store

# Remove chaincode docker image
sudo docker rmi -f dev-peer0.org1.example.com-mycc-1.0-384f11f484b9302df90b453200cfb25174305fce8f53f4e94d45ee3b6cab0ce9
sleep 2

cd basic-network

./start.sh

# Now launch the CLI container in order to install, instantiate chaincode
# and prime the ledger with our 10 cars
sudo docker-compose -f ./docker-compose.yml up -d cli
sudo docker ps -a



echo 'Installing chaincode..'
sudo docker exec -it cli peer chaincode install -n mycc -v 1.0 -p "/opt/gopath/src/github.com/chaincode/" -l "node"

echo 'Instantiating chaincode..'
sudo docker exec -it cli peer chaincode instantiate -o orderer.example.com:7050 -C mychannel -n mycc -v 1.0 -c '{"Args": [""]}'
echo 'Getting things ready for chaincode calls..'
sleep 5

echo 'Invoking Chaincode From Org1 Peer'

sudo docker exec -it cli peer chaincode invoke -o orderer.example.com:7050 -n mycc -c '{"function":"signUp", "Args":["salman279","12345"]}' -C mychannel

sleep 5

echo 'Querying For Result on Org1 Peer'

sudo docker exec -it cli peer chaincode query -n mycc -c '{"function":"login","Args":["salman279","12345"]}' -C mychannel

echo 'All Done.. You are Awesome..'
sleep 1
echo 'What Just Happened?? You Succesfully Encrypted State Database and decrypted via nodejs chaincode..'
sleep 1
echo 'Signing off *Salman Dabbakuti*'
sleep 1
echo 'have a great day... bye..'

exit 1
