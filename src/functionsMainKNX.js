KnxHelper = require('./KNX/KnxHelper.js');
KnxConnectionTunneling = require('./KNX/KnxConnectionTunneling.js');

var server = require('./server.js');

var eibd = require('eibd');

exports.KnxHelper = KnxHelper;
exports.KnxConnectionTunneling = KnxConnectionTunneling;

var localAddress = '192.168.1.119'; //The model
var remoteAddress ='192.168.1.107'; //Me

var connection = new KnxConnectionTunneling(localAddress, 3671, remoteAddress, 13671);

var lumEteinte = false;
var lumAlumee = true;
var lightValue1, lightValue2, lightValue3 , lightValue4;
var speed; 
var indice; //index of the next toggled light - move between 1 & 4
var inter; //will be initialized as interval
var model;
var running;


//Listener call
    //state change
connection.on('event', function(data, data1, data2) {
    console.log('event '+data+' : '+data1); //device address + device value
    server.io.emit('state',data,data1);
    
    if(data ==='1/1/1' && data1 === '1')
    {
        console.log('Bouton 1 pressed');
        _pause();
    }
    else if(data ==='1/1/2' && data1 ==='1')
    {
        console.log('Bouton 2 pressed');
        _changePattern();
    }
    else if(data ==='1/1/3' && data1 ==='1')
    {
        console.log('Bouton 3 pressed');
        _decSpeed();
    }
    else if(data ==='1/1/4' && data1 ==='1')
    {
        console.log('Bouton 4 pressed');
        _incSpeed();
    }
});
    //RequestValue answer
connection.on('status', function(data, data1, data2) {
        console.log('status '+data+' : '+data1); //device address + device value
});

/////////////////////////////////////////////////

function toggleLight1() 
{
    lightValue1 = !lightValue1;
    connection.Action("0/1/1", lightValue1);
}
function setLight1(state)
{
    connection.Action('0/1/1',state);
}

function toggleLight2() 
{
    lightValue2 = !lightValue2;
    connection.Action("0/1/2", lightValue2);
}
function setLight2(state)
{
    connection.Action('0/1/2',state);
}

function toggleLight3() 
{
    lightValue3 = !lightValue3;
    connection.Action("0/1/3", lightValue3);
}
function setLight3(state)
{
    connection.Action('0/1/3',state);
}

function toggleLight4() 
{
    lightValue4 = !lightValue4;
    connection.Action("0/1/4", lightValue4);
}
function setLight4(state)
{
    connection.Action('0/1/4',state);
}

////////////////////////////////////////////////

function initLight()
{    
    connection.Action("0/1/1", lumEteinte);
    connection.Action("0/1/2", lumEteinte);
    connection.Action("0/1/3", lumEteinte);
    connection.Action("0/1/4", lumEteinte);
    
    lightValue1=lightValue2=lightValue3=lightValue4=lumEteinte;

    //connection.RequestStatus('0/1/1');
        
    speed=1000;
    indice=1;
    model = true;
    running=false;
}

function toggleEveryLight()
{
    if(model) //chaser first way
    {
        if(indice===1)
        {
            setLight1(lumAlumee);
            setLight2(lumEteinte);
            setLight3(lumEteinte);
            setLight4(lumEteinte);
        }
        else if(indice===2)
        {
            setLight2(lumAlumee);
            setLight1(lumEteinte);
            setLight3(lumEteinte);
            setLight4(lumEteinte);
        }
        else if(indice===3)
        {
            setLight3(lumAlumee);
            setLight1(lumEteinte);
            setLight2(lumEteinte);
            setLight4(lumEteinte);
        }
        else
        {
            setLight4(lumAlumee);
            setLight1(lumEteinte);
            setLight2(lumEteinte);
            setLight3(lumEteinte);
        }
    }
    else //chaser second way
    { 
        if(indice===1)
        {
            setLight1(lumEteinte);
            setLight2(lumAlumee);
            setLight3(lumAlumee);
            setLight4(lumAlumee);
        }
        else if(indice===2)
        {
            setLight2(lumEteinte);
            setLight1(lumAlumee);
            setLight3(lumAlumee);
            setLight4(lumAlumee);
        }
        else if(indice===3)
        {
            setLight3(lumEteinte);
            setLight1(lumAlumee);
            setLight2(lumAlumee);
            setLight4(lumAlumee);
        }
        else
        {
            setLight4(lumEteinte);
            setLight1(lumAlumee);
            setLight2(lumAlumee);
            setLight3(lumAlumee);
        }
    }
    
    if(indice < 4)
    {
        indice++;
    }
    else 
    {
        indice=1;
    }
}

function updateChaser()
{    
    clearInterval(inter);
    
    inter = setInterval(toggleEveryLight,speed);
    
    console.log('Chaser restarted');  
}

/////////////////////////////////////////////////////

exports.start = function(req,res){    
    
    connection.Connect(function () 
    { 
        console.log('Server KNX raised up');
        res.send('Server KNX raised up\n');
        
        initLight();
        console.log('Light initialized');
        
        inter = setInterval(toggleEveryLight,speed);
        console.log('Chaser started');
        
        running=true;
        server.io.emit('global','running',running);
    });       
};

exports.stop = function(req,res) {
    res.send("deconnexion en cours");
    
    clearInterval(inter);
    console.log('Chaser stoped');
    
    setTimeout(function () {
        connection.Disconnect();
        }, 700);
    console.log('Server KNX shutted down');
    
    running=false;
    server.io.emit('global','running',running);
};

function _pause() 
{ 
    var _return;
    
    if(running)
    {
        clearInterval(inter);
        console.log('Chaser paused');
        running=false;
        _return = 'Chaser paused';
    }
    else
    {
        inter = setInterval(toggleEveryLight,speed);
        console.log('Chaser restarted');
        //res.send('Chaser restarted');
        running=true;
        _return = 'Chaser Restarted';
    }
    
    return _return;
}
exports.pause = function(req,res) {
    res.send(_pause());
}

//////////////////////////////////////////////////

exports.changeSpeed = function(req,res) {
    if(req.params.value>=500 && req.params.value<=2000)
    {
        speed=req.params.value;
        console.log('New speed set : '+req.params.value);
        res.send('New speed set : '+req.params.value+'\n');
        
        updateChaser();
    }
    else
    {
        console.log('This speed is unavailable');
        res.send('This speed is unavailable');
    }
};

function _incSpeed () 
{
    var _return;
    
    if(speed>=1000)
    {
        speed-=500;
        updateChaser();
        
        console.log('Speed increased. New value : '+speed);
        _return ='Speed increased. New value : '+speed;
    }
    else
    {
        console.log('Speed not increased');
        _return = 'Speed not increased';
    }
    
    return _return;
}
exports.incSpeed = function(req,res){res.send(_incSpeed());};

function _decSpeed() 
{
    var _return;
    
    if(speed<=1500)
    {
        speed+=500;
        updateChaser();
        
        console.log('Speed decreased. New value : '+speed);
        _return = 'Speed decreased. New value : '+speed;
    }
    else
    {
        console.log('Speed not decreased');
        _return = 'Speed not decreased';
    }
    
    return _return;
}
exports.decSpeed = function(req,res){res.send(_decSpeed());};

function _changePattern () 
{
    var _return;
    
    model=!model;
    console.log('Pattern changing');
    _return ='Pattern changing\n';
}
exports.changePattern = function(req,res){res.send(_changePattern());};

exports.getLightValue1 = function(req,res) {
   
};