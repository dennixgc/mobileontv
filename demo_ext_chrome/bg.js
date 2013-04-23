var ws=new WebSocket("ws://localhost:8080");
ws.onopen=function(){
  console.log("Connected to service");
};
var UI_Setting_storage={floating:'left'};



chrome.extension.onMessage.addListener
(function(request, sender, sendResponse){
 console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
 if (request.loadUI) sendResponse({UISettings:UI_Setting_storage});
 if (request.saveUI) UI_Setting_storage = request.UISettings;
});