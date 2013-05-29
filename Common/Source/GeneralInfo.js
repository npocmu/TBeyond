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
function saveCapitalInfo(mapId, name)
{
   if ( mapId )
   {
      TBU_CAPITAL_ID = ''; // get later
      TBU_CAPITAL_MAPID = mapId.toString();
      TBU_CAPITAL_NAME = name;
      var xy = id2xy(mapId);
      TBU_CAPITAL_XY = xy[0] + "|" + xy[1];
   }
   else // no capital
   {
      TBU_CAPITAL_ID = '-';
      TBU_CAPITAL_MAPID = '-';
      TBU_CAPITAL_NAME = '-';
      TBU_CAPITAL_XY = "0|0";
   }
   savePlayerInfo();
}

/////////////////////////////////////////////////////////////////////
function getCapitalId()
{
   var villageInfo = getVillageInfoByMapId(TB3O.VillagesInfo, TBU_CAPITAL_MAPID);
   __ASSERT__(villageInfo, "Can't get capital id for mapId=" + TBU_CAPITAL_MAPID)

   if ( villageInfo )
   {
      TBU_CAPITAL_ID = villageInfo.id;
      __DUMP__(TBU_CAPITAL_ID)
      savePlayerInfo();
   }
   else
   {
      // something wrong, set values to "-" so as to prevent endless detection loop
      saveCapitalInfo();
   }
}

/////////////////////////////////////////////////////////////////////
function setRace(tix)
{
   TBU_RACE_DELTA = tix;
   TBU_RACE = getRaceFromTroopIndex(tix);
   __DUMP__(TBU_RACE,TBU_RACE_DELTA)
   savePlayerInfo();
}


/////////////////////////////////////////////////////////////////////
// race cookies are undefined - enter the barracks
function getRaceFromBarracks()
{
   ajaxRequest(bksLnk, 'GET', null, 
      function (ajaxResp)
      {
         //race recognition - first image in table of troops
         if ( ajaxResp.responseText.search(/unit u(\d+)/) !== -1 ) 
         {
            var xV = parseInt10(RegExp.$1);
            if ( !isNaN(xV) ) { setRace(xV); }
         }
         __ASSERT__(TBU_RACE !== '', "Can't detect race for player from barraks")
      }
   );
}

/////////////////////////////////////////////////////////////////////
// TODO: determine TB3O.localTimeOffset
function getServerTime(aDoc)
{
   var dServerTime;
   var dNow = new Date();
   dNow.setMilliseconds(0);
   var ttNow = dNow.getTime();
   TB3O.localTimeOffset = 0;

   var tp1 = __TEST__({{$g("tp1",aDoc)}});
   if ( tp1 ) 
   {
      var p = tp1.textContent.split(":");
      if ( p.length === 3 )
      {
         dServerTime = new Date(dNow.getFullYear(), dNow.getMonth(), dNow.getDate(), p[0], p[1], p[2]);
         var ttServer = dServerTime.getTime();
         if ( ttServer - ttNow > 43200000/*12h*/ ) { ttServer -= 86400000;/*24h*/ }
         else if ( ttNow - ttServer > 43200000/*12h*/ ) { ttServer += 86400000;/*24h*/ }
         dServerTime.setTime(ttServer);
         TB3O.localTimeOffset = ttNow - ttServer;
         // roundup to 15 min
         //TB3O.localTimeOffset = Math.floor(TB3O.localTimeOffset/900000)*900000
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
