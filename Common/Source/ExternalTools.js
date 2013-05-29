//////////////////////////////////////////////////////////////////////
function normalizeLangCode(lng) 
{ 
   var ttbLang = lng;

   switch ( lng )
   {
      case "il":
         ttbLang = "he";
         break;
      case "au":
      case "us":
      case "uk":
      case "en":
         ttbLang = "en";
         break;
      case "es":
      case "ar":
      case "cl":
      case "mx":
         ttbLang = "es";
         break;
      case "kr":
         ttbLang = "ko";
         break;
      case "pt":
      case "br":
         ttbLang = "pt";
         break;
      case "cn":
      case "tw":
      case "hk":
         ttbLang = "cn";
         break;
   }
   return ttbLang;
}

//////////////////////////////////////////////////////////////////////
// analyser server (wsSName)
function getwsSName() 
{ 
   var crtServerX = crtUrl.host.split(".");
   var strFirst = crtServerX[0];
   var strLast = crtServerX[crtServerX.length - 1];

   if (strLast === "com" && strFirst === "t1")
   {
      wsSName = "com01";
   }
   else if (strFirst.indexOf("speed") !== -1 && strLast === "se")
   {
      //swedish x server
      wsSName = strLast + "z";
   }
   else if (strFirst === "speed1" && strLast === "ae")
   {
      //aex 1
      wsSName = strLast + "z";
   }
   else if (strFirst === "speed2" && strLast === "ae")
   {
      //aex 2
      wsSName = strLast + "y";
   }
   else if (strFirst === "speed" && strLast === "net")
   {
      wsSName = "netx";
   }
   else if (strFirst === "speed" || strFirst === "speedserver" || TB3O.nServerType === 1)
   {
      //all other x servers
      if (strLast.indexOf("asia") != -1)
      {
         wsSName = "thx";
      }
      else wsSName = strLast + "x";
   }
   else if (strFirst === "team")
   {
      wsSName = "team";
   }
   else if (strFirst === "lv1")
   {
      wsSName = "lv1";
   }
   else if (strLast === "com" && strFirst.indexOf("ae") != -1)
   {
      wsSName = strFirst;
   }
   else if (strLast === "at")
   {
      wsSName = "at";
   }
   else if (strLast === "org")
   {
      wsSName = "org";
   }
   else if (strLast === "cat")
   {
      wsSName = "cat";
   }
   else if (strLast === "net")
   {
      //Spanish
      wsSName = "net" + strFirst.substr(strFirst.search(/[0-9]{1,2}/));
   }
   else if (strLast === "fr" && TB3O.O[27] != "1")
   {
      //france3-exception fr3nchlover; france-exception Turio
      wsSName = "fr" + strFirst.substr(strFirst.search(/[0-9]{1,2}/));
   }
   else if (strLast === "uk" || strLast === "us" || strLast === "com")
   {
      wsSName = strLast + strFirst.substr(strFirst.search(/[0-9]{1,2}/));
   }
   else if (strLast === "cl" && strLast === "mx")
   {
      wsSName = strLast + strFirst.substr(strFirst.search(/[0-9]{1,2}/));
   }
   else if (strLast === "asia")
   {
      wsSName = "th" + strFirst.substr(strFirst.search(/[0-9]{1,2}/));
   }
   else if (strFirst[0] === "x")
   {
      wsSName = strLast + strFirst;
   }
   else if (strLast === TB3O.lng)
   {
      //all other normal servers
      wsSName = strLast + strFirst.substr(strFirst.search(/[0-9]{1,2}/));
   }
}

//////////////////////////////////////////////////////////////////////
function getUrlTravianReports(site) 
{ 
   var ttblangTR = TB3O.lng;
   switch ( TB3O.lng )
   {
      case "au":
      case "us":
         ttblangTR = "us";
         break;
      case "uk":
      case "en":
         ttblangTR = "uk";
         break;
   }

   return site + "/" + ttblangTR + "/"; 
}

//////////////////////////////////////////////////////////////////////
// strType "user" | "ally" | "server"
function getUrlTravianBox(site, strType, id) 
{
   var url;

   if ( strType === "server" ) 
   { 
      url = site + "/stats/server/" + wsSName;
   }
   else if ( strType === "user" )        
   { 
      url = site + "/stats/player/"   + wsSName + "/id/" + id;
   }
   else if ( strType === "ally" )
   { 
      url = site + "/stats/alliance/" + wsSName + "/id/" + id;
   }
   return url;
}

//////////////////////////////////////////////////////////////////////
function getUrlGetterTools(site, strType, id) 
{
   var url, aT, worldId = trimBlanks(TBO_GT_WORLD_ID);

   url = site + '/' + TB3O.fullServerName;
   if ( worldId !== '' ) { url += '.' + worldId; }
   url += '/';
   if ( strType === "user" )      { aT = "Player"; }
   else if ( strType === "ally" ) { aT = "Alliance"; }
   if ( aT )
   {
      url += aT + '/' + id + '-';
   }
   return url;
}

//////////////////////////////////////////////////////////////////////
function getUrlTravianUtils(site, strType, id) 
{
   var url, aT;

   url = site + "/?s=" + wsSName;

   if ( strType === "user" )      { aT = "idu="; }
   else if ( strType === "ally" ) { aT = "ida="; }

   if ( aT )
   {
      url += "&" + aT + id;
   }

   return url;
}

//////////////////////////////////////////////////////////////////////
function getUrlWorldAnalyser(site, strType, id) 
{
   var url, aT;

   if ( getUrlWorldAnalyser.lang === undefined )
   {
      getUrlWorldAnalyser.lang = normalizeLangCode(arAvLang[TBO_SCRIPT_LANG]);
   }

   url = site + "?lang=" + getUrlWorldAnalyser.lang + "&s=" + wsSName;

   if ( strType === "user" )      { aT = "uid="; }
   else if ( strType === "ally" ) { aT = "aid="; }

   if ( aT )
   {
      url += "&" + aT + id;
   }

   return url;
}

//////////////////////////////////////////////////////////////////////
function getUrlTravianLive(site, strType, id) 
{
   var url, aT, page = "info.html";

   if ( getUrlTravianLive.lang === undefined )
   {
      getUrlTravianLive.lang = normalizeLangCode(arAvLang[TBO_SCRIPT_LANG]);
   }

   if ( strType === "user" )        { aT = "t=player&v=" + id; }
   else if ( strType === "ally" )   { aT = "t=alliance&v=" + id; }
   else if ( strType === "server" ) { aT = "t=server"; page = "view.html"; }

   url = site + "/" + page + "?language=" + getUrlTravianLive.lang + "&s=" + TB3O.fullServerName + "&" + aT;

   return url;
}

//////////////////////////////////////////////////////////////////////
function getUrlTravmap(site, strType, id) 
{
   var url, aT;

   if ( getUrlTravmap.lang === undefined )
   {
      getUrlTravmap.lang = normalizeLangCode(arAvLang[TBO_SCRIPT_LANG]);
   }

   url = site;

   if (strType !== "server") { url += "map.php"; }
   url += "?lang=" + getUrlTravmap.lang + "&server=" + TB3O.fullServerName;

   if (strType === "user")      { aT = "player=id:"; }
   else if (strType === "ally") { aT = "alliance=id:"; }

   if ( aT )
   {
      url += "&" + aT + id + "&groupby=player&casen=on&format=svg&azoom=on";
   }

   return url;
} 

//////////////////////////////////////////////////////////////////////
/*
      //map server name & analyser server (wsSName)
      var crtServerX = crtUrl.host.split(".");
      var strFirst = crtServerX[0];
      TB3O.FmapServer = strFirst;

   TB3O.FmapLanguage = TB3O.lng;
   if ( TB3O.lng === "uk" || TB3O.lng === "us" ) { TB3O.FmapLanguage = "en"; }
   else if ( TB3O.lng === "ar" && strLast === "mx" ) { TB3O.FmapLanguage = "es"; }


function getUrlFlashmap(site, strType, id) 
{
   var url, aT;
   url = site + TB3O.FmapLanguage + "/" + TB3O.FmapServer + "/";

   if (strType === "user")      { url += "players/" + strName; }
   else if (strType === "ally") { url += "clans/" + strName; }

   return url;
} 
*/
