//////////////////////////////////////////////////////////////////////
function savePlayerInfo()
{
   __ENTER__
   savePersistentUserObject('UserInfo', TB3O.U);
   __EXIT__
}

/////////////////////////////////////////////////////////////////////
function saveCapitalInfo(mapId, name)
{
   if ( isIntValid(mapId) )
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
   __DUMP__(TBU_CAPITAL_ID,TBU_CAPITAL_MAPID,TBU_CAPITAL_NAME,TBU_CAPITAL_XY)
   savePlayerInfo();
}

/////////////////////////////////////////////////////////////////////
function setPlayerName(aUN)
{
   if ( isStrValid(aUN) )
   {
      TBU_NAME = aUN;
      __DUMP__(TBU_NAME)
      savePlayerInfo();
   }
}

/////////////////////////////////////////////////////////////////////
function setRaceLocalName(name)
{
   if ( isStrValid(name) )
   {
      TBU_RACE_LOCAL = name;
      __DUMP__(TBU_RACE_LOCAL)
      savePlayerInfo();
   }
}

/////////////////////////////////////////////////////////////////////
function setRace(race)
{
   if ( isStrValid(race) )
   {
      if ( TB3O.AvailableRaces.indexOf(race) !== -1 )
      {
         TBU_RACE = race;
         TBU_RACE_DELTA = getBaseTroopIndexForRace(race) 
         __DUMP__(TBU_RACE,TBU_RACE_DELTA)
         savePlayerInfo();
      }
      else
      {
         __ERROR__("Unknown race: " + race)
      }
   }
}

/////////////////////////////////////////////////////////////////////
function setRaceFromTroopIndex(tix)
{
   setRace(getRaceFromTroopIndex(tix));
}

//////////////////////////////////////////////////////////////////////
function loadPlayerInfo()
{
   __ENTER__

   var bResult = true;
   var bFirstTry = false;

   var aTB3U = loadPersistentUserObject('UserInfo');
   if ( aTB3U.length !== TB3O.U.length )
   {
      bFirstTry = true;
      savePlayerInfo();
   }
   else 
   {
      TB3O.U = aTB3U;
   }

   __DUMP__(TB3O.U)

   if ( TBU_RACE === '' ) 
   {
      var race = getRace();

      setRace(race);

      if ( TBU_RACE === '' && bFirstTry && !TB3O.ServerInfo.features.path_to_pandora ) 
      {
         getRaceFromBarracks();
         bResult = false;
      }
   }

   // user information is critical
   // for first run just shedule required ajax requests and stop normal execution
   if ( TBU_NAME === '' || TBU_RACE_LOCAL === '' || TBU_CAPITAL_NAME === '' || TBU_CAPITAL_MAPID === '' || TBU_CAPITAL_XY === '' ) 
   {
      ajaxLoadDocument(spLnk, getCommonPlayerProfileInfo);
      bResult = false;
   }

   __EXIT__

   return bResult;
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

