window.fbAsyncInit = function() {
    FB.init({
      appId      : '1515108735428926',
      xfbml      : true,
      version    : 'v2.2'
    });
   FB.login(function(){
 FB.api('/me/feed', 'post', {message: 'Hello, world!'});
}, {scope: 'publish_actions'});

}

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));