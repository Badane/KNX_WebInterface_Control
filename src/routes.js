module.exports = function (app) {
    var methodeKNX = require('./functionsMainKNX');
   
    app.get('/connect',methodeKNX.connect);
    app.get('/start',methodeKNX.start);
    app.get('/stop',methodeKNX.stop);
    
    app.get('/toggle1',methodeKNX.toggle1);
    app.get('/toggle2',methodeKNX.toggle2);
    app.get('/toggle3',methodeKNX.toggle3);
    app.get('/toggle4',methodeKNX.toggle4);
    
    app.get('/speed/up',methodeKNX.incSpeed);
    app.get('/speed/down',methodeKNX.decSpeed);
    app.get('/speed/:value',methodeKNX.changeSpeed);
    
    app.get('/pattern/change',methodeKNX.changePattern);
    app.get('/mode/change',methodeKNX.changeMode);
};
