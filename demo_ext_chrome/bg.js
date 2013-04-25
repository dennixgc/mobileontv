var UI_Setting_storage={floating:'left'};
var pCode;
var channel;
var Tab;

var paired=false;
var retry_pending=false;

function initTVON(){
    retry_pending=false;
    channel=new tvON(function(p){
                     console.log('connected with ' + p);
                     pCode=p;
                });
    channel.setUnPairHandler(function(){
                             console.log('cut, while retry_pending =  ' + retry_pending);
                             paired=false;
                             if (!retry_pending) {
                                 retry_pending = true;
                                 setTimeout(initTVON,5000);
                             }
                             });
    channel.setPairHandler(function(){
                             paired = true;
                             channel.sendMessage(JSON.stringify({hello:{devID:12312312,model:'dfs-122',manID:'GoldenLink TV'}}));
                             chrome.tabs.sendMessage(Tab.tab.id,{paired:'OK'},function(res){});
                             });
    channel.setMessageHandler(function(msg){
                                var cmd=JSON.parse(msg);
                                chrome.tabs.sendMessage(Tab.tab.id,cmd,function(res){});
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