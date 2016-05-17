
var socket = io();

var light1 = document.getElementById('light1');
var light2 = document.getElementById('light2');
var light3 = document.getElementById('light3');
var light4 = document.getElementById('light4');

var lightValue1, lightValue2, lightValue3, lightValue4;

////////////////////////////////////////////////////////////

socket.on('message', function (message) {
    console.log('Le serveur a un message : '+message);
});

socket.on('state',function (address,data) {
    
    console.log("address: "+address+" data: "+data);
    if(address=='0/2/1')
    {
        lightValue1=data;
        changeImageState(light1,data);
    }
       
    else if(address=='0/2/2')
    {
        lightValue2=data;  
        changeImageState(light2,data);
    }
        
    else if(address=='0/2/3')
    {
        lightValue3=data;
        changeImageState(light3,data);
    }
    else if(address=='0/2/4')
    {
        lightValue4=data;
        changeImageState(light4,data);
    }
});

socket.on('global',function(id,value){
    if(id=="running")
    {   
        console.log("running");
        if(value==true)
        {
            $('#connect').prop('disabled', true);
            $('#disconnect').prop('disabled', false);
            console.log("run");
        }
        else
        {
            $('#connect').prop('disabled', false);
            $('#disconnect').prop('disabled', true);
            console.log("!run");
        }
            
    }
});

////////////////////////////////////////////////////////////

$("#patternSwitch").bootstrapSwitch();
$("#patternSwitch").on('switchChange.bootstrapSwitch', function(event,state){
     $.get("http://localhost:3001/pattern/change");
});

////////////////////////////////////////////////////////////

/*$('#poke').click(function(){
    socket.emit('message','Coucou le serveur');
})*/

$('#connect').click(function(){
    socket.emit('message','Tentative de connection');
    $.get("http://localhost:3001/start");
    
})
$('#disconnect').click(function(){
    socket.emit('message','Tentative de deconnection');
    $.get('http://localhost:3001/stop');
})

$('#speedInputValidation').click(function(){
    var speedValue = document.getElementById("speedInput");
    
    if(!isNaN(parseInt(speedValue.value)) && isFinite(speedValue.value))
    {
        if(speedValue.value>=500 && speedValue.value<=2000)
        {
            $.get("http://localhost:3001/speed/"+speedValue.value);
            alert("new vitesse : "+speedValue.value);    
        }    
        else
            alert(speedValue.value+" is not an available speed !");
    }
    else
        alert('Wrong entry !');
})

$('#speedDown').click(function(){
    //socket.emit('message','Tentative de connection');
    $.get("http://localhost:3001/speed/down");
    
})
$('#pause').click(function(){
    //socket.emit('message','Tentative de deconnection');
    $.get('http://localhost:3001/pause');
})
$('#speedUp').click(function(){
    //socket.emit('message','Tentative de deconnection');
    $.get('http://localhost:3001/speed/up');
})



////////////////////////////////////////////////////////////

function changeImageState(element, value)
{
    /*if(element.src.match('../Images/lightOFF.png'))
        element.src='../Images/lightON.png';
    else   
        element.src='../Images/lightOFF.png'; */
    if(value==0)
        element.src='../Images/lightOFF.png';
    else
        element.src='../Images/lightON.png';
}

