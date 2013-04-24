var UI_Setting_storage={floating:'left'};
var pCode;
var channel;
var Tab;

var paired=false;
var timmer_retry;
function initTVON(){
    channel=new tvON(function(p){
                     console.log('connected with ' + p);
                     pCode=p;
                });
    channel.setUnPairHandler(function(){
                             console.log(timmer_retry);
                             paired=false;
                             if (!timmer_retry) timmer_retry = setTimeout(initTVON,5000);
                             });
    channel.setPairHandler(function(){
                             paired = true;
                             channel.sendMessage(JSON.stringify({hello:{devID:12312312,model:'dfs-122',manID:'GoldenLink TV'}}));
                             chrome.tabs.sendMessage(Tab.tab.id,{paired:'OK'},function(res){});
                             });
    channel.setMessageHandler(function(msg){
                                chrome.tabs.sendMessage(Tab.tab.id,{message:msg},function(res){});
                                console.log(msg);
                              });
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
                                     Tab = sender;
                                     console.log(Tab);
                                     if (request.loadUI) sendResponse({UISettings:UI_Setting_storage});
                                     if (request.saveUI) UI_Setting_storage = request.UISettings;
                                     if (request.getPairingCode){
                                           
                                     sendResponse({phonePaired:paired,pairingCode:pCode});
                                     }
});

console.log('BG working');
initTVON();