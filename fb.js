	var paging={
		nextLink:"",
		prevLink:""
	};
	var presentFeed = {} // storage for existed  post's links
window.fbAsyncInit = function() {
    FB.init({
      appId      : '1515108735428926',
      xfbml      : true,
      version: 'v2.2'
    });
    FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
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
   		var html="", article;
   		for (var i=0, l=res.data.length;i<l;i++) {
   			var it = res.data[i], capt='', linkTitle='',type=' ';
   			if(it.status_type && it.status_type == "shared_story" && it.caption && it.caption.length>140) {
	   				capt = "<p class = 'caption'><b>"+it.properties[0].text+":</b> "+it.caption+"</p>"
	   			}
   			if(!presentFeed[it.link]&&((it.message&&it.message.length>140)||(it.type=="status" && it.message)||capt)) {
   				if((it.type == "video" || it.type == "link") && it.name) {
	   				linkTitle = "<p class = 'linkTitle caption'>"+(res.data[i].type).slice(0,1)+": "+it.name+"</p>"
	   			}
	   			if(it.type == "photo") type= " ("+(res.data[i].type).slice(0,2)+")"
   				article= "<div class = 'post "+res.data[i].type+"'><p class = 'header'>"
   					+res.data[i].from.name+type+goodDate(res.data[i].updated_time)
   					+"</p>"+linkTitle+(it.message?it.message:'')+capt+"</div>";
   				html +=article;
   				presentFeed[it.link] = true
   			}
   		}
   		return html
   	}
   }
   function freshnews(){
   	if(paging.prevLink) {
   		document.getElementById("spinner").style.display="block";
	   	var url = "me/home?limit=70&&"+paging.prevLink
	   	FB.api(url, function (response) {
	   		document.getElementById("spinner").style.display="none"
	   		if (response.paging) {
	   			paging.prevLink=response.paging.previous.substring(response.paging.previous.indexOf("since")); 
	     			document.getElementById("feed").innerHTML = repeater(response)+document.getElementById("feed").innerHTML;
	   		}
	        	console.log(response);
	        	console.log(paging);
	    	});
   	}
   }
   function oldnews(){
   	if(paging.nextLink) {
   		document.getElementById("spinner").style.display="block";
	   	var url = "me/home?limit=70&&"+paging.nextLink
	   	FB.api(url, function (response) {
	   		document.getElementById("spinner").style.display="none";
	   		if (response.paging) {
	   			paging.nextLink =response.paging.next.substring(response.paging.next.indexOf("until")); 
	     			document.getElementById("feed").innerHTML += repeater(response)
	   		}
	        	console.log(response);
	        	console.log(paging);
	    	});
   	}
   }
   function getNews(){
   	document.getElementById("spinner").style.display="block";
   	FB.api("me/home?limit=70", function (response) {
   		document.getElementById("spinner").style.display="none";
   		paging.nextLink =response.paging.next.substring(response.paging.next.indexOf("until")); 
   		paging.prevLink=response.paging.previous.substring(response.paging.previous.indexOf("since"));
     		document.getElementById("feed").innerHTML =  repeater(response);
        	console.log(response);
        	console.log(paging);
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
	} else if(today) { return ms.getDate()+"/"+ms.getMonth()+" "+ms.getHours()+":"+("0" + ms.getMinutes()).slice(-2)
	} else {return "no date"}
}
function statusChangeCallback(response) {
     if (response.status === 'connected') {
    var uid = response.authResponse.userID;
    var accessToken = response.authResponse.accessToken;
    getNews()
 //	geturl(url)
  } else if (response.status === 'not_authorized') { // [2]
  	document.getElementById('status').innerHTML = 'Please log into Facebook. '
  	+ '<fb:login-button scope="public_profile, user_status, read_stream, email,'
        +'user_friends" onlogin="checkLoginState()"></fb:login-button>';
 	//login()
    // the user is logged in to Facebook, 
    // but has not authenticated your app
  } else { // [3]
  document.getElementById('status').innerHTML = 'Please log into Facebook. '
  	+ '<fb:login-button scope="public_profile, user_status, read_stream, email,'
        +'user_friends" onlogin="checkLoginState()"></fb:login-button>';
    // the user isn't logged in to Facebook.
 //	FB.login(function(){
//		getNews() 
 //   }, {scope: 'public_profile,user_status, read_stream'});
  }
  }

  // This function is called when someone finishes with the Login
  // Button.  See the onlogin handler attached to it in the sample
  // code below.
  function checkLoginState() {
    FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    });
  }
