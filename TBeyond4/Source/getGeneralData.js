/////////////////////////////////////////////////////////////////////
function adaptDataToGameVersion()
{
   // new aproach, gIc obsolete
   if ( !I.images_attributes ) { I.images_attributes = {}; }
   var iC = I.images_attributes;

   iC["clock"] = [['class','clock'], ['src',xGIF]];
   iC["bau"]   = [['class','bau'], ['src',image["bau"]]];

   // old aproach, obsolete
   gIc["r1"] = '<img class="r1" src="' + xGIF + '" title="' + T('RES1') + '" alt="' + T('RES1') + '">';
   gIc["r2"] = '<img class="r2" src="' + xGIF + '" title="' + T('RES2') + '" alt="' + T('RES2') + '">';
   gIc["r3"] = '<img class="r3" src="' + xGIF + '" title="' + T('RES3') + '" alt="' + T('RES3') + '">';
   gIc["r4"] = '<img class="r4" src="' + xGIF + '" title="' + T('RES4') + '" alt="' + T('RES4') + '">';
   gIc["r41"]= '<img class="r4" src="' + xGIF + '" title="' + T('SENDRES') + '" alt="' + T('SENDRES') + '">';
   gIc["r5"] = '<img class="r5" src="' + xGIF + '" title="' + T('RES5') + '" alt="' + T('RES5') + '">';
   gIc["clock"] = '<img class="clock" src="' + xGIF + '">';
   gIc["capacity"] = '<img class="carry full" src="' + xGIF + '">';
   gIc["hero"] = '<img class="unit uhero" src="' + xGIF + '">';
   gIc["def_i"] = '<img class="def_i" src="' + xGIF + '">';
   gIc["def_c"] = '<img class="def_c" src="' + xGIF + '">';
   gIc["def1"] = '<img class="def1" src="' + xGIF + '">';
   gIc["def1_1"] = '<img class="def1" src="' + xGIF + '" title="' + T('AT2') + '" alt="' + T('AT2') + '">';
   gIc["def2"] = '<img class="def2" src="' + xGIF + '">';
   gIc["def3"] = '<img class="def3" src="' + xGIF + '">';
   gIc["att_all"] = '<img class="att_all" src="' + xGIF + '">';
   gIc["att_all_1"] = '<img class="att_all" src="' + xGIF + '" title="' + T('AT3') + '" alt="' + T('AT3') + '">';
   gIc["att_all_2"] = '<img class="att_all" src="' + xGIF + '" title="' + T('AT4') + '" alt="' + T('AT4') + '">';
   gIc["att1"] = '<img class="att1" src="' + xGIF + '">';
   gIc["att2"] = '<img class="att2" src="' + xGIF + '">';

   iC["attacks"] = [['class','tbiAttacks'], ['src',xGIF]];

   iC["hero_on_adventure"] = [['class','hero_on_adventure'], ['src',xGIF]];

   gIc["del"] = '<img class="del" src="' + xGIF + '" title="' + T('DEL') + '" alt="' + T('DEL') + '">';

   iC["messageStatusRead"] = [['class','messageStatus messageStatusRead'], ['src',xGIF]];
   iC["iReport1"] = [['class','iReport iReport1'], ['src',xGIF]];
   iC["iReport2"] = [['class','iReport iReport2'], ['src',xGIF]];
   iC["iReport3"] = [['class','iReport iReport3'], ['src',xGIF]];
   iC["iReport4"] = [['class','iReport iReport4'], ['src',xGIF]];
   iC["iReport5"] = [['class','iReport iReport5'], ['src',xGIF]];
   iC["iReport6"] = [['class','iReport iReport6'], ['src',xGIF]];
   iC["iReport7"] = [['class','iReport iReport7'], ['src',xGIF]];
   iC["iReport8"] = [['class','iReport iReport8'], ['src',xGIF]];
   iC["iReport11"]= [['class','iReport iReport11'],['src',xGIF]];
   iC["iReport12"]= [['class','iReport iReport12'],['src',xGIF]];
   iC["iReport13"]= [['class','iReport iReport13'],['src',xGIF]];
   iC["iReport14"]= [['class','iReport iReport14'],['src',xGIF]];
   iC["iReport17"]= [['class','iReport iReport17'],['src',xGIF]];
   iC["iReport21"]= [['class','iReport iReport21'],['src',xGIF]];

   for (var xi = 1; xi < 6; xi++) 
   {
      gIc["b" + xi] = xGIF;
      iC["b" + xi] = [['class','online' + xi], ['src',xGIF]];
   }

   for ( var i in uc )
   {
      gIc["u" + i] = xGIF;
      iC["u" + i] = [['class','unit u' + i], ['src',xGIF]];
   }
   iC["uhero"] = [['class','unit uhero'], ['src',xGIF]];

   iC["mr1"] = [['class','tbiMr1'], ['src',xGIF]];
   iC["mr2"] = [['class','tbiMr2'], ['src',xGIF]];
   iC["mr3"] = [['class','tbiMr3'], ['src',xGIF]];
   iC["mr4"] = [['class','tbiMr4'], ['src',xGIF]];

   gIc["merchant"]  = '<img src="' + image["merchant"] + '">';
   iC["merchant"] = [['class','tbiMerc'], ['src',xGIF]];
   iC["cp"] = [['class','tbiCP'], ['title',T('CPPERDAY')], ['src',xGIF]];
   iC["hourglass"] = [['class','tbiHourglass'], ['src',xGIF]];
   iC["centermap"] = [['class','tbiCentermap'], ['src',xGIF]];
   iC["iv"] = [['class','tbiIV'], ['src',xGIF]];
   iC["ov"] = [['class','tbiOV'], ['src',xGIF]];
   iC["dup"]= [['class','tbiDup'], ['src',xGIF]];

   iC["arrow_up8"] = [['src',image["aup"]],['width','8px']];
   iC["arrow_down8"] = [['src',image["adn"]],['width','8px']];

   iC["ratio"] = [['src',image["ratio"]], ['title',T("MTR")]];
}

/////////////////////////////////////////////////////////////////////
function detectTravianVersion()
{
   function getMod()
   {
      var aLink,i,mod;
      var extLinks = document.getElementsByTagName("link");
      for ( i = 0; i < extLinks.length; i++ )
      {
         aLink = extLinks[i];
         if ( aLink.rel === "stylesheet" && aLink.href.search(/gpack\/.*_([a-zA-Z]+)\/lang/) !== -1 )
         {
            mod = RegExp.$1;
            break;
         }
      }
      return mod;
   }

   var serverInfo;

   if ( $g(ID_HEADER) && $g(ID_CONTENT) ) 
   {
      if ( $g(ID_MID) && $g(ID_SIDE_INFO) ) 
      {
         serverInfo = { "version":4.0, "mod": getMod(), "features" : {new_link_style: true} };
      }
      else
      {
         ID_MID = "center";
         ID_SIDE_INFO = "sidebarAfterContent";
         if ( $g(ID_MID) && $g(ID_SIDE_INFO) ) 
         {
            serverInfo = { "version":4.2, "mod": getMod(), "features" : {new_link_style: true} };
         }
      }
   }

   if ( serverInfo )
   {
      try 
      {
         serverInfo.speed = window.wrappedJSObject.Travian.Game.speed;
      } 
      catch(e) 
      {
         __DUMP__(e)
      }
   }


   return serverInfo;
}

/////////////////////////////////////////////////////////////////////
//Get general information
function getGeneralData()
{
   var bResult = false; 
   var bFirstRun = false; 

   __ENTER__

   do 
   {
      //game version
      TB3O.ServerInfo = detectTravianVersion();
      __DUMP__(TB3O.ServerInfo)
      if ( !TB3O.ServerInfo ) { break; }

      //Path to the graphic pack (if available)
      //empty graphics set support added
      var cssDeclaration = $xf("//link[starts-with(@href, 'file') and @rel='stylesheet']");
      if (cssDeclaration)
      {
         var csshr = cssDeclaration.href;
         csshr.search(/^file:\/\/[^\/]*\/(.*\/)?(.*)\.css/);
         TB3O.localGP = RegExp.$1;
         TB3O.localGP = 'file://' + TB3O.localGP;
      }

      xGIF = (TB3O.localGP != '' ? img("a/x.gif") : "img/x.gif");

      TB3O.iLayoutMinWidth = parseInt10(window.getComputedStyle($g(ID_MID),null).getPropertyValue("min-width"));

      getLanguageAndPlusStatus();

      TB3O.UserID = getPlayerId(document);
      __DUMP__(TB3O.UserID)
      if ( !TB3O.UserID ) { break; }

      spLnk = 'spieler.php?uid=' + TB3O.UserID;

      getCrtServer();

      // must be called AFTER userId and server detection
      bFirstRun = !loadTBOptions();
      M4_DEBUG(TB3O.O[69]=9;)

      if ( bFirstRun ) 
      {
         ajaxLoadDocument("statistiken.php", getStatisticsMenu, setDefaultStatisticsMenu);
      }

      TB3O.serverTime = getServerTime(document);
      if ( !TB3O.serverTime ) { break; }
      __DUMP__(TB3O.serverTime, TB3O.localTimeOffset, TB3O.desiredTimeOffset)
      __DUMP__(getServerTimeNow(),getDesiredTimeNow())

      //get user information
      if ( !loadPlayerInfo() ) { break; }

      TB3O.lng = getServerLanguage();
      __DUMP__(TB3O.lng)

      TB3O.nServerType = getServerType();
      __DUMP__(TB3O.nServerType)

      getResourcesTitles();

      getwsSName();


      //set the script language
      TBO_SCRIPT_LANG = parseInt10(TBO_SCRIPT_LANG);

      if ( !isIntValid(TBO_SCRIPT_LANG) || TBO_SCRIPT_LANG <= 0 || TBO_SCRIPT_LANG >= arAvLang.length )
      {
         var iLx = 0;
         var iLx_en = 0;
         var xi = 1;
         while ( iLx === 0 && xi < arAvLang.length )
         {
            if (arAvLang[xi] === 'en')
            {
               iLx_en = xi;
            }
            if (arAvLang[xi] === TB3O.lng)
            {
               iLx = xi;
            }
            xi += 1;
         }
         TBO_SCRIPT_LANG = ( iLx ) ? iLx : iLx_en;
      }

      __DUMP__(arAvLang[TBO_SCRIPT_LANG]);

      switchLanguage(arAvLang[TBO_SCRIPT_LANG]);
      repairLanguage();
      T.loadLocalization();

      adaptDataToGameVersion();

      if ( crtUrl.path !== "/berichte.php" )
      {
         clearReportDeletingState();
         clearReportSearchingState();
      }

      bResult = true; 
   } while (0);

   __EXIT__
   return bResult;
}
