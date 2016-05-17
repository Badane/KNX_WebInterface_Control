KnxHelper = require('./KNX/KnxHelper.js');
KnxConnectionTunneling = require('./KNX/KnxConnectionTunneling.js');

var server = require('./server.js');

var eibd = require('eibd');

exports.KnxHelper = KnxHelper;
exports.KnxConnectionTunneling = KnxConnectionTunneling;

var localAddress = '192.168.1.119'; //The model
var remoteAddress ='192.168.1.114'; //Me

var connection = new KnxConnectionTunneling(localAddress, 3671, remoteAddress, 13671);

var lumEteinte = false;
var lumAlumee = true;
var lightValue1, lightValue2, lightValue3 , lightValue4;
var speed; 
var indice; //index of the next toggled light - move between 1 & 4
var inter; //will be initialized as interval
var model; //pattern
var mode; // auto or manual
var running; 
var connected;


//Listener call
    //state change
connection.on('event', function(data, data1, data2) {
    console.log('event '+data+' : '+data1); //device address + device value
    server.io.emit('state',data,data1);
    
    if(data ==='1/1/1' && data1 === '1')
    {
        console.log('Bouton 1 pressed');
        _start();
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

/////////////////////////////////////////////////////
/////////////////////////////////////////////////////
/////////////////////////////////////////////////////

function toggleLight1() 
{
    lightValue1 = !lightValue1;
    connection.Action("0/1/1", lightValue1);
}
exports.toggle1=function(req,res){
    if(connected && !mode)
    {
        toggleLight1();
        res.send('toggle light 1');
    }
    else
        res.send('not connected or auto activated');
};


function setLight1(state)
{
    connection.Action('0/1/1',state);
}


function toggleLight2() 
{
    lightValue2 = !lightValue2;
    connection.Action("0/1/2", lightValue2);
}
exports.toggle2=function(req,res){
    if(connected && !mode)
    {
        toggleLight2();
        res.send('toggle light 2');
    }
    else
        res.send('not connected or auto activated');
};

function setLight2(state)
{
    connection.Action('0/1/2',state);
}

function toggleLight3() 
{
    lightValue3 = !lightValue3;
    connection.Action("0/1/3", lightValue3);
}
exports.toggle3=function(req,res){
    if(connected && !mode)
    {
        toggleLight3();
        res.send('toggle light 3');
    }
    else
        res.send('not connected or auto activated');
};

function setLight3(state)
{
    connection.Action('0/1/3',state);
}

function toggleLight4() 
{
    lightValue4 = !lightValue4;
    connection.Action("0/1/4", lightValue4);
}
exports.toggle4=function(req,res){
    if(connected && !mode)
    {
        toggleLight4();
        res.send('toggle light 4');
    }
    else
        res.send('not connected or auto activated');
};

function setLight4(state)
{
    connection.Action('0/1/4',state);
}

/////////////////////////////////////////////////////
/////////////////////////////////////////////////////
/////////////////////////////////////////////////////


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
    mode=true; //auto
}

exports.initInterface = function(req,res){
    if(connected== null )
        server.io.emit('global','connected',false);
    else
        server.io.emit('global','connected',connected);
    
    if(running== null )
        server.io.emit('global','running',false);
    else
        server.io.emit('global','running',running);
    
    if(model== null )
        server.io.emit('global','pattern',true);
    else
        server.io.emit('global','pattern',model);
    
    if(mode== null )
        server.io.emit('global','mode',true);
    else
        server.io.emit('global','mode',mode);
    
    console.log(lightValue1);
    
    if(!lightValue1 || lightValue1==null)
        server.io.emit('state','0/2/1',0);
    else
        server.io.emit('state','0/2/1',1);
    
    if(!lightValue2 || lightValue2==null)
        server.io.emit('state','0/2/2',0);
    else
        server.io.emit('state','0/2/2',1);
    
    if(!lightValue3 || lightValue3==null)
        server.io.emit('state','0/2/3',0);
    else
        server.io.emit('state','0/2/3',1);
   
    if(!lightValue4 || lightValue4==null)
        server.io.emit('state','0/2/4',0);
    else
        server.io.emit('state','0/2/4',1);
};

/////////////////////////////////////////////////////
/////////////////////////////////////////////////////
/////////////////////////////////////////////////////

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
/////////////////////////////////////////////////////
/////////////////////////////////////////////////////

exports.connect = function(req,res){        
    connection.Connect(function () 
    { 
        console.log('Server KNX raised up');
        res.send('Server KNX raised up\n');
        
        initLight();
        console.log('Light initialized');
        
        connected=true;
        server.io.emit('global','connected',connected);
    });    
};

function _start()
{
    var _return;
    
    if(connected)
    {
        if(running || !mode)
        {
            clearInterval(inter);
            console.log('Chaser paused');
            running=false;
            server.io.emit('global','running',running);
            _return='pause';
            
        }
        else if(!running && mode)
        {
            inter = setInterval(toggleEveryLight,speed);
            console.log('Chaser restarted');
            running=true;
            server.io.emit('global','running',running);
            _rerurn='play';
        }
    }
    else
        _return='non connecté';
}
exports.start = function(req,res){res.send(_start());};

exports.stop = function(req,res) {
    res.send("deconnexion en cours");
    
    clearInterval(inter);
    console.log('Chaser stoped');
    
    setTimeout(function () {
        connection.Disconnect();
        }, 700);
    console.log('Server KNX shutted down');
    
    connected=false;
    server.io.emit('global','connected',connected);
};

//////////////////////////////////////////////////
//////////////////////////////////////////////////
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

////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

function _changePattern () 
{
    var _return;
    
    model=!model;
    console.log('Pattern changing');
    _return ='Pattern changing\n';
    server.io.emit('global','pattern',model);
    
}
exports.changePattern = function(req,res){res.send(_changePattern());};

function _changeMode () 
{
    var _return;
    
    mode=!mode;
    if(!mode)
       _start();
    
    console.log('Mode changing');
    
    
    server.io.emit('global','mode',mode); 
    _return ='Mode changing\n';    
}
exports.changeMode = function(req,res){res.send(_changeMode());};