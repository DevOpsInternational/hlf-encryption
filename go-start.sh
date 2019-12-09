echo "Removing key from key store..."

rm -rf ./hfc-key-store

# Remove chaincode docker image
sudo docker rmi -f dev-peer0.org1.example.com-mycc-1.0-384f11f484b9302df90b453200cfb25174305fce8f53f4e94d45ee3b6cab0ce9
sleep 2
cd chaincode
rm -rf errors
git clone https://github.com/pkg/errors.git
cd ..

cd basic-network
./start.sh

sudo docker ps -a

sudo docker-compose -f docker-compose.yml up -d cli

sudo docker ps -a


echo 'Installing chaincode..'
sudo docker exec -it cli peer chaincode install -n mycc -v 1.0 -p "github.com/chaincode/"

echo 'Instantiating chaincode..'
sudo docker exec -it cli peer chaincode instantiate -o orderer.example.com:7050 -C mychannel -n mycc -v 1.0 -c '{"Args":[]}'

echo 'Getting things ready for Chaincode Invocation..should take only 10 seconds..'

sleep 10

echo 'Registering Tunas..'

sudo docker exec -it cli peer chaincode invoke -o orderer.example.com:7050 -C mychannel -n mycc -c '{"function":"initLedger","Args":[]}'

sleep 5
# Starting docker logs of chaincode container

sudo docker logs -f dev-peer0.org1.example.com-mycc-1.0


