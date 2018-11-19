/////////////////////////////////////////////////////////////////////
function getCrtServer()
{
   TB3O.fullServerName = crtUrl.host;
   TB3O.gServer = TB3O.fullServerName.replace(/\.travian\./, '');

   __DUMP__(TB3O.fullServerName)
   __DUMP__(TB3O.gServer)

   return;
}

/////////////////////////////////////////////////////////////////////
function getServerTime(aDoc)
{
   var dServerTime;
   var ttServer;
   var dNow = new Date();
   dNow.setMilliseconds(0);
   var ttNow = dNow.getTime();
   TB3O.localTimeOffset = 0;

   var aNode = __TEST__({{$g("servertime",aDoc)}});
   if ( aNode ) 
   {
      var timerNode = $xf("./child::span["+ $xClass('timer') +"]",'f',aNode);
      if ( timerNode )
      {
         ttServer = timerNode.getAttribute("value") * 1000;
      }

      if ( !ttServer )
      {
         var p = aNode.textContent.match(/(\d+):(\d+):(\d+)/);

         if ( p !== null && p.length === 4 )
         {
            dServerTime = new Date(dNow.getFullYear(), dNow.getMonth(), dNow.getDate(), p[1], p[2], p[3]);
            var ttServer = dServerTime.getTime();
            if ( ttServer - ttNow > 43200000/*12h*/ ) { ttServer -= 86400000;/*24h*/ }
            else if ( ttNow - ttServer > 43200000/*12h*/ ) { ttServer += 86400000;/*24h*/ }
         }
      }

      if ( ttServer )
      {
         dServerTime = new Date(ttServer);
         TB3O.localTimeOffset = ttNow - ttServer;
      }
   }
   __ASSERT__(dServerTime, "Can't determine server time")

   return dServerTime ? dServerTime : dNow;
}

/////////////////////////////////////////////////////////////////////
function getServerLanguage()
{
   var crtServerX = crtUrl.host.split(".");
   var strFirst = crtServerX[0];
   var strLast = crtServerX[crtServerX.length - 1];
   var lng = '';

   if ( strLast === "net" ) // Spanish
   {
      lng = "es";
   }
   else if ( strLast === "at" ) // Austria
   {
      lng = "de";
   }
   else if ( strLast === "org" )
   {
      if ( strFirst === "research" )
      {
         lng = "en";
      }
      else
      {
         lng = "de";
      }
   }
   else if ( strLast === "uk" || strLast === "us" )
   {
      lng = "en";
   }
   else if ( strLast === "com" )
   {
      if ( strFirst.indexOf("arabia") !== -1 )
      {
         lng = "ae";
      }
      else
      {
         lng = "en";
      }
   }
   else if ( strLast === "cl" && strLast === "mx" ) // Chile & Mexico
   {
      lng = "ar";
   }
   else if ( strLast === "asia" )
   {
      lng = "th";
   }

   if ( lng === '' ) { lng = strLast; }

   return lng;
}

/////////////////////////////////////////////////////////////////////
function getServerType()
{
   var strFirst = crtUrl.host.split(".")[0];
   var strFirst2 = strFirst.slice(-2);
   var nServerType = 0; 
   var speed = TB3O.ServerInfo.speed; // may by undefined

   // server type
   if ( strFirst2 === "x3" || strFirst.indexOf("speed") !== -1 || strFirst.indexOf("vip") !== -1 || strFirst.indexOf("research") !== -1 || speed === 3)
   {
      nServerType = 1;
   }
   else if ( strFirst2 === "x2" || isSomeOf(crtUrl.host,"t1.travian.com","ty2.travian.com","finals.travian.com") || speed === 2)
   {
      nServerType = 2;
   }
   else if ( strFirst2 === "x4" || speed === 4)
   {
      nServerType = 4;
   }
   else if ( strFirst2 === "x5" || speed === 5)
   {
      nServerType = 3;
   }
   else if ( strFirst2 === "x8" || speed === 8)
   {
      nServerType = 5;
   }

   return nServerType;
}
