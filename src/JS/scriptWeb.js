var socket = io.connect('http://localhost:8080');



var light1 = document.getElementById('light1');
var light2 = document.getElementById('light2');
var light3 = document.getElementById('light3');
var light4 = document.getElementById('light4');

var lightValue1, lightValue2, lightValue3, lightValue4;
            
socket.on('message', function (message) {
    console.log('Le serveur a un message : '+message);
});

socket.on('state',function (address,data) {
    if(address==='0/2/1')
    {
        lightValue1=data;
        changeImageState(light1);
    }
       
    else if(address==='0/2/2')
    {
        lightValue2=data;  
        changeImageState(light2);
    }
        
    else if(address==='0/2/3')
    {
        lightValue3=data;
        changeImageState(light3);
    }
    else if(address==='0/2/4')
    {
        lightValue4=data;
        changeImageState(light4);
    }
});

$('#poke').click(function(){
    socket.emit('message','Coucou le serveur');
})

$('#connect').click(function(){
    socket.emit('message','Tentative de connection');
    $.get("http://localhost:3001/start",function(){
        alert('succes');
    })
        .done(function(){
            alert('second succcess');
        })
        .fail(function(){
            alert('error');
        })
        .always(function(){
            alert('finished');
        });
    
})

$('#disconnect').click(function(){
    socket.emit('message','Tentative de deconnection');
    $.get('http://localhost:3001/stop');
})

function changeImageState(element)
{
    var src=element.getAttribute('src');
    
    if(src=='../Images/lightOFF.png')
        src='../Images/lightON.png';
    else   
        src='../Images/lightOFF.png';  
}
