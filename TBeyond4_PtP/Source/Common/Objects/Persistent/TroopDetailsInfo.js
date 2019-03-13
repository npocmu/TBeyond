/////////////////////////////////////////////////////////////////////
// agregate info from rally point
function UnitsCountInfo()
{
   this.ut = fillArray(new Array(TG_UNITS_COUNT),0); // units count trained in village
   this.ttUpd = undefined; // date of information update (server timestamp when rally point last visited)

   return this;
}

/////////////////////////////////////////////////////////////////////
M4_ECHO_OFF/*                   DESCRIPTION

gr - Groups/state
   1 - Incoming troops
   2 - Outgoing troops
   3 - Troops in this village and its oases 
   4 - Troops in other villages or oases

cmd - command for troop 
                   Groups
   ATC_DEFEND      (1,2)
   ATC_ATTACK      (1,2)
   ATC_RAID        (1,2)
   ATC_SPY         (2)
   ATC_ADVENTURE   (2)
   ATC_SETTLE      (2)
   ATC_IMPRISON    (3,4)

cc    - crop consumption (only for groups 3,4)
rx    - race index of troop
h_id  - map id for troop host village
h_vn  - name of troop host village

o_id  - this village oasis map id

t_id  - map id for troop target village/oasis
t_vn  - name of troop target village

own_uid - player ID for owner of troop, 
own_un - owner name. Short codes:
   U - undefined - has not info about owner
   M - userid    - owner is current player
   O - userid    - owner is other player


                           POSSIBLE COMBINATION:
Legend Host/Target/Oasis:
   V - this village
   VO - this village oasis
   O - other village
   U - undefined - nature

Legend for Owner:
   U - undefined - has not info about owner
   M - userid    - owner is current player
   O - userid    - owner is other player


 Host Targ Oas Arrival Owner Gr   Comment
  V   VO    VO defined   U   1  a1) this village's troop is moving (Attack,Raid,Supply) to oasis belonging to this village
                                    Note: this records are always duplicates as a3) records
  V   VO       defined   U   2  a3) this village's troop is moving (Attack,Raid,Supply) to oasis belonging to this village
               
  V   O        defined   U   1  a4) (with booty) this village's troop is returning from other village/oasis 
                                a5) (no booty) this village's troop is returning from reinforcement
  V   O        defined   U   2  a6) this village's troop is moving (Attack,Raid,Supply) to other village/oasis 
               
  V   U        undefined M   3  c1) this village's troop in this village (first record, always present, only one record)
  V   U     VO undefined M   3  c2) this village's troop reinforce for oasis belonging to this village (many records)
                                    Note: this records are always duplicates as c3) records
  V   VO       undefined U   4  c3) this village's troop reinforce for oasis belonging to this village 
  V   O        undefined U   4  c4) this village's troop reinforce for other village/oasis
               
  O   V        defined   U   1  d1) other village's troop is moving (Attack,Raid,Supply) to this village
  O   VO    VO defined   U   1  d2) other village's troop is moving (Attack,Raid,Supply) to oasis belonging to this village
  O   U        undefined O   3  e1) other village's troop reinforce for this village
  O   U     VO undefined O   3  e2) other village's troop reinforce for oasis belonging to this village
               
? U   V        defined   U   1  nature is moving (Supply) to this village
  U   U        undefined U   3  nature reinforce this village

*/M4_ECHO_ON
function TroopDetailsInfo(hostMapId, hostVName, oasisMapId, targetMapId, targetVName, group, cmd, ownerId, ownerName, ttArrival, racex, units, cc, res)
{
   if ( res ) { this.Res = res; } // resources carrying 
   if ( ttArrival ) { this.ttArrival = ttArrival; } // server timestamp for troop arrival, undefined if troop in village now

   // host village 
   if ( isIntValid(hostMapId) ) 
   { 
      this.h_id = hostMapId; 
      this.h_vn = hostVName; 
   }

   // oasis map id
   if ( isIntValid(oasisMapId) ) { this.o_id = oasisMapId; }

   // target village map id
   if ( isIntValid(targetMapId) ) 
   { 
      this.t_id = targetMapId; 
      this.t_vn = targetVName;
   }

   this.gr = group;
   if ( cmd !== undefined )  { this.cmd = cmd; }

   // owner
   if ( ownerId )   
   { 
      this.own_uid = ownerId; 
      this.own_un = ownerName;
   }

   this.rx = racex;

   // units count in troop, array of TG_UNITS_COUNT integers
   // for enemy incoming troops, each cell can be only 0 or undefined
   this.u = units; 

   if ( isIntValid(cc) )  { this.cc = cc; }

   M4_DEBUG({{

   }})

   return this;
}

/////////////////////////////////////////////////////////////////////
function RallyPointInfo()
{
   this.t = []; // troop details
   this.grc = [0,0,0,0]; // count of troops in groups


   this.ttUpd = undefined; // date of information update (server timestamp when rally point last visited)

   return this;
}

/////////////////////////////////////////////////////////////////////
function walkRallyPointInfo(villageId, rallyPointInfo, filter, handler)
{
   var i, seqn = 0;
   var villageInfo = TB3O.VillagesInfo[villageId];
   var mapId = xy2id(villageInfo.x,villageInfo.y);
   if ( !filter ) { filter = {}; }

   for (i = 0; i < rallyPointInfo.t.length; ++i)
   {
      var info = cloneObject(rallyPointInfo.t[i]);

      if ( filter.group === undefined || filter.group === 0 || filter.group === info.gr )
      {
         if ( info.gr === 3 )
         {
            if ( info.h_id === mapId && info.o_id === undefined ) // own troops
            {
               info.h_vid = villageId;
            }
         }

         handler(seqn, info);
         ++seqn;
      }
   }
}

M4_DEBUG({{
/////////////////////////////////////////////////////////////////////
function getTroopDetailsInfoView(info) 
{
   function XY2Str(XY) { return formatCoords(XY[0],XY[1]); }

   var i,str = "";
   var dtNow = new Date();

   str += "g" + info.gr;
   str += " race:" + TB3O.KnownRaces[info.rx] + " " + JSON.stringify(info.u) + " ";

   if ( info.h_id !== undefined )
   {
      str += "Hosted at '" + info.h_vn + "'";
      str += XY2Str(id2xy(info.h_id));
   }
   else
   {
      str += "Nature";
   }

   if ( info.own_uid  )
   {
      str += " by player #" + info.own_uid + " '" + info.own_un + "'";
   }

   if ( info.o_id !== undefined )
   {
      str += " for oasis " + XY2Str(id2xy(info.o_id));
   }

   if ( info.t_id !== undefined  && info.ttArrival )
   {
      var strcmd = (info.cmd === undefined) ? '' : ['Def','Att','Raid','Spy','Adv','Settle','Prison'][info.cmd];
      str += " --" + strcmd + "--> ";
   }

   if ( info.t_id !== undefined )
   {
      str += "target '" + info.t_vn + "'" + XY2Str(id2xy(info.t_id));
   }

   if ( info.cc !== undefined )
   {
      str += " crop: " + info.cc;
   } 

   if ( info.Res )
   {
      str += " booty: [" + info.Res.toString() + "]";
   } 

   if ( info.ttArrival )
   {
      str += " arrival: " + formatDateTime(dtNow, info.ttArrival, 1);
   }

   return str;
}

/////////////////////////////////////////////////////////////////////
// Debug!!!
function getRallyPointInfoView(villageId, rallyPointInfo) 
{
   var i,str;
   var villageInfo = TB3O.VillagesInfo[villageId];

   str = "ttUpd = " + Date(rallyPointInfo.ttUpd) + "(" + rallyPointInfo.ttUpd + ")\n";
   str += "Total records = " + rallyPointInfo.t.length + "\n";
   str += "Groups count = " + rallyPointInfo.grc + "\n";
   for (i = 0; i < rallyPointInfo.t.length; ++i)
   {
      var info = rallyPointInfo.t[i];
      str += "[" + i + (info.id ? " #" + info.id : "") + "] ";
      str += getTroopDetailsInfoView(info);
      str += "\n";
   }
   return str;
}

//////////////////////////////////////////////////////////////////////
function exportRallyPointInfo(villageId, rallyPointInfo)
{
   var buffer = "";

   function dumpInfo(seqn, info)
   {
      if ( buffer ) { buffer += "\n"; }
      buffer += villageId + "|" + info.own_uid + "|" + info.h_id + "|" + info.cc + "|" + info.u[TG_UIDX_HERO];

      var basetix = getBaseTroopIndexForRace(TB3O.KnownRaces[info.rx]);
      var tix;
      for ( tix = 1; tix <= 30; ++tix )
      {
         var count = 0;
         var uix = tix - basetix;
         if ( uix >= 0 && uix < info.u.length && uix !== TG_UIDX_HERO)
         { 
            count = info.u[uix];
         }
         buffer += "|" + count;
      }
   }

   walkRallyPointInfo(villageId, rallyPointInfo, {group:3}, dumpInfo);
   var clientArea = uiCreateModalWindow();
   replaceChildren(clientArea,[
      $e('textarea',[['readonly','readonly'],['rows','20'],['cols','80']],buffer+"\n"),
      uiCreateTool_Close(uiHideModalWindow)
   ]);
   uiDisplayModalWindow(true);
}

//////////////////////////////////////////////////////////////////////
function exportRallyPointInfo2t4log(villageId, rallyPointInfo)
{
   var hidden  = ['type',"hidden"];
   var villageInfo = TB3O.VillagesInfo[villageId];
   var mapId = xy2id(villageInfo.x,villageInfo.y);

   function get_uls(info)
   {
      var uls = "";
      var tix = getBaseTroopIndexForRace(TB3O.KnownRaces[info.rx]);
      var uix;
      for ( uix=0; uix < info.u.length; ++uix )
      {
         if ( uix === TG_UIDX_HERO )
         { 
            uls += 'uhero'
         }
         else 
         {
            uls += 'u'+(tix+uix)+':';
         }
      }
      return uls;
   }

   function get_troops(info)
   {
      var troops = "";
      var uix;
      for ( uix=0; uix < info.u.length; ++uix )
      {
         var ucount = info.u[uix];
         troops += ''+ (( ucount !== undefined) ? ucount : '?') +':';
      }
      return troops;
   }


   function addFieldsToForm(form, name, info)
   {
      addChildren(form,[
         $i([hidden, ['name', name + '[cell_id]'],      ['value', info.h_id]] ),
         $i([hidden, ['name', name + '[village_name]'], ['value', info.h_vn]] ),
         $i([hidden, ['name', name + '[player_id]'],    ['value', info.own_uid]] ),
         $i([hidden, ['name', name + '[uls]'],          ['value', get_uls(info)]] ),
         $i([hidden, ['name', name + '[troops]'],       ['value', get_troops(info)]] ),
         $i([hidden, ['name', name + '[upkeep]'],       ['value', info.cc]] )
      ]);
      if ( info.hasOwnProperty("h_vid") )
      {
         form.appendChild($i([hidden, ['name', name + '[village_id]'],   ['value', info.h_vid]] ));
      }

   }


   var form = $e('form',[['method',"POST"],['action',"http://t4log.com/troops/villagetroops"],['target',"_blank"]]);

   var fcounter = 0, lcounter = 0, pcounter = 0;
   var i;
   for (i = 0; i < rallyPointInfo.t.length; ++i)
   {
      var info = cloneObject(rallyPointInfo.t[i]);

      if ( info.gr === 3 )
      {
         if ( info.h_id === mapId && info.o_id === undefined ) // own troops
         {
            info.h_vid = villageInfo.id;
            addFieldsToForm(form, 'OWN_TROOPS', info);
         }
         else if ( info.h_id !== mapId ) 
         {
            if ( info.cmd === ATC_IMPRISON )
            {
               addFieldsToForm(form, 'IMPRISONED_TROOPS['+pcounter+']', info);
               ++pcounter;
            }
            else
            {
               addFieldsToForm(form, 'FOREIGN_TROOPS['+fcounter+']', info);
               ++fcounter;
            }
         }
      }

      if ( info.gr === 4 )
      {
         info.own_uid = TB3O.UserID;
         if ( info.cmd === ATC_IMPRISON )
         {
            addFieldsToForm(form, 'IMPRISONED_TROOPS['+pcounter+']', info);
            ++pcounter;
         }
         else
         {
            addFieldsToForm(form, 'LEGIONAIRE_TROOPS['+lcounter+']', info);
            ++lcounter;
         }
      }
   }

   addChildren(form,[
      $i([hidden, ['name',"url"],       ['value', window.location]] ),
      $i([hidden, ['name',"player_id"], ['value', TB3O.UserID]] )
   ]);

   document.body.appendChild(form);
}


}})
