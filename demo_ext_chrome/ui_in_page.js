console.log('injected');
var ws;

function init_UI(){
    $('body').append('<div id="ouju_ui_div"><div id="ouju_ui_main">Test Test Test</div><div id="ouju_ui_mini">15</div></div>');
    $("#ouju_ui_div").on("click",function(evt){ UI.toggleFloat(); });
    $("#ouju_ui_main").on("click",function(evt){ UI.toggleMode(); });
    $("#ouju_ui_mini").on("click",function(evt){ UI.toggleMode(); });
    $("#ouju_ui_main").html(document.title);
    UI.loadSettings();
}

function init_serverConnection(){
  ws = new WebSocket("ws://localhost:8080");
  ws.onmessage=function(msg){
    //console.log(msg.data);
  };
};
var UI={settings:{}};

UI.toggleFloat=function(){
   if (UI.settings.floating == 'left') {UI.settings.floating = 'right' }else{ UI.settings.floating = 'left'};
   UI.floatTo(UI.settings.floating);
   UI.saveSettings();
}

UI.floatTo=function(location){
   if (location == 'left') $("#ouju_ui_div").removeClass("ouju_UI_right").addClass("ouju_UI_left");
   if (location == 'right') $("#ouju_ui_div").removeClass("ouju_UI_left").addClass("ouju_UI_right");
}

UI.toggleMode=function(){
    if (UI.settings.mode == 'mini') {UI.settings.mode = 'main' }else{ UI.settings.mode = 'mini'};
    UI.switchTo(UI.settings.mode);
    UI.saveSettings();
}
UI.switchTo=function(mode)
{
    if(mode == 'mini') {$('#ouju_ui_main').hide();$('#ouju_ui_mini').show(); }
    if(mode == 'main') {$('#ouju_ui_main').show();$('#ouju_ui_mini').hide(); }
}
UI.applySettings=function(){
    UI.floatTo(UI.settings.floating);
    UI.switchTo(UI.settings.mode);
}

UI.loadSettings=function()
{
    console.log('loading setting');
    chrome.extension.sendMessage({loadUI: document.URL}, function(response) {
    console.log(response);
    if (response.UISettings) {
        for (item in response.UISettings)  UI.settings[item] = response.UISettings[item];
        UI.applySettings();
        console.log(UI);
    }
  });
}

UI.saveSettings=function(){
    chrome.extension.sendMessage({saveUI: document.URL, UISettings:UI.settings});
}

$(function(){
  init_UI();
  init_serverConnection();
  });