<template>
  <q-page class="flex flex-center bg-grey-10 text-white">
    <!-- 地图容器 -->
    <div id="map" style="z-index:0"></div>
  </q-page>
   
</template>

<script>
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { defineComponent, createApp } from "vue";
import emitter from '/utils/emitter'
import 'leaflet-rotatedmarker';


export default defineComponent({
    name: 'IndexPage',
    data() {
      return {
        map: null,
        flag:true,
        index:0,
        count:0,
        angel:0,
        points: [],
        markers: [],
        latlngs: [],
        myArrMarkers: [],
        ArrMarkerNow:null,
        TrackPolyline:null,
        myPositionMarker:[],
        picking:false,
        emitter:emitter,
        marker_group:null,
        polyline_group:null,
        myArrMarker_group:null,
        posArray: [[29.2528517238937,106.26253155836176],
                      [29.24431435918019, 106.26424837669079],
                      [29.241545549326922,106.23539797367722],
                      [29.214352904627635,106.21136918571088],
                      [29.22922596307239,106.17518199758842],
                      [29.22237207917139,106.15041689319192],
                      [29.183974642828478, 106.15510058259794],
                      [29.155606098880668, 106.1130029209668],
                      [29.13079265816907, 106.11858408404869],
                      [29.104020010761992, 106.14065664468207],
                      [29.069670447688583,106.12673770284263],
                      [29.067944978913065, 106.09549160925393],
                      [29.090372414744806,106.05807864448451],
                      [29.098174934059678, 106.01420853580595],
                      [29.086999477053038, 105.9972120343484],
                      [ 29.064044736134736, 106.0028775348342],
                      [29.055266572251817, 105.89918170775962],
                      [29.030650592759876, 105.85994363333747],
                      [28.99837485103207,105.85153122352511],
                      [28.98591221617105,105.85530822384901],
                      [28.965187884447506,105.82028512993641],
                      [28.94220623408941, 105.82972947178185],
                      [28.943708470085383, 105.86887292968419],
                      [28.92973683475157, 105.88449597647852],
                      [ 28.897579898279837, 105.87539683933458],
                      [28.875038638467785, 105.90733404805655],
                      [28.859851035862796, 105.91316105353931],
                      [28.825717361286404, 105.88826718776807],
                      [ 28.804810597641644,105.84672018420507],
                      [28.831732918469708, 105.82216968209963],
                      [ 28.85052929374259, 105.79006517934637],
                      [28.911255943574506, 105.7828545423644],
                      [28.916214719920816,105.75675890376283],
                      [28.905996376310817,105.73632876564713],
                      [ 28.877590106923478,105.71401012736948],
                      [28.86872094988015, 105.67778526062652],
                      [28.86751829403273,105.63040107474475],
                      [28.876086913250735, 105.61975680110463],
                      [28.90915214866367, 105.64671084887073],
                      [ 28.9243285698584,105.64053030288613],
                      [28.937249316416917, 105.60653729997094],
                      [28.962184806476827, 105.57511952454931],
                      [28.960832159679658, 105.58815507027899],
                      [28.95557510759421,105.55330365819924],
                      [28.937248439659335, 105.54437620288822],
                      [28.90900099896973,105.56274615900902],
                      [ 28.897880215327902,105.55914084051804],
                      [28.885706099702556, 105.53939742973395],
                      [28.871425997337063, 105.50179910832775],
                      [28.888561894185997, 105.48325706125496],
                      [28.9061457859255, 105.47810660626783],
                      [28.909752369871534, 105.45475787699274],
                      [ 28.87037362252021, 105.45405824195548],
                      [28.854287204696902, 105.36564209800939],
                      [28.829626882325446,105.34830663091566],
                      [ 28.807968811739073, 105.35311372223698],
                      [28.792178641563606, 105.370592501244],
                      [28.778938931659493, 105.36527036442398],
                      [ 28.757270326815032,105.32011804236993],
                      [ 28.75350795794095, 105.29264894910513],
                      [ 28.734091980283733,105.26432144667581],
                      [ 28.75839901104029,105.2050912143236]],
      }
    },
    
    mounted() {
      // 地图初始化
      this.initMap();
      //载入
      setTimeout(() => {
        emitter.emit('ChannelLoad');
      }, 1000);
      //等待事件
      this.eventReady();
      //船运动
      setInterval(() => {
        //添加AIS信息
            //移除上一次的箭头和轨迹
            if(this.count>0){
              this.map.removeLayer(this.ArrMarkerNow);
            }
            if(this.index>1){
                this.map.removeLayer(this.TrackPolyline);
            }
            //添加航船
            this.count++;
            var myIcon = L.icon({
              iconUrl: 'boat.ico',
              iconSize: [50, 50],
              iconAnchor: [22, 40],
              popupAnchor: [-3, -76],
            });
            this.index=(this.index+1)%62;
            var content="船舶名称:船舶001   MMSI:123456789</br>船舶识别号:CN20179333214</br>国籍：中国船   海/内河船:内河船</br>总吨:5415.00   船舶类型:多用途船</br> 船宽(米):16.20  船长(米):129.90</br>"+
                "经纬度:"+ this.posArray[this.index]+"</br>航速(节):3.700   航向:279.900";
            this.myPositionMarker[this.index]=new L.marker((this.posArray[this.index]),{icon:myIcon}).addTo(this.map).bindPopup(content);
            //某一时刻船对应的方向箭头
            this.ArrMarkerNow=this.myArrMarkers[this.index];
            //删除航船上一时刻的图层
            if(this.count>0){
              if(this.count%62==0){
                  this.map.removeLayer(this.myPositionMarker[61]);
              }else{
                this.map.removeLayer(this.myPositionMarker[this.index-1]);
              }
            }
            //添加轨迹
            if(this.index>0){
                this.TrackPolyline = L.polyline([this.posArray[this.index-1],this.posArray[this.index]], {color: 'white'}).addTo(this.map);
            }

      }, 5000);
      //箭头闪烁
      setInterval(() => {
         if (this.flag) {
                    //移除图形
                    this.map.removeLayer(this.ArrMarkerNow);
                    this.flag = false;
                }
                else {
                    //添加图形
                    this.ArrMarkerNow.addTo(this.map);
                    this.flag = true;
                }

      }, 200);
      
    },

    methods: {
      
      //*****使用id为map的div容初始化地图，同时指定地图的中心点和缩放级别*****
      initMap() {
        //定义地图
        let map = L.map("map", {
          center: [ 29.232351,106.229], // 中心位置
          zoom: 14, // 缩放等级
          attributionControl: true, // 版权控件
          zoomControl: true //缩放控件
        });
        this.map = map; // data上需要挂载
        //添加航道图(geoserver发布的WMS服务)
        L.tileLayer.wms("http://localhost:8080/geoserver/cite/wms",{
          layers:'cite:merge1',
        }).addTo(this.map)
        L.tileLayer.wms("http://localhost:8080/geoserver/cite/wms",{
          layers: 'cite:merge',
          format: 'image/svg',
        }).addTo(this.map)
        //添加箭头
        var myArrMarkerTemp;
        var myArrIcon = L.icon({
            iconUrl: 'arr.png',
            iconSize: [40, 40],
            iconAnchor: [22, 40],
            popupAnchor: [-3, -76],
          });
        for(var i=0;i<this.posArray.length;i++){
            var temp=this.posArray[i][1]-0.003;
            myArrMarkerTemp=new L.marker(([this.posArray[i][0],temp]),{icon:myArrIcon});
            //设置箭头的角度
          if(i!=this.posArray.length-1){
                  let dx = this.posArray[i+1][1] - this.posArray[i][1];
                  let dy = this.posArray[i+1][0] - this.posArray[i][0];
                  let t = Math.atan2(dy, dx);
                  if (t < 0) t += 2 * Math.PI;
                  myArrMarkerTemp.setRotationAngle(this.angle); // 恢复箭头的方向
                  this.angle = 360 * t / (2 * Math.PI);
                  myArrMarkerTemp.setRotationAngle(-this.angle+90);
            }
           
            //添加至标记数组
            this.myArrMarkers.push(myArrMarkerTemp);
        }
        

      //禁止双击放大
      this.map.doubleClickZoom.disable();
      },
      //****************************左击、右击鼠标****************************
      //左击鼠标规划航点
      click_callback: function (e) {
        if (this.picking == false) return;
        //获取经纬度
        var lat = e.latlng.lat, lng = e.latlng.lng;
       //加入数组
        var marker=new L.marker([lat,lng]);
        var point=new L.point(lat,lng);
        this.markers.push(marker);
        this.points.push(point);
        //画图
        this.redraw();
    },
     //右击鼠标时删除最新定位的点，相当于撤销
     rightclick_callback: function (e) {
      if (this.picking == false) return;
      this.markers.pop();
      this.points.pop();
      this.redraw();
    },
    //****************************在图上进行绘画****************************
      redraw: function(){
        this.clearMarkerGroup();
        this.clearPolylineGroup();
        this.createMarkerGroup();
        this.createPolylineGroup();
      },
    //创建标记并且添加到图层
      createMarkerGroup(){
        this.marker_group=new L.layerGroup(this.markers).addTo(this.map);
      },
    //清除标记
      clearMarkerGroup: function(){
        if(this.marker_group){
          this.marker_group.clearLayers();
        }
      },
    //创建折线并且添加至图层
      createPolylineGroup: function(){
        if(this.points.length>1){
            this.latlngs = [];
            this.points.forEach(element => {
                var latlng=[element.x,element.y];
                this.latlngs.push(latlng);
            });
            this.polyline_group= new L.polyline(this.latlngs,{color:'red'}).addTo(this.map);
        }
       
      },
    //清除折线
      clearPolylineGroup: function(){
          if(this.polyline_group){
             this.map.removeLayer(this.polyline_group);
          }
      },
    //***********************开始、结束、取消和发送规划***********************
      end_plan: function () {
        this.picking = false;
        this.clear_plan();
      },
      begin_plan: function () {
        this.end_plan();
        this.picking = true;

      },
      clear_plan: function () {
        this.markers=[];
        this.points=[];
        this.redraw();
      },
      cor_convert() {
        /*var data = []
        for (var i = 0; i < this.points.length; i++) {
          var tmp = this.points[i]
          var bd09togcj02 = coordtransform.bd09togcj02(tmp.lat, tmp.lng);
          var gcj02towgs84 = coordtransform.gcj02towgs84(bd09togcj02[0], bd09togcj02[1]);
          data.push(gcj02towgs84);
        }
        return data;*/
         this.picking = false;
         return this.pick_points;
      },
       //***************************等待事件发生****************************
      eventReady: function () {
        this.map.on('click', this.click_callback);
        this.map.on('contextmenu', this.rightclick_callback);
        this.emitter.on('beginPlan', event => { this.begin_plan(); })
        this.emitter.on('endPlan', event => { this.end_plan(); })
        this.emitter.on('clearPlan', event => { this.clear_plan(); })
        this.emitter.on('sendPlan', event => { this.emitter.emit('Plan', this.cor_convert()); })
      },
    },
    //退出
    unmounted() {
          this.emitter.emit('ChannelLeave');
    }
})
</script>


<style scoped>
  #map {
    width: 2000px;
    height: 800px;
    margin: 50px auto;
  }
</style>