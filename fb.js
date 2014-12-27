window.fbAsyncInit = function() {
    FB.init({
      appId      : '1515108735428926',
      xfbml      : true,
      version    : 'v2.2'
    });
    var accessToken;
    FB.getLoginStatus(function(response) {
     if (response.status === 'connected') {
    var uid = response.authResponse.userID;
    accessToken = response.authResponse.accessToken;
    FB.api("/v2.2/me/home?limit=70", function (response) {
     	document.getElementById("message").innerHTML +=  repeater(response);
        //SUCCESS
        //console.log("response555");
    });
    
    var url = "https://graph.facebook.com/fql?q=SELECT+uid2+FROM+friend+WHERE+uid1=me()&access_token="+accessToken
 	geturl(url)
  } else if (response.status === 'not_authorized') { // [2]
 	console.log(response.status);
 	alert(response.status)
    // the user is logged in to Facebook, 
    // but has not authenticated your app
  } else { // [3]
 	console.log("not logged");
    // the user isn't logged in to Facebook.
 	FB.login(function(){
 		FB.api("/v2.2/me/feed?limit=20", function (response) {
     	//document.getElementById("message").innerHTML +=  "<br>"+response+"</br>";
        //SUCCESS
        console.log(response);
    });
	 //FB.api('/me/feed', 'post', {message: 'Test Message'});
    }, {scope: 'public_profile,user_status, read_stream'});
  }
    });
    
    //FB.login(function(){
	 //FB.api('/me/feed', 'post', {message: 'Test Message'});
    //}, {scope: 'public_profile,user_status, read_stream'});
    
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
   			html += "<div class = 'post'><p style = 'color:blue'>"+res.data[i].type+": "+res.data[i].from.name+"</p>"+res.data[i].message+"</div>"
   		}
   		return html
   	}
   }
   function geturl(url) {
  	var xhr = new XMLHttpRequest(); 
  	xhr.open('GET', url, true); // (2)
  	xhr.onreadystatechange = function() {  // (3)
    		if (xhr.readyState != 4) return; // (3.1)
		console.log(xhr.responseText)
    		return xhr.responseText; // (3.2)
  	}
  	xhr.send(null); // (4)
  }

