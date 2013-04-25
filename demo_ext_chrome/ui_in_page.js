console.log('injected');

var uiURL = "http://192.168.1.200/MobileOnTV/mobileontv/www/vIndex.html?";

function init_UI(){
    $('body').append('<div id="ontv_div_QR" style="position:absolute;left:50%;margin-left:-200px;top:50%;margin-top:-200px"></div>');
}

function init_serverConnection(){
    chrome.runtime.sendMessage({getPairingCode:123},function(res){
                                if (res.phonePaired){
                                    console.log('already paired with a phone');
                                }else{
                                    $("#ontv_div_QR").empty();
                                    $("#ontv_div_QR").qrcode({width:400,height:400,text:uiURL + res.pairingCode});
                                    console.log(res);
                                }
    })
};

$(function(){
  init_UI();
  init_serverConnection();
  });

chrome.runtime.onMessage.addListener(function(req,sender,sendRes){
                                     console.log(req);
                                     if (req.paired) { $("#ontv_div_QR").empty(); };
                                     if (req.gotoUrl) {window.location=req.gotoUrl};
                                    });