var channel;
var uiURL = "http://mobileontv.com/ui?";
$(document).ready(function(){
                  chrome.extension.sendMessage({getPairingCode: document.URL});
                  channel = new tvON(function(pcode){
                                        $("#div_QR").empty();
                                        $("#div_QR").qrcode({width:400,height:400,text:uiURL + pcode});
                                     });
                    
                  });

var bgPage = chrome.extension.getBackgroundPage();
