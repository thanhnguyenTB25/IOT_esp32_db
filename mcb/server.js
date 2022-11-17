//===============kết nối==========================
var express = require('express')  // Module xử lí chung
var mysql = require('mysql')     // Module cho phép sử dụng cơ sở dữ liệu mySQL
var mysql = require('mysql2') 
var mqtt = require('mqtt')        // Module cho phép sử dụng giao thức mqtt

var app = express()                // Port của localhost do mình chọn

// Require file export.js


var server = require("http").Server(app)
const io = require('socket.io')(server)



// var express = require('express')  // Module xử lí chung
// var mysql = require('mysql')     // Module cho phép sử dụng cơ sở dữ liệu mySQL 
// var mqtt = require('mqtt')        // Module cho phép sử dụng giao thức mqtt

// const app = express();
// //const http = require('http');

// //const server = http.createServer(app);
// var server = require('http').Server(app);
// var io = require('socket.io')(server);
//===================================cấu hình express============================//
app.use(express.static("public"))   // thư mục public nơi client: img,css,javascript...
// app.set("views engine", "ejs")
app.set("views", "./views")

app.get('/', function (req, res) {
    // res.render('home.ejs')
    res.sendFile(__dirname + "/views/index.html");
})

var port = 8888;
server.listen(port, function () {
    console.log('Server listening on port ' + port)
})

// //server.listen(port, () => {console.log('running server and listen on port '+ port)})
// //var server = require('http').createServer(app).listen(8888,() => {console.log('server running ....\n listen locall host:8888')});
// //=====================================end express=========================================//


//=====================mysql using phpmyadmin=================
var con = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "datasensor",
    //table: "sensor"
});
// var con = mysql.createConnection({  //thông tin kết nối đến sql
//     host: data_sql.host,
//     port: data_sql.port,
//     user: data_sql.user,
//     password: data_sql.password,
//     database: data_sql.database
//     }
// )
// con.connect(function(err) {
//     if(err) throw err;
//     console.log("database connect!")
// })
//===============================tao bang mysql===============================
// function creat_table() {
//     con.connect((err) => {
//         var sql = `CREATE TABLE IF NOT EXISTS sensors (id int NOT NULL AUTO_INCREMENT PRIMARY KEY, nhietdo int NOT NULL, doam int NOT NULL, anhsang int NOT NULL, thoigian datetime DEFAULT CURRENT_TIMESTAMP )`
//         con.query(sql, function(err,result,field){
//         if (err) throw err;
//             console.log("table created!")
//         })
//     })
// }
// creat_table();
//===============================================================================================================================
//=====================end sql====================================================================================================

//=====================mqtt connect==============================================================================================
var options = {
    host: 'f7d5ac8cea6f475fa9c5c6ac93e4592d.s1.eu.hivemq.cloud',
    port: 8883,
    protocol: 'mqtts',
    username: 'ngotruong2211@gmail.com',
    password: 'Truongpro99',
    clientId: 'serverjs2'
}
var setting ={
    port: 1883,
    host:'192.168.1.9',
    keepalive:1000,
};
const client = mqtt.connect('mqtt://broker.hivemq.com:1883',{clientId:'serverjsss3'});// initialize the MQTT client

// declare topics
// var topic1 = "livingroomLight";
// var topic2 = "livingroomAirConditioner";
// var topic3 = "television";
// var topic4 = "bedroomLight";
// var topic5 = "bedroomAirConditioner";
// var topic6 = "airVent";

// var topic_list = ["home/sensors/temperature-humidity"];
console.log("connected mqtt  " + client.connected)
client.on("connect", function (topic,message) {
    console.log("connected mqtt " + client.connected);
});
client.on("error", function (error) {
    console.log("Can't connect" + error);
    process.exit(1)
});

client.subscribe("home/sensors/"); // nhận dữ liệu từ esp32 để xử lý
//=======================end mqtt====================================================================================================


//=======================nhận data từ esp gửi lên mysql==============================================================================
var new_temp
var new_hum
var new_light
var list_topic = ["home/sensors/"]

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected MySQL!");
    console.log("start sending data to mysql....")
    client.on('message',function(topic,message) {
        if(topic == list_topic){
            const ObjData = JSON.parse(message)    // nhận message từ esp32 và chuyển nó thành dữ liệu dạng JSON
            new_temp = ObjData.Temperature // lưu value của temperature    // temperature : key của message sau khi chuyển sang dạng JSON
            new_hum = ObjData.Humidity    // in ra value của hum
            new_light = ObjData.Light    // in ra value của light
        }
        if (new_temp !=null && new_hum !=null && new_light !=null){
            con.connect((err) => {
                var sql = `INSERT INTO sensors (nhietdo,doam,anhsang) value (${new_temp},${new_hum},${new_light})`
                con.query(sql,function(err,result) {
                    if (err) throw err;
                    console.log("Data mysql is:");
                    console.log(new_temp,new_hum,new_light);
                })
            })
        }
        update_dulieu(con,io);  // update chart 
    })
})
//======================= nhận dữ liệu dạng json update lên đồ thị dùng socket io=================================================


var chart_temp = [];  // khai báo mảng dữ liệu để đẩy lên đồ thị
var chart_hum = [];
var chart_light =[];
var chart_time = [];
function update_dulieu(con,io){
    var d = new Date();
    var times = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
    con.query("SELECT * FROM sensors ORDER BY ID DESC LIMIT 1",(err,result,field)=>{    // lấy giá trị cảm biến từ result trong database(giá trị mới nhất = id cuối cùng)
        console.log(result)
        if (err) throw err;
        result.forEach((value) => {   // liệt kê mảng dữ liệu(thay for),ví dụ1:[index0,index1]==> printf index0,index1;    ví dụ2 [{ID:1,nhietdo:30, doam:60},{ID:12,nhietdo:35,doam:65}] ==> {ID:1,nhietdo:30,doam:60}; {ID:12,nhietdo:35,doam:65}
            //thêm dữ liệu vào mảng 
            chart_temp.push(value.nhietdo)
            chart_hum.push(value.doam)
            chart_light.push(value.anhsang)
            chart_time.push(times)
            //kiểm tra độ dài mảng có >10 ko ( nếu có thì xoá index[0])
            check_array(chart_temp);
            check_array(chart_hum);
            check_array(chart_light);
            check_array(chart_time);

            
            io.emit('server_update_data', { nhietdo_sql: value.nhietdo, doam_sql: value.doam, anhsang_sql: value.anhsang, time_sql: m_time })
            console.log('Gửi dữ liệu hiển thị')
            io.emit('server_update_graph', { c_temp: chart_temp, c_hum: chart_hum, c_light: chart_light, c_time: chart_time });
            console.log('Gửi mảng đồ thị');
        });
        
    })
}

//=================================khối xử lý nút bấm từ client gửi về server=====================================================//
/* 
        Khối nhận từ (client) socket(bản tin) => (server) => topic() MQTT (esp32)
*/
// Socket bản tin từ client => server => esp32
io.on("connection", function (socket) {
    console.log("connected socket on")
    //Show trạng thái ( kết nối/ngắt kết nối ) server localhost:3000
    socket.on('disconnect', function () {
        console.log("disconnected")
    })
    // Tên topic phải trùng với topic đã khai báo ở ESP32
    // button1 : điều khiển led_1
    // button2 : điều khiển led_2
    var topic1 = "button1";
    var topic2 = "button2";
    //Khi có bản tin socket (....) gửi từ client => publish topic (...) tương ứng về ESP32
    // Ví dụ :Khi client socket("Điều khiển LED 1", "trạng thái đèn")
    // Phía ESP32 nhận publish("tên topic","trạng thái đèn")
    socket.on("button1", function (data) { // nhận trạng thái đèn khi bấm
        client.publish(topic1);
        if (data == "on") {
            console.log('LED1 ON')
            client.publish(topic1, 'on');   // đẩy message từ topic1 cho esp32
        }
        else {
            console.log('LED1 OFF')
            client.publish(topic1, 'off');
        }
    })
    socket.on("button2", function (data) {
        client.publish(topic2);
        if (data == "on") {
            console.log('LED2 ON')
            client.publish(topic2, 'on');
        }
        else {
            console.log('LED2 OFF')
            client.publish(topic2, 'off');
        }
    })
})



// hàm ktra chỉ lấy 10 giá trị mảng
function check_array(arr) {
    if (arr.length == 11) {
        arr.shift();       // độ dài mảng >10 xóa phần tử đầu 
    }
}
