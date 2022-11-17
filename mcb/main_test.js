//document.getElementById("image1").src='template/sunny';
//document.getElementById("image2").src='template/';
//document.getElementById("image3").src='template/';



var xValues = [1,2,3];
var yValues0 = [4,5,6];
var yValues1 = [7,8,9];
var yValues2 = [7,8,9]; 

function main() {
    var ran1 = Math.floor((Math.random()*100) + 1);
    var ran2 = Math.floor((Math.random()*100) + 1);
    var ran3 = Math.floor((Math.random()*100) + 1);
    //==========================================hàm chech value=============================================
    function check_value(){
        //xuất giá trị
        document.getElementById("tem").innerHTML= ran1 + ' C';
        document.getElementById("hum").innerHTML= ran2 + ' %';
        document.getElementById("lux").innerHTML= ran3 + ' lux';
        // đổi màu 
        if ( ran1>=60){
            document.getElementById("nhietdo").style.backgroundColor = 'rgb(177, 42, 49)';
            document.getElementById("nhietdo").style.color = 'white';
        }
        else if ( ran1 >= 20 && ran1 <= 50 ){
            document.getElementById("nhietdo").style.backgroundColor = 'rgb(105, 47, 49)';
            document.getElementById("nhietdo").style.color = 'white';
        }
        else {
            document.getElementById("nhietdo").style.backgroundColor = 'rgb(117, 169, 199)';
            
        }

        if ( ran2>=60 ){
            document.getElementById("doam").style.backgroundColor = 'rgb(105, 181, 219)';
            document.getElementById("doam").style.color = 'white';
        }
        else if ( ran2 >= 20 && ran2 <= 60 ){
            document.getElementById("doam").style.backgroundColor = 'rgb(105, 181, 170)';
        }
        else {
            document.getElementById("doam").style.backgroundColor = 'rgb(110, 119, 153)';
        }

        if ( ran3>=40 ){
            document.getElementById("anhsang").style.backgroundColor = 'rgb(254, 201, 111)';
        }
        else if ( ran3 >= 20 && ran3 <= 40 ){
            document.getElementById("anhsang").style.backgroundColor = 'rgb(218, 178, 27)';
        }
        else {
            document.getElementById("anhsang").style.backgroundColor = 'rgb(87, 21, 0)';
            document.getElementById("anhsang").style.color = 'white';
        }
    }

    check_value();

    document.getElementById("tem").innerHTML= ran1 + ' C';
    document.getElementById("hum").innerHTML= ran2 + ' %';
    document.getElementById("lux").innerHTML= ran3 + ' lux';

    var currDate = new Date();
    var h =  currDate.getHours();
    var m = currDate.getMinutes();
    var s = currDate.getSeconds();
    var tg = h +":" + m + ":"+ s;
    function update_data(){
        xValues.push(tg);
        yValues0.push(ran1);
        yValues1.push(ran2);
        yValues2.push(ran3);
        if (xValues.length > 10){
            xValues.shift();
            yValues0.shift();
            yValues1.shift();
            yValues2.shift();
        }
    }
    update_data();
    function creat_char() {
        new Chart(document.getElementById("myChart"), {
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
        });
    }
    creat_char();
    setTimeout(main,1000);

    }
main();

function bulb_on1() {
    document.getElementById("bulb1").src="pic_bulbon.png";
}
function bulb_off1() {
    document.getElementById("bulb1").src="pic_bulboff.png";
}
function bulb_on2() {
    document.getElementById("bulb2").src="pic_bulbon.png";
}
function bulb_off2() {
    document.getElementById("bulb2").src="pic_bulboff.png";
}
document.getElementById("on1").onclick = function() {bulb_on1()}
document.getElementById("off1").onclick = function() {bulb_off1()}
document.getElementById("on2").onclick = function() {bulb_on2()}
document.getElementById("off2").onclick = function() {bulb_off2()}

//===================================================================


