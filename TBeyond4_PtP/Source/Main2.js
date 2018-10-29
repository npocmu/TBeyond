//////////////////////////////////////////////////////////////////////
// do additional filtering of unsupported pages
function isExcludedPage()
{
   var bExclude = false;
   var i,e;

   // old versions of game
   var excludedId = ['sright','side_navi','sleft','ltop1','ltop5','lleft','lmidall','lmid2','lright1','lmid1'];
   for ( i = 0; i < excludedId.length; ++i )
   {
      if ( $g(excludedId[i]) )  { bExclude = true; break; }
   }

   if ( !bExclude )
   {
      e = $g("content");
      if ( e && hasClass(e,"login") )
      {
         bExclude = true;
      }
      else
      {
         e = $g("side_info");
         if ( e && hasClass(e,"outgame") )
         {
            bExclude = true;
         }
      }
   }
   
   M4_DEBUG({{
   if ( bExclude ) 
   {
      $log(1,"Can't process this page, additional exclude rule triggered");
   }

   }})
   return bExclude;
}

//////////////////////////////////////////////////////////////////////
function doPage()
{
   //===============================================================================
   //General actions
   setDefLang();
   if ( getGeneralData() )
   {
      var buildGID;
      var fullScreenMap = (crtUrl.path === "/karte.php" && crtUrl.queryKey.fullscreen === "1" );

      TB3O.VillagesInfo = loadVillagesInfo();

      //===============================================================================
      // Page detection and scanning
      //===============================================================================
      if ( crtUrl.path === "/spieler.php" ) 
      {
         processPlayerProfile();
      }

      if ( crtUrl.path !== "/messages.php" )
      {
         var aI = $xf("//input[@type!='hidden']");
         if (aI) { aI.focus(); }
      } //PepiX

      if ( crtUrl.path === "/statistiken.php" ) 
      {
         getStatisticsMenu();
         TB3O.pageSelector = "stat";
      }

      toJSvoid();

      TB3O.VillagesList = getVillagesList();
      __ASSERT__( TB3O.VillagesList.vTable, "Can't parse list of villages" )

      TB3O.VillagesCount = TB3O.VillagesList.vCount;
      TB3O.ActiveVillageId = TB3O.VillagesList.vActiveId;
      TB3O.ActiveVillageInfo = TB3O.VillagesInfo[TB3O.ActiveVillageId];
      TB3O.xCrt = TB3O.ActiveVillageInfo.x;
      TB3O.yCrt = TB3O.ActiveVillageInfo.y;
      TB3O.ActiveVillageMapId = xy2id(TB3O.ActiveVillageInfo.x,TB3O.ActiveVillageInfo.y);
      __DUMP__(TB3O.ActiveVillageId, TB3O.ActiveVillageMapId, TB3O.xCrt, TB3O.yCrt)

      if ( TBU_CAPITAL_MAPID !== "" && TBU_CAPITAL_ID === "" )
      {
         getCapitalId();
      }

      //getCrtLocation();

      /*
      if ( crtUrl.path !== "/karte.php" )
      {
         TB3O.boolIsNPCExluded = isThisNPCexcluded();
         if ( TB3O.boolIsThisNPC ) fillinNPCfields(urlNow);
      }
      */

      setVillageRes(TB3O.ActiveVillageId,document,toTimeStamp(TB3O.serverTime));


      if ( TB3O.pageSelector === "" && crtUrl.path === "/dorf1.php" )
      {
         processDorf1();
      } 
      else if ( TB3O.pageSelector === "" && 
                (crtUrl.path === "/dorf2.php" || 
                  (crtUrl.path === "/build.php" && $g("village_map"))) ) 
      {
         processDorf2();
      }
      else if ( TB3O.pageSelector === "" && crtUrl.path === "/dorf3.php" && !crtUrl.queryKey.hasOwnProperty("su") ) 
      {
         processDorf3();
      }
      else if ( TB3O.pageSelector === "" && crtUrl.path === "/position_details.php") 
      {
         processPositionDetails();
      }
      else if ( TB3O.pageSelector === "" && crtUrl.path === "/berichte.php" ) 
      {
         TB3O.pageSelector = ( crtUrl.queryKey.hasOwnProperty("id") && !crtUrl.queryKey.hasOwnProperty("toggleState") ) ? 
            "report_view" : "report_list";
      }
      else if ( TB3O.pageSelector === "" && crtUrl.path === "/messages.php" ) 
      {
         TB3O.pageSelector = ( crtUrl.queryKey.hasOwnProperty("id") && !crtUrl.queryKey.hasOwnProperty("toggleState") ) ? 
            "message_view" : "message_list";
         if ( crtUrl.queryKey.t === "1" ) { TB3O.pageSelector = "message_post"; }
      }
      else if ( TB3O.pageSelector === "profile_my" ) 
      {
         processMyProfile();
      }
      else if ( TB3O.pageSelector === "" && crtUrl.path === "/allianz.php" )
      {
         if ( !crtUrl.queryKey.s )
         {
            TB3O.pageSelector = "profile_alliance";
         }
         else if ( crtUrl.queryKey.s === "2" )
         {
            TB3O.pageSelector = "alliance_forum";
         }
      }
      else if ( TB3O.pageSelector === "" && crtUrl.path === "/karte.php" && 
                (crtUrl.queryKey.d === undefined  || crtUrl.queryKey.z !== undefined ) )
      {
         TB3O.pageSelector = "map";
      }
      else if ( TB3O.pageSelector === "" && crtUrl.path === "/build.php" )
      {
         var buildNode = $g("build");
         if ( buildNode )
         {
            // if buildSubMenu present then this is bulding new style layout since Dinah mod
            var buildSubMenu = searchAndParseSubMenu();
            var buildActiveUrl = buildSubMenu ? parseUri(buildSubMenu.items[buildSubMenu.active][1]) : crtUrl;

            buildGID = scanIntWithPrefix("gid", buildNode.className);
            __DUMP__(buildGID)

            processBuilding(buildGID);

            if ( buildGID === GID_RALLY_POINT )
            {
               if ( buildSubMenu )
               {
                  TB3O.pageSelector = ifEqual ( buildActiveUrl.queryKey.tt, "1","rally_point_overview",
                                                                            "2","rally_point_send",
                                                                           "99","rally_point_club", "");
                  if ( TB3O.pageSelector === "rally_point_send" && crtUrl.queryKey.hasOwnProperty("d") ) { TB3O.pageSelector = "rally_point_dismiss"; }
               }

               switch ( TB3O.pageSelector ) 
               {
                  case "rally_point_overview":  processRallyPointOverview(); break;
               }
            }
            else if ( buildGID === GID_MARKETPLACE && detectMarketPage() )
            {
               switch ( TB3O.pageSelector ) 
               {
                  case "market_routes": processMarketRoutes(); break;
                  case "market_routes_edit": processMarketRoutesEdit(); break;
                  case "market_send":   processMarketSend();   break;
                  case "market_offer":  processMarketOffer();  break;
               }
            }
            else if ( (buildGID === GID_RESIDENCE || buildGID === GID_PALACE) && buildActiveUrl.queryKey.s === "2" )
            {
               processCultureTab();
            }
            else if ( buildGID === GID_TOWNHALL )
            {
               processTownHall();
            }
            else if ( buildGID === GID_SMITHY )
            {
               processUpgradeBuilding(buildGID);
            }

            if ( canBuildingTrainUnits(buildGID) )
            {
               // Note: in residence/palace training stop after number of units,
               // therefore common check not worked
               TB3O.isTtB = ((buildGID === GID_RESIDENCE || buildGID === GID_PALACE) && buildActiveUrl.queryKey.s === "1") ||
                            isThisTrainingBuilding();
               if ( TB3O.isTtB )
               {
                  processTrainingBuilding(buildGID);
               }
            }
         }
      }

      //===============================================================================
      //    Data processing section
      //===============================================================================
      reconcileVillagesInfo(TB3O.VillagesInfo);
      TB3O.ResInfoTotals = getResInfoTotals();

      TB3O.bIsNPCInVillage = getNPCAvailability(TB3O.ActiveVillageId);


      //===============================================================================
      //    Page modification section
      //===============================================================================
      setTravianStyles();
      setTBStyles()

      if ( TB3O.VillagesList )
      {
         uiModifyVillagesList();
      }

      if ( !fullScreenMap )
      {
         hideAd();
         uiModifySideBars();
         uiModifyBigIconsBar();
         if ( TB3O.VillagesList ) { TB3O.VillagesList2 = uiCreate2ndVillageListWidget(); }
         uiCreateResBarWidget();
         showUserBookmarks();
         showNoteBlock();
         uiCreateSearchBarWidget();
      }

      if ( crtUrl.path === "/build.php" )
      {
         uiModifyContracts();
      }

      if ( TB3O.isTtB )
      {
         uiModifyTrainingBuilding(buildGID);
      }

      //if ( !TB3O.boolIsNPCExluded ) { NPCUpdate(); }
      //if (isPostNPC()) insertNPCHistoryLink();

      /*
      if (crtUrl.path === "/warsim.php" ) 
      {
         fillinwarsim();
      }
      */

      __DUMP__(TB3O.pageSelector, TB3O.xCrt, TB3O.yCrt)

      switch ( TB3O.pageSelector )
      {
         case "dorf1":  uiModifyDorf1();  break;
         case "dorf2":  uiModifyDorf2();  break;
         case "dorf3":  uiModifyDorf3();  break;

         case "position_details":
            uiModifyPositionDetails(); 
            break;

         case "market_routes": uiModifyMarketRoutes(); break;
         case "market_routes_edit": uiModifyMarketRoutesEdit(); break;
         case "market_send":   uiModifyMarketSend(); break;
         case "market_offer":  uiModifyMarketOffer(); break;

         case "market_buy": 
               //addAllyColumnForMarketOffers();
               //marketBuy();
            break;

         case "report_list": 
         case "message_list": 
            uiModifyMsgRptList();
            break;

         case "report_view": 
            uiModifyRptView();
            break;

         case "message_view": 
            uiModifyMsgView();
            break;

         case "message_post": 
            uiModifyMsgPost();
            break;

         case "profile_my": 
         case "profile_other": 
            uiModifyPlayerProfile(); 
            break;

         case "profile_alliance":    uiModifyAllianceProfile(); break;
         case "alliance_forum":      uiModifyAllianceForum();   break;

         case "map":                 uiModifyMap();             break;
         case "culture":             uiModifyCultureTab();      break;
         case "stat":                uiAddKeyboardNavigation(); break;

         case "rally_point_overview":
            if ( crtUrl.queryKey.filter > 0 ) { uiAddKeyboardNavigation(); }
            /*
            tableTotalVillageTroopsV3();
            incomeAttackingFillter();
            */
            uiModifyRallyPointOverview()
            break;

         case "rally_point_send":    uiModifyRallyPointSend();    break;
         case "rally_point_dismiss": uiModifyRallyPointDismiss(); break;
      }

      saveVillagesInfo(TB3O.VillagesInfo);

      // General actions continued
      if ( TB3O.pageSelector !== "market_buy" )
      {
         var bAddAttSendResLinks = false;
         var bAddCoordAndDistTT = false;

         if ( TB3O.pageSelector === "rally_point_overview" )
         {
            if ( TBO_SHOW_TROOP_INFO_TOOLTIPS_RP === "1" ) { uiAddTroopInfoTooltips(document); }
            bAddAttSendResLinks = ( TBO_SHOW_SEND_TROOPS_RESOURCES_RP === "1" );
            bAddCoordAndDistTT =  ( TBO_SHOW_DIST_TOOLTIPS_RP === "1" );
         } 
         else 
         {
            if ( TBO_SHOW_TROOP_INFO_TOOLTIPS === "1" ) { uiAddTroopInfoTooltips(document); }
            bAddAttSendResLinks = ( TBO_SHOW_SEND_TROOPS_RESOURCES === "1" && crtUrl.path !== "/hero_adventure.php"
                                                                           && TB3O.pageSelector !== "position_details" );
            bAddCoordAndDistTT =  ( TBO_SHOW_DIST_TOOLTIPS === "1" && (isSomeOf(crtUrl.path,"/spieler.php","/cropfinder.php","/cropfinder.php","/statistiken.php","/hero_adventure.php") ||
                                                                       TB3O.pageSelector.indexOf("market_send") === 0 ||
                                                                       (TB3O.pageSelector === "report_list" && crtUrl.queryKey.t === "5") || 
                                                                       isSomeOf(TB3O.pageSelector, "rally_point_dismiss", "message_view", "report_view")));
         }
         uiModifyLinks($g(ID_CONTENT),
                       {add_send_troops:bAddAttSendResLinks, 
                        add_send_troops2: isSomeOf(TB3O.pageSelector, "message_view"),
                        add_coord_dist_tip:bAddCoordAndDistTT,
                        add_center_map:isSomeOf(TB3O.pageSelector, "rally_point_club")});
      }

      if ("onhashchange" in window)
      {
         window.addEventListener("hashchange", 
            function (e) 
            {
               __DUMP__("onhashchange",window.location.href)
               crtUrl = parseUri(window.location.href);
               if ( TB3O.onHashChange ) { TB3O.onHashChange(); }
            }, false);
      }

      if ( !fullScreenMap )
      {
         setTimers();
         showTBTotalRuntime();
      }
   }
}
