
var socket = io('http://localhost:8888')
var xValues ;
var yValues0 ;
var yValues1 ;
var yValues2 ; 

function main() {

    //==========================================update value of data=============================================
    //khởi tạo biến để lưu giá trị tạm thời
    var tem,hum,light,time;
    socket.on("server_update_data",function(data){
        tem = data.nhietdo_sql;
        hum = data.doam_sql;
        light = data.anhsang_sql;
        document.getElementById("tem").innerHTML= tem + ' C';
        document.getElementById("hum").innerHTML= hum + ' %';
        document.getElementById("lux").innerHTML= light + ' lux';

        // đổi màu 
        if ( tem>=60){
            document.getElementById("nhietdo").style.backgroundColor = 'rgb(177, 42, 49)';
            document.getElementById("nhietdo").style.color = 'white';
        }
        else if ( tem >= 20 && tem <= 50 ){
            document.getElementById("nhietdo").style.backgroundColor = 'rgb(105, 47, 49)';
            document.getElementById("nhietdo").style.color = 'white';
        }
        else {
            document.getElementById("nhietdo").style.backgroundColor = 'rgb(117, 169, 199)';
            
        }

        if ( hum>=60 ){
            document.getElementById("doam").style.backgroundColor = 'rgb(105, 181, 219)';
            document.getElementById("doam").style.color = 'white';
        }
        else if ( hum >= 20 && hum <= 60 ){
            document.getElementById("doam").style.backgroundColor = 'rgb(105, 181, 170)';
        }
        else {
            document.getElementById("doam").style.backgroundColor = 'rgb(110, 119, 153)';
        }

        if ( light>=40 ){
            document.getElementById("anhsang").style.backgroundColor = 'rgb(254, 201, 111)';
        }
        else if ( light >= 20 && light <= 40 ){
            document.getElementById("anhsang").style.backgroundColor = 'rgb(218, 178, 27)';
        }
        else {
            document.getElementById("anhsang").style.backgroundColor = 'rgb(87, 21, 0)';
            document.getElementById("anhsang").style.color = 'white';
        }
    })

    //=================================================end=============================================================
    //=================================================update chart from phpmyadmin using protocol socket io ====================================
    socket.on("server_update_graph",function(data){
        bieudo.data.datasets[0].data = data.c_temp
        bieudo.data.datasets[1].data = data.c_hum;
        bieudo.data.datasets[2].data = data.c_light;
        bieudo.data.labels = data.c_time;
        bieudo.update()
    });
    var bieudo = new Chart(document.getElementById("myChart"), {
        type: "line",
        data: {
            labels: xValues,
            datasets: [{
                fill: false,
                backgroundColor:  "red",
                borderColor: "#3e95cd",
                data: yValues0,
                label: "nóng"
            },
            {
                fill: false,
                backgroundColor: "green",
                borderColor: "#8e5ea2",
                data: yValues1,
                label: "ẩm"
            },
            {
                fill: false,
                backgroundColor: "yellow",
                borderColor: "#3cba9f",
                data: yValues2,
                label: "sáng"
                } 
            ]
        },
        options: {
            legend: {display: true},
            title :{
                text:"Đồ thị ",
                display: true
            }
        }
    })
    //===============================================end=============================================================
}
main();
//===========================hien thi ngày giờ==========================
function checkTime(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  }
  
  function startTime() {
    var today = new Date();
    
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    // add a zero in front of numbers<10
    m = checkTime(m);
    s = checkTime(s);
    document.getElementById('time').innerHTML = today.getFullYear() +'/'+ today.getMonth()+'/'+ today.getDay() +' - '+ h + ":" + m + ":" + s;
    t = setTimeout(function() {
      startTime()
    }, 500);
  }
  startTime();
//===================================================xử lý nút bấm====================================================
var cout = 1;
function bulb_on1(){

    if(confirm("ban muon bat/tat den?") == true && cout == 1){
        document.getElementById("bulb1").src = "pic_bulbon.png"
        document.getElementById("change_color").style.backgroundColor = "rgb(215, 207, 27)"
        cout =0;
        socket.emit("button1","on")
    }
    else{
        document.getElementById("bulb1").src = "pic_bulboff.png"
        document.getElementById("change_color").style.backgroundColor = "#249f11"
        cout =1;
        socket.emit("button1","off")
    }
}
document.getElementById("change_color").onclick = function() {bulb_on1()}
// document.getElementById("change_color2").onclick = function() {bulb_off1()}

function bulb_on2() {
    var status1 = 0;    
    if(confirm("ban muon bat den?") == true){
        document.getElementById("bulb2").src='pic_bulbon.png';
        status1 = 1;
        socket.emit("button2","on")
    }
    // else{
    //     if(status1 == 1){
    //         document.getElementById("bulb2").src='pic_bulbon.png';
    //     }
    //     else{
    //         document.getElementById("bulb2").src='pic_bulboff.png'
    //     }
    // }
}
function bulb_off2() {
    st2 = 0;
    if(confirm("ban muon tat den ? ") == true){
        document.getElementById("bulb2").src='pic_bulboff.png';
        socket.emit("button2","off")
        st2 = 1;
    }
    // else{
    //     if(st2 == 1){
    //         document.getElementById("bulb2").src='pic_bulbon.png';
    //     }
    //     else{
    //         document.getElementById("bulb2").src='pic_bulboff.png';
    //     }
    // }
}

document.getElementById("on2").onclick = function() {bulb_on2()}
document.getElementById("off2").onclick = function() {bulb_off2()}
