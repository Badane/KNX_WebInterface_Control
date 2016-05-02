module.exports = function (app) {
    var methodeKNX = require('./functionsMainKNX');
   
    app.get('/start',methodeKNX.start);
    app.get('/stop',methodeKNX.stop);
    app.get('/pause',methodeKNX.pause);
    
    app.get('/speed/up',methodeKNX.incSpeed);
    app.get('/speed/down',methodeKNX.decSpeed);
    app.get('/speed/:value',methodeKNX.changeSpeed);
    
    app.get('/pattern/change',methodeKNX.changePattern);
    
    app.get('/value/light1',methodeKNX.getLightValue1);
    
};
