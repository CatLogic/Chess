
function TestPlugin(str){
    console.log(str)
};
TestPlugin.prototype.apply = function (compiler) {
    console.log('Well,its something');
    //console.log(compiler)
    compiler.plugin("run", function (compiler, callback) {
        console.log('I need attributes...');
        callback();
    })
};

module.exports = TestPlugin;