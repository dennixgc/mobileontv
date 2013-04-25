function tvON(connect_callback,tag,url) {
	//service = url?url: "ws://192.168.1.200:8901";
	service = url?url: "ws://184.169.168.33:80";
	protocol = {
	  TV_Reg:{v1:10},
	  TV_Reg_OK:{v1:15,body:{pairingCode:"$1",TVUUID:"$2"}},
	  Phone_Invite:{v1:20,body:{pairingCode:""}}, 
	  TV_Hooked_Notice:{v1:30,body:{PhoneID:""}},
	  Phone_Invite_OK:{v1:35,body:{TVID:""}},
	  UnHook_Notice:{v1:40},
	  DeliverMe:{v1:50,body:{}}
	};
	
    this.pairString = "TvON not connect yet";
    
    this.ws= new WebSocket(service);
    this.ws.ch=this;
    this.ws.h=function(){};
    this.ws.l=function(){};
    this.ws.u=function(){};
    this.ws.tag = this.tag = tag;
    
 	this.ws.onopen = function(){
	   var msg=JSON.stringify(protocol.TV_Reg);
	   this.send(msg);
	};
    this.ws.onmessage = function (evt){
	  var pack = JSON.parse(evt.data);
	  switch (pack.v1){
	  case protocol.TV_Reg_OK.v1:
		  this.ch.pairString = pack.body.pairingCode + ":" + pack.body.TVUUID ;
		  connect_callback(this.ch.pairString,this.tag);
  		  break;
	  case protocol.TV_Hooked_Notice.v1:
          this.l(this.tag);
		  break;
	  case protocol.UnHook_Notice.v1:
          this.u(this.tag);
		  break;
	  case protocol.DeliverMe.v1:
		  this.h(pack.body,this.tag);
		  break;
	  }
    };
    this.ws.onclose = function()
    { 
        this.u(this.ch);
    };

    this.setMessageHandler =function(hdl){this.ws.h=hdl;}; 
    this.setPairHandler = function (hl1){this.ws.l= hl1;};
    this.setUnPairHandler = function (hu1){this.ws.u= hu1;};

    this.sendMessage=function(msg){
	  try{
		  var pack = protocol.DeliverMe;
		  pack.body= msg;
		  var msg=JSON.stringify(pack);
		  this.ws.send(msg);}
	  catch(e){
		  console.log("Sending message before connected ERROR");
	  }			  
    };		
};