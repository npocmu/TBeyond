//////////////////////////////////////////////////////////////////////
// hint for avoid Greasemonkey access violation
function saveVillagesInfoProxy()
{
   setTimeout(function() { saveVillagesInfo(TB3O.VillagesInfo)}, 0);
}

//////////////////////////////////////////////////////////////////////
function refreshSupplement(villageId)
{
   if ( TB3O.VillagesList )  { TB3O.VillagesList.uiRefreshVillage(villageId); }
   if ( TB3O.VillagesList2 ) { TB3O.VillagesList2.uiRefreshVillage(villageId); }

   if ( villageId == TB3O.ActiveVillageId ) 
   {  
      // refresh other UI
      TB3O.ResInfoTotals = getResInfoTotals();
      uiUpdateResBarWidget();
   }
}

//////////////////////////////////////////////////////////////////////
function generalAjaxRefreshHandler(villageId, tabNo, specific_handler, xhr_doc)
{
   var ttServer = toTimeStamp(getServerTime(xhr_doc));
   var bSuccess = ( ttServer && setVillageRes(villageId, xhr_doc, ttServer) && 
                     specific_handler(tabNo, villageId, xhr_doc, ttServer) );

   if ( bSuccess )
   {
      saveVillagesInfoProxy();
      refreshSupplement(villageId);
   }

   return bSuccess;
}

//////////////////////////////////////////////////////////////////////
function sheduleVillageRefresh(villageId,tabNo,timeOut)
{
   setTimeout(bind(refreshVillageV2,[villageId,tabNo]), timeOut);
   timeOut += getRndTime(999);

   return timeOut;
}

//////////////////////////////////////////////////////////////////////
function onRefreshAllVillages(tabNo)
{
   var i, randIds, villageId, aTimeOut = 0;

   M4_NDEBUG({{
   if ( TB3O.Overview.plAc )
   {
      window.location.reload(false);
   }
   else}})
   {
      randIds = getVillagesOrder(TB3O.VillagesInfo,"random");

      for (i = 0; i < randIds.length; i++)
      {
         villageId = randIds[i];
         updD3Bullets(villageId, 5);
         aTimeOut = sheduleVillageRefresh(villageId, tabNo, aTimeOut);
      }
   }
}

//////////////////////////////////////////////////////////////////////
function onRefreshVillage(villageId, tabNo)
{
   sheduleVillageRefresh(villageId, tabNo, 0);
}

//////////////////////////////////////////////////////////////////////
function updD3Bullets(villageId, intVal)
{
   var aE = $g('aldea' + villageId + '_boton');

   if ( aE )
   {
      aE.className = "online" + intVal;
   }
}

//////////////////////////////////////////////////////////////////////
function refreshVillageV2(villageId, tabNo)
{
   __ENTER__
   updD3Bullets(villageId, 3);

   var villageInfo = TB3O.VillagesInfo[villageId];
   var fOnFailure = bind(updD3Bullets, [villageId, 4]);
   var baseBuildingUrl = "build.php?newdid=" + villageId;

   if ( tabNo === 1 )
   {
      ajaxLoadDocument("dorf1.php?newdid=" + villageId, gfOnSuccess(refreshD3Tb_Overview), fOnFailure);

      if ( TBO_DORF3_REFRESH_TROOPS_TRAINING === "1" )
      {
         function tryRefreshTrainingBuilding(gid,q)
         {
            if ( isBuildingPresent(villageId,gid) ) 
            {
               ajaxLoadDocument(baseBuildingUrl + "&gid=" + gid + ((q) ? q : ""), gfOnSuccess(refreshD3Tb_Training), fOnFailure);
            }
         }

         tryRefreshTrainingBuilding(GID_BARRACKS);
         tryRefreshTrainingBuilding(GID_STABLE);
         tryRefreshTrainingBuilding(GID_WORKSHOP);
         tryRefreshTrainingBuilding(GID_RESIDENCE,"&s=1");
         tryRefreshTrainingBuilding(GID_PALACE,"&s=1");
         tryRefreshTrainingBuilding(GID_COMMANDCENTER,"&s=1");
         tryRefreshTrainingBuilding(GID_GREAT_BARRACK);
         tryRefreshTrainingBuilding(GID_GREAT_STABLE);
         tryRefreshTrainingBuilding(GID_TRAPPER);
      }
   }
   else if ( tabNo === 2 || tabNo === 3 )
   {
      ajaxLoadDocument("dorf1.php?newdid=" + villageId, gfOnSuccess(refreshD3Tb_Resources), fOnFailure);
   }
   else if ( tabNo === 4 )
   {
      var cpbuilding = 0;
      if ( isBuildingPresent(villageId,GID_RESIDENCE) ) { cpbuilding = GID_RESIDENCE; }
      else if ( isBuildingPresent(villageId,GID_PALACE) ) { cpbuilding = GID_PALACE; }
      else if ( isBuildingPresent(villageId,GID_COMMANDCENTER) ) { cpbuilding = GID_COMMANDCENTER; }

      if ( cpbuilding )
      {
         var baseUrl = baseBuildingUrl + "&gid=" + cpbuilding;

         if ( TBO_DORF3_REFRESH_CP === "1" ) 
         {
            ajaxLoadDocument(baseUrl + "&s=2", gfOnSuccess(refreshD3Tb_CP), fOnFailure);
         }

         if ( TBO_DORF3_REFRESH_SLOTS === "1" ) 
         {
            ajaxLoadDocument(baseUrl + "&s=4", gfOnSuccess(refreshD3Tb_Slots), fOnFailure);
         }
      }
      else
      {
         updD3Bullets(villageId, 5);

         villageInfo.cpi.ttUpd = undefined;
         saveVillagesInfo(TB3O.VillagesInfo);
         updateD3Tb_CP(tabNo, villageId)

         var aCell = $g("aldea" + villageId + "_4_5");
         aCell.textContent = "?/0";

         refreshSupplement(villageId);
      }

      if ( TBO_DORF3_REFRESH_CELEBRATIONS === "1" ) 
      {
         if ( isBuildingPresent(villageId,GID_TOWNHALL) ) 
         { 
            ajaxLoadDocument(baseBuildingUrl + "&gid=GID_TOWNHALL", gfOnSuccess(refreshD3Tb_Celebrations), fOnFailure);
         }
      }

      if ( TBO_DORF3_REFRESH_TROOPS === "1" ) 
      {
         if ( isBuildingPresent(villageId,GID_RALLY_POINT) ) 
         { 
            ajaxLoadDocument(URL_RP_OVERVIEW(villageId) + "IF_TB3(&j&k)", gfOnSuccess(refreshD3Tb_Troops), fOnFailure);
         }
      }
   }
   else if ( tabNo === 5 ) 
   {
      if ( isBuildingPresent(villageId,GID_RALLY_POINT) ) 
      { 
         IIF_TB4(
         ajaxLoadDocument(URL_RP_OVERVIEW(villageId), bind2(onLoadRallyPoint,[villageId]), fOnFailure),
         ajaxLoadDocument(URL_RP_OVERVIEW(villageId) + "&j&k", gfOnSuccess(refreshD3Tb_Tab5), fOnFailure)
         );
      }
   }
   __EXIT__
   return;


   function gfOnSuccess(handler)
   {
      return function (xhr_doc)
             {
                if ( generalAjaxRefreshHandler(villageId, tabNo, handler, xhr_doc) )
                {
                   updD3Bullets(villageId, 2);
                }
                else
                {
                   updD3Bullets(villageId, 4);
                }
             }
   }
}

//////////////////////////////////////////////////////////////////////
// Used for updates info from refresh callbacks
function getDorf1Info(villageId, aDoc, ttServer)
{
   var bSuccess = getCommonDorf1Info(villageId, aDoc, ttServer);

   if ( bSuccess )
   {
      TB3O.ResInfoTotals = getResInfoTotals();
   }

   return bSuccess;
}

//////////////////////////////////////////////////////////////////////
function refreshD3Tb_Overview(tabNo, villageId, xhr_doc, ttServer)
{
   __ENTER__

   var bSuccess = getDorf1Info(villageId, xhr_doc, ttServer);

   if ( bSuccess )
   {
      fillD3TbRow_Tab1(villageId);
   }

   __EXIT__
   return bSuccess;
}

//////////////////////////////////////////////////////////////////////
function refreshD3Tb_Training(tabNo, villageId, xhr_doc, ttServer)
{
   __ENTER__
   var bSuccess = false;
   var buildNode = $g("build",xhr_doc);
   if ( buildNode )
   {
      var gid = scanIntWithPrefix("gid", buildNode.className);

      bSuccess = getCommonBuildingInfo(gid, villageId, xhr_doc) && getTrainingInfo(gid, villageId, xhr_doc, ttServer);

      if ( bSuccess )
      {
         fillD3TbRow_Tab1_Col4(villageId);
      }
   }

   __EXIT__
   return bSuccess;
}

//////////////////////////////////////////////////////////////////////
function refreshD3Tb_Resources(tabNo, villageId, xhr_doc, ttServer)
{
   __ENTER__

   var bSuccess = getDorf1Info(villageId, xhr_doc, ttServer);

   if ( bSuccess )
   {
      if ( tabNo === 2 )
      {
         fillD3TbRow_Tab2(villageId);
         fillD3TbTotals_Tab2();
      }
      else if ( tabNo === 3 )
      {
         fillD3TbRow_Tab3(villageId);
      }
   }

   __EXIT__
   return bSuccess;
}

//////////////////////////////////////////////////////////////////////
function updateD3Tb_CP(tabNo, villageId)
{
   fillD3TbRow_Tab4_Col2(villageId);
   fillD3TbTotals_Tab4_Col2();
}

//////////////////////////////////////////////////////////////////////
function refreshD3Tb_CP(tabNo, villageId, xhr_doc, ttServer)
{
   __ENTER__

   var bSuccess = getCultureTabInfo(villageId, xhr_doc, ttServer);
   if ( bSuccess )
   {
      updateD3Tb_CP(tabNo, villageId);
   }

   __EXIT__
   return bSuccess;
}

//////////////////////////////////////////////////////////////////////
function refreshD3Tb_Celebrations(tabNo, villageId, xhr_doc, ttServer)
{
   __ENTER__
   var bSuccess = getTownHallInfo(villageId, xhr_doc, ttServer);
   if ( bSuccess )
   {
      fillD3TbRow_Tab4_Col3(villageId);
   }

   __EXIT__
   return bSuccess;
}

//////////////////////////////////////////////////////////////////////
function refreshD3Tb_Troops(tabNo, villageId, xhr_doc, ttServer)
{
   __ENTER__

   var bSuccess = !!getRallyPointInfo(villageId, xhr_doc, ttServer, true);

   if ( bSuccess )
   {
      fillD3TbRow_Tab4_Col4(villageId);
      fillD3TbTotals_Tab4_Col4();
   }

   __EXIT__
   return bSuccess;
}

//////////////////////////////////////////////////////////////////////
function refreshD3Tb_Slots(tabNo, villageId, xhr_doc, ttServer)
{
   __ENTER__

   var bSuccess = true;

   __EXIT__
   return bSuccess;
}

//////////////////////////////////////////////////////////////////////
function refreshD3Tb_Tab5(tabNo, villageId, xhr_doc, ttServer)
{
   __ENTER__

   var bSuccess = !!getRallyPointInfo(villageId, xhr_doc, ttServer, true);

   if ( bSuccess )
   {
      fillD3TbRow_Tab5(villageId);
      fillD3TbTotals_Tab5();
   }

   __EXIT__
   return bSuccess;
}

/*

	function getdorf3SelectedVinfo(ad) {
		// newdid of the village
		vID = 0;
		retValue = [-1000, -1000];
		try {
			if (TB3O.T35 == false) {
				avLink = $xf("//a[@class='active_vl']", 'f', ad);
				newdid = getNewdidFromLink(avLink.href);
				aX = $xf('//a[@class="active_vl"]/../../td/table/tbody/tr/td', 'f', ad);
				if (aX) {
					X = parseInt10(aX.innerHTML.replace("(", ""));
					aY = $xf('//a[@class="active_vl"]/../../td/table/tbody/tr/td[3]', ad);
					if (aY) {Y = parseInt10(aY.innerHTML.replace(")", ""));vID = xy2id(X, Y);};
				};
			} else {
				if (TB3O.M35 == 2) {
					aV = $xf("//td[@class='dot hl']", 'f', ad);
					var tr = aV.parentNode;
					if (tr.cells.length > 3) {
						vx = tr.cells[2].textContent.replace("(", "");
						vy = tr.cells[4].textContent.replace(")", "");				
						newdid = getNewdidFromLink(tr.cells[1].firstChild.href);
					} else {
						var tmpC = tr.cells[2].textContent.replace("(", "").replace(")", "").split("|");
						vx = parseInt10(tmpC[0]);
						vy = parseInt10(tmpC[1]);
						newdid = getNewdidFromLink(tr.cells[1].firstChild.href);
					};
				} else if (TB3O.M35 == 1) {
					aV = $xf("//div[@id='vlist']//table[@class='vlist']//tr[@class='sel']//a", 'f', ad);
					vx = aV.parentNode.parentNode.cells[2].textContent.replace("(", "");
					vy = aV.parentNode.parentNode.cells[4].textContent.replace(")", "");
					newdid = getNewdidFromLink(aV.href);
				};
				vID = xy2id(vx, vy);
			};
		} catch(e) {newdid = actV.vNewdid; vID = actV.vID;};
		retValue[0] = vID;
		retValue[1] = newdid;
		return retValue;
	};

	function processVillage45(ajaxResp){
		var ad = ajaxNDV2(ajaxResp);
		var newdid = getdorf3SelectedVinfo(ad)[1];
		var lvl = 0;
		var maxSlots = 0;
		var bTitle = $xf("//div[@id='" + ID_MID2 + "']//h1", 'f', ad);
		if (bTitle) {var aLvl = bTitle.textContent.split(" "); lvl = parseInt10(aLvl[aLvl.length - 1]);};
		var cpbuilding = 0;
		var ocSlots = 0;
		if (lvl != 0) {var spBcookie = getGMcookieV2("specBuildings"); if (spBcookie && spBcookie[newdid]) cpbuilding = spBcookie[newdid][0];};

		var maxSlots = 0;
		maxSlots = (cpbuilding == 26)?((lvl==20)?3:(lvl>=15)?2:(lvl>=10)?1:0):(lvl==20)?2:(lvl>=10)?1:0;

		var expTable = $xf("//div[@id='" + ID_MID2 + "']//table[@id='expansion'] | //div[@id='" + ID_MID2 + "']//table[@class='tbg']", 'f', ad);
		if (expTable) {
			var intRows = expTable.rows.length;
			var lrtd = expTable.rows[intRows-1].cells[0];
			var aColspan;
			ocSlots = intRows - 2;
			if (lrtd) aColspan = lrtd.getAttribute("colspan");
			if (aColspan) ocSlots = ocSlots - 1;
		};

		var slots = "" + ocSlots + "/" + maxSlots;

		var aCell = $xf("//td[@id='aldea" + newdid + "_4_5" + "']");
		var oldSlots = aCell.innerHTML;
		if (oldSlots != "-") oldSlots = oldSlots.split("/"); else oldSlots = ["0", "0"];

		aCell.innerHTML = slots;
		var sumCell = $xf("//td[@id='aldea_s_4_5']");
		if (sumCell) {
			var sumCellValue = sumCell.innerHTML.replace(",", "").replace(".", "").replace(" ", "").replace("&nbsp;", "");
			if (sumCellValue == "-") {sumCell.innerHTML = slots;} else {sumCell.innerHTML = (parseInt10(sumCellValue.split("/")[0]) + ocSlots - parseInt10(oldSlots[0])) + "/" + (parseInt10(sumCellValue.split("/")[1]) + maxSlots - parseInt10(oldSlots[1]));};
		};

		updD3Bullets(newdid, 2);
	};

*/