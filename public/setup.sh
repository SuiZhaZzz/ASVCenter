if [ ! -d "./cesium" ] 
then
wget https://github.com/CesiumGS/cesium/releases/download/1.94.3/Cesium-1.94.3.zip
unzip Cesium-1.94.3.zip -d cesium
rm ./Cesium-1.94.3.zip
fi

if [ ! -d "./coordtransform" ] 
then
git clone https://github.com/wandergis/coordtransform.git
fi