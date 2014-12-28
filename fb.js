	var paging={
		nextLink:"",
		prevLink:""
	};
window.fbAsyncInit = function() {
    FB.init({
      appId      : '1515108735428926',
      xfbml      : true,
      version: 'v2.2'
    });
    var accessToken;
    FB.getLoginStatus(function(response) {
     if (response.status === 'connected') {
    var uid = response.authResponse.userID;
    accessToken = response.authResponse.accessToken;
    getNews()
 //	geturl(url)
  } else if (response.status === 'not_authorized') { // [2]
 	console.log(response.status);
 	alert(response.status)
 	login()
    // the user is logged in to Facebook, 
    // but has not authenticated your app
  } else { // [3]
 	console.log("not logged");
    // the user isn't logged in to Facebook.
 	FB.login(function(){
		getNews() 
    }, {scope: 'public_profile,user_status, read_stream'});
  }
    });
    
  };

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));
   
   function repeater (res) {
   	if (res.data && res.data.length) {
   		var html="";
   		for (var i=0, l=res.data.length;i<l;i++) {
   			var it = res.data[i], capt='';
   			if(it.status_type && it.status_type == "shared_story" && it.caption && it.caption.length>140) capt = "<p class = 'caption'>"+it.caption+"</p>"
   			if((it.message&&it.message.length>140)||(it.type=="status" && it.message)||capt) { html += "<div class = 'post "+res.data[i].type+"'><p class = 'header'>"
   			+res.data[i].from.name+" ("+(res.data[i].type).slice(0,2)+") — "+goodDate(res.data[i].updated_time)
   			+"</p>"+(it.message?it.message:'')+capt+"</div>" }
   		}
   		return html
   	}
   }
   function freshnews(){
   	if(paging.prevLink) {
	   	var url = "me/home?limit=70&&"+paging.prevLink
	   	FB.api(url, function (response) {
	   		if (response.paging) paging.prevLink=response.paging.previous.substring(response.paging.previous.indexOf("since")); 
	     		document.getElementById("feed").innerHTML = repeater(response)+document.getElementById("feed").innerHTML;
	        	console.log(response);
	    	});
   	}
   }
   function oldnews(){
   	if(paging.nextLink) {
	   	var url = "me/home?limit=70&&"+paging.nextLink
	   	FB.api(url, function (response) {
	   		if (response.paging) paging.nextLink =response.paging.next.substring(response.paging.next.indexOf("until")); 
	     		document.getElementById("feed").innerHTML += repeater(response)
	        	console.log(response);
	    	});
   	}
   }
   function getNews(){
   	FB.api("me/home?limit=70", function (response) {
   		paging.nextLink =response.paging.next.substring(response.paging.next.indexOf("until")); 
   		paging.prevLink=response.paging.previous.substring(response.paging.previous.indexOf("since"));
     		document.getElementById("feed").innerHTML +=  repeater(response);
        	console.log(response);
    });	
   }
   //var url = "https://graph.facebook.com/v2.0/fql?q=SELECT+uid2+FROM+friend+WHERE+uid1=me()&access_token="+accessToken
   function geturl(url) {   //FQL doesn't works with this version 
  	var xhr = new XMLHttpRequest(); 
  	xhr.open('GET', url, true); // (2)
  	xhr.onreadystatechange = function() {  // (3)
    		if (xhr.readyState != 4) return; // (3.1)
		console.log(xhr)
    		return xhr.responseText; // (3.2)
  	}
  	xhr.send(null); // (4)
  }
  function login (date) {
  	FB.login(function(){
		getNews() 
    }, {scope: 'public_profile,user_status, read_stream'});
  }
function goodDate (date) {
	var ms = new Date(date);
	var today = new Date();
	if ((today-ms)<86400000) {return ms.getHours()+":"+("0" + ms.getMinutes()).slice(-2)	
	} else { return ms.getDate()+"/"+ms.getMonth()+" "+ms.getHours()+":"+("0" + ms.getMinutes()).slice(-2)}
}
