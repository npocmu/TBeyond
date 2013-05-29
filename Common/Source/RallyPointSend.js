//////////////////////////////////////////////////////////////////////
function uiSetAttackType(act)
{
   if ( act )
   {
      var rbA = __TEST__($xf("//input[@value='" + act + "' and @name='c']"));
      if ( rbA && !rbA.disabled ) 
      {
         rbA.checked = true;
      }
   }
}

//////////////////////////////////////////////////////////////////////
// change to the default attack type on the "Rally Point -> Send Troops" page
function uiModifyDefaultAttackType()
{
   var act, z;
   var villageInfo, villageId, mapId;

   //2:Defend, 3:Attack, 4:Raid
   //OASIS - only attack:raid (fr3nchlover)
   if ( crtUrl.queryKey.o ) 
   {
      act = 4;
   }
   else
   {
      act = parseInt10(TBO_RP_DEFAULT_ACTION);
      if ( !isIntValid(act) ) { act = 0; }
      act += 2;

      //action = 2 if the destination is one of your own villages
      if ( crtUrl.queryKey.z )
      {
         z = parseInt10(crtUrl.queryKey.z);
         for ( villageId in TB3O.VillagesInfo )
         {
            villageInfo = TB3O.VillagesInfo[villageId];
            mapId = xy2id(villageInfo.x,villageInfo.y);

            if ( z === mapId ) 
            {
               act = 2;
               break;
            }
         }
      }
   }
   uiSetAttackType(act);
}

//////////////////////////////////////////////////////////////////////
function searchRallyPointSendElems()
{
   var sendTable = __TEST__($g("troops"));
   var sendContainer = null;
   if ( sendTable )
   {
      sendContainer = sendTable.parentNode;
   }
   __ASSERT__(sendContainer,"Can't find send troops table container")

   return ( sendContainer ) ? [sendContainer,sendTable] : null;
}

//////////////////////////////////////////////////////////////////////
function uiModifyRallyPointSend()
{
   __ENTER__

   var availableTroops, sendTroops;
   var statSendTable;

   //-------------------------------------------------------------
   function searchTroopsInput(troopNo)
   {
      return __TEST__($g("tb_i" + (troopNo + 1)));
   }

   //-------------------------------------------------------------
   function getAvailableTroopsInfo(sendTable)
   {
      var troopsInfo = [];
      var i;
      for ( i = 1; i < 12; ++i )
      {
         var aInput = $xf(".//input[@name='t" + i + "']",sendTable);
         if (aInput)
         {
            aInput.id = 'tb_i' + i;
            var aParent = aInput.parentNode;
            var unitImg = $nth_tag(aParent,"img",0);
            var index =  ( unitImg ) ? getTroopIndexTitleFromImg(unitImg)[0] : null;
            if ( index && TBU_RACE === '' ) { setRace(index); }

            var aLabel = $nth_tag(aParent,"a",0);
            var count = 0;
            if ( aLabel )
            {
               count = scanIntAny(aLabel.textContent);
            }
            troopsInfo.push([index,count]);
         }
      }
      return troopsInfo;
   }

   //-------------------------------------------------------------
   function getSendTroopsInfo(availableTroops)
   {
      var troopsInfo = cloneObject(availableTroops);
      var troopNo;
      for ( troopNo = 0; troopNo < troopsInfo.length; ++troopNo )
      {
         var aInput = searchTroopsInput(troopNo);
         var count = 0;
         if ( aInput )
         {
            count = parseInt10(aInput.value);
            if ( !isIntValid(count) ) { count = 0; }
         }
         troopsInfo[troopNo][1] = count;
      }
      return troopsInfo;
   }

   //-------------------------------------------------------------
   function uiRefreshStats()
   {   
      if ( statSendTable )
      {
         uiFillTroopsAttDefInfoTable2(statSendTable, sendTroops);
      }
   }

   //-------------------------------------------------------------
   function updateTroop(troopNo, units)
   {
      sendTroops[troopNo][1] = units; 
   }

   //-------------------------------------------------------------
   function foreachTroop(f)
   {
      var troopNo;
      for ( troopNo = 0; troopNo < availableTroops.length; ++troopNo )
      {
         var count = availableTroops[troopNo][1];
         if ( count > 0 )
         {
            f(troopNo);
         }
      }
   }

   //-------------------------------------------------------------
   function uiSetTroop(troopNo, units)
   {
      var aInput = searchTroopsInput(troopNo);
      if ( aInput )
      {
         aInput.value = ( units ) ? units : "";
         updateTroop(troopNo, units);
      }
   }

   //-------------------------------------------------------------
   function _uiSetMaxTroop(troopNo)
   {
      uiSetTroop(troopNo, availableTroops[troopNo][1]);
   }

   //-------------------------------------------------------------
   function uiSetMaxTroop(troopNo)
   {
      _uiSetMaxTroop(troopNo);
      uiRefreshStats();
   }

   //-------------------------------------------------------------
   function uiSetMaxAllTroops()
   {
      foreachTroop(_uiSetMaxTroop);
      uiRefreshStats();
   }

   //-------------------------------------------------------------
   function _uiSetZeroTroop(troopNo)
   {
      uiSetTroop(troopNo, 0);
   }

   //-------------------------------------------------------------
   function uiSetZeroTroop(troopNo)
   {
      _uiSetZeroTroop(troopNo);
      uiRefreshStats();
   }

   //-------------------------------------------------------------
   function uiSetZeroAllTroops()
   {
      foreachTroop(_uiSetZeroTroop);
      uiRefreshStats();
   }

   //-------------------------------------------------------------
   function onChangeUnitsCount(troopNo)
   {
      var units = validateInputInt(this,0,availableTroops[troopNo][1]);
      updateTroop(troopNo, units);
      uiRefreshStats();
   }

   //-------------------------------------------------------------
   function uiSetScout()
   {
      var troopNo = getTroopNoByIndex(availableTroops, getScoutTroopIndex(TBU_RACE));
      var scoutsAvailable = availableTroops[troopNo][1];
      var iNoOfScouts = $g('tb_selectscoutnumber');
      var wNoOfScouts = (iNoOfScouts) ? parseInt10(iNoOfScouts.value) : 3;
      if ( wNoOfScouts > 0 )
      {
         TBO_NO_OF_SCOUTS = wNoOfScouts;
         saveTBOptions();
      }

      if ( wNoOfScouts > scoutsAvailable ) { wNoOfScouts = scoutsAvailable; }

      foreachTroop(_uiSetZeroTroop);
      uiSetAttackType(4); //set the attack:raid as action
      uiSetTroop(troopNo, wNoOfScouts);
      uiRefreshStats();
   }

   //-------------------------------------------------------------
   function uiSetFakeUnit()
   {
      foreachTroop(_uiSetZeroTroop);
      uiSetAttackType(3); //set the attack:normal as action

      var chk = false;
      var troopNo;
      for( troopNo = 0; troopNo < 8; ++troopNo )
      {
         var faketroopselected = $g("tb_faketroop" + troopNo);
         if ( faketroopselected && faketroopselected.checked )
         {
            uiSetTroop(troopNo, 1);
            chk = true;
         }
      }

      if ( !chk )
      {
         //no troops for fake selected  => use default (most slow unit available)
         var minSpeed = Infinity;
         var slowTroopNo; 
         var scoutTI = getScoutTroopIndex(TBU_RACE);
         for( troopNo = 0; troopNo < 8; ++troopNo )
         {
            if ( availableTroops[troopNo][1] > 0 && availableTroops[troopNo][0] !== scoutTI )
            {
               var index = availableTroops[troopNo][0];
               if ( index !== scoutTI && uc[index][8] < minSpeed ) 
               {
                  slowTroopNo = troopNo;
                  minSpeed = uc[index][8];
               }
            }
         }
         uiSetTroop(slowTroopNo, 1); 
      }
      uiRefreshStats();
   }

   //-------------------------------------------------------------
   function uiAddTopMenu(sendContainer)
   {
      //----------------------------------------------------------
      function uiAddActionLink(aCell, bEnabled, label, actionFun)
      {
         if ( bEnabled > 0 )
         {
            aCell.appendChild($action(null, label, actionFun));
         }
         else
         {
            aCell.appendChild($span([['class', 'none']], label));
         }
      }

      //----------------------------------------------------------
      function uiAddSelectAllLink(aTb)
      {
         var aCell;
         var troopNo, totalTroops = 0;
         for ( troopNo = 0; troopNo < availableTroops.length; ++troopNo )
         {
            totalTroops += availableTroops[troopNo][1];
         }

         aTb.appendChild($r([['class', 'tb3rnb']],[aCell = $td([['class', 'tb3cnb']]),$td()]));
         uiAddActionLink(aCell, totalTroops > 0, T('SELECTALLTROOPS'), uiSetMaxAllTroops);
      }

      //----------------------------------------------------------
      function uiAddSelectScoutLink(aTb)
      {
         var aCell, bCell, aInput;
         var scoutTI = getScoutTroopIndex(TBU_RACE);
         var troopNo = getTroopNoByIndex(availableTroops, scoutTI);
         var scoutsAvailable = ( troopNo === undefined ) ? 0 : availableTroops[troopNo][1];
         var scouts = parseInt10(TBO_NO_OF_SCOUTS);
         if ( isNaN(scouts) ) { scouts = ( scoutsAvailable > 3 ) ? 3 : scoutsAvailable; }

         aTb.appendChild($r([['class', 'tb3rnb']],[
            aCell = $td([['class', 'tb3cnb']]), 
            $td(null,[
               getTroopImage(scoutTI),
               "\u00A0",
               aInput = $i([['class','text'], ['type','text'], ['id','tb_selectscoutnumber'], ['maxlength','6'], ['value',scouts]])
            ])
         ]));

         uiAddBuiltinUpDownControl(aInput);
         uiAddActionLink(aCell, scoutsAvailable > 0, T('SELECTSCOUT'), uiSetScout);
      }

      //----------------------------------------------------------
      function uiAddSelectFakeLink(aTb)
      {
         var aCell;
         var bCell = $td();
         var scoutTI = getScoutTroopIndex(TBU_RACE);
         var bHasTroops = false;
         var troopNo;
         for( troopNo = 0; troopNo < 8; ++troopNo )
         {
            if ( availableTroops[troopNo][1] > 0 && availableTroops[troopNo][0] !== scoutTI )
            {
               addChildren(bCell,[
                  getTroopImage(availableTroops[troopNo][0]),
                  $i([['type', 'checkbox'], ['id', 'tb_faketroop' + (troopNo)], ['value', '1']])
               ]);
               bHasTroops = true;
            }
         }

         aTb.appendChild($r([['class', 'tb3rnb']],[aCell = $td([['class', 'tb3cnb']]),bCell]));
         uiAddActionLink(aCell, bHasTroops, T('SELECTFAKE'), uiSetFakeUnit);
      }

      //----------------------------------------------------------
      var aTb = $t([["class", "tb3tbnb tbSendTroopsMenu"]]);
      insertBefore(sendContainer, aTb); // add to DOM very first for uiAddBuiltinUpDownControl
      uiAddSelectAllLink(aTb);
      uiAddSelectScoutLink(aTb);
      uiAddSelectFakeLink(aTb);
   }

   //-------------------------------------------------------------
   function uiModifySendTableTroop(troopNo)
   {
      var aInput = searchTroopsInput(troopNo);
      aInput.addEventListener('keyup',  bind(onChangeUnitsCount,[troopNo]), false);
      aInput.addEventListener('change', bind(onChangeUnitsCount,[troopNo]), false);
      uiAddBuiltinUpDownControl(aInput);

      var aParent = aInput.parentNode;
      var unitImg = $nth_tag(aParent,"img",0);
      unitImg.addEventListener('click', bind(uiSetZeroTroop,[troopNo]), false);
      var aLink = $nth_tag(aParent,"a",0);
      aLink.addEventListener('click', bind(uiSetMaxTroop,[troopNo]), false);
      IF_TB3({{if ( availableTroops[troopNo][1] > ((troopNo > 5) ? 999:9999) ) { addClass(aLink,"tbMany"); }}})
   }

   //-------------------------------------------------------------
   function uiModifySendTable(sendTable)
   {
      foreachTroop(uiModifySendTableTroop);
      sendTable.appendChild($r($td([['colspan', '12'], ['style', 'text-align:center']],uiCreateTool("bDel", T('MTCL'), uiSetZeroAllTroops))));
   }

   //-------------------------------------------------------------
   function uiAddLastAttackTable()
   {
      __ENTER__
      var aF = __TEST__($xf("//form[@name='snd']"));
      if ( aF )
      {
         var bOK = __TEST__($xf("//*[@id='btn_ok' and @name='s1']"));
         if ( bOK ) { bOK.addEventListener('click', saveLastAttack, false); }

         var cstla = loadPersistentUserObject('stla');
         var stla = cstla[TB3O.ActiveVillageId];
         if ( stla )
         {
            var bsh = false;
            var xi;
            for ( xi = 2; xi < stla.length - 2; xi++ )
            {
               if (stla[xi] !== 0) { bsh = true; }
            }

            if ( bsh )
            {
               //create the last send attack table for this village
               var aTb = $t([['id', 'stla']]);
               var aRow = $r(null,[
                  $td([['class','stlahh1']],I('u' + (    TBU_RACE_DELTA))),
                  $td(stla[2]),
                  $td([['class', 'stlahh']],I('u' + (3 + TBU_RACE_DELTA))),
                  $td(stla[5]),
                  $td([['class', 'stlahh']],I('u' + (6 + TBU_RACE_DELTA))),
                  $td(stla[8]),
                  $td([['class', 'stlahh']],I('u' + (8 + TBU_RACE_DELTA))),
                  $td(stla[10])
               ]);

               var bRow = $r(null,[
                  $td([['class','stlahh1']], I('u' + (1 + TBU_RACE_DELTA))),
                  $td(stla[3]),
                  $td([['class', 'stlahh']], I('u' + (4 + TBU_RACE_DELTA))),
                  $td(stla[6]),
                  $td([['class', 'stlahh']], I('u' + (7 + TBU_RACE_DELTA))),
                  $td(stla[9]),
                  $td([['class', 'stlahh']], I('u' + (9 + TBU_RACE_DELTA))),
                  $td(stla[11])
               ]);

               var cRow = $r(null,[
                  $td([['class','stlahh1']], I('u' + (2 + TBU_RACE_DELTA))),
                  $td(stla[4]),
                  $td([['class', 'stlahh']], I('u' + (5 + TBU_RACE_DELTA))),
                  $td(stla[7]),
                  $td([['colspan', '2']])
               ]);

               if (stla.length > 14)
               {
                  cRow.appendChild($td([['class', 'stlahh']], I('uhero')));
                  cRow.appendChild($td(stla[12]));
               }
               else
               {
                  cRow.appendChild($td([['class', 'stlahh']]));
                  cRow.appendChild($td());
               }

               var dRow = null;
               if ( TBO_SHOW_LAST_ATTACK_TARGET === "1" )
               {
                  dRow = $r(null,[
                     $td([['class','stlahh1']],I("vmkls")),
                     $td([['class',  'stlac'],['colspan', '4']], uiCreateIntMapLinkXY2(stla[0],stla[1])),
                     $td([['class',  'stlac'],['colspan', '3']], stla[stla.length - 1])
                  ]);
               }

               var eRow = $r(null,[
                  $td([['class','stlahh1'], ['colspan', '2']], T("RESEND")),
                  $td([['class','stlac'], ['colspan','3'], ['style','width:100px;']],
                      uiCreateTool("bOK",T("YES"),setLastAttack)),
                  $td([['class','stlahh2'], ['colspan','2']], T("DEL")),
                  $td([['class', 'stlac']], 
                      uiCreateTool("del",T("DEL"),hideLastAttackSend))
               ]);

               addChildren(aTb, [aRow,bRow,cRow,dRow,eRow]);
               insertAfter($g("troops"), aTb);
            }
         }
      }
      __EXIT__

      function setLastAttack()
      {
         var tx, i;

         foreachTroop(_uiSetZeroTroop);

         for ( i = 2; i < stla.length - 2; i++ )
         {
            var troopNo = i - 2;
            var units = stla[i];
            var availableUnits = availableTroops[troopNo][1];
            if ( availableUnits > 0 )
            {
               if ( units > availableUnits ) { units = availableUnits; }
               uiSetTroop(troopNo, units);
            }
         }

         if (TBO_SHOW_LAST_ATTACK_TARGET === '1')
         {
            var xNode = __TEST__($xf("//form[@name='snd']//*[@name='x']"));
            var yNode = __TEST__($xf("//form[@name='snd']//*[@name='y']"));

            if ( xNode && yNode )
            {
               xNode.value = stla[0];
               yNode.value = stla[1];

               // force refresh stats
               var e = document.createEvent("Events");
               e.initEvent("change", true, false);
               xNode.dispatchEvent(e);
            }
         }

         uiSetAttackType(stla[stla.length - 2]);
         uiRefreshStats();
      }

      function hideLastAttackSend()
      {
         var xi;
         for (xi = 2; xi < stla.length; xi++)
         {
            stla[xi] = 0;
         }
         savePersistentUserObject('stla', stla, TB3O.ActiveVillageId);
         $g('stla').style.display = 'none';
      }

      function saveLastAttack()
      {
         var stla = [];
         stla[0] = $xf("//form[@name='snd']//*[@name='x']").value;
         stla[1] = $xf("//form[@name='snd']//*[@name='y']").value;
         var i;
         for ( i = 0; i < sendTroops.length; ++i )
         {
            stla[i + 2] = sendTroops[i][1];
         }

         var rbl = $xf("//form//input[@name='c']", 'l');
         for (i = 0; i < rbl.snapshotLength; i++)
         {
            if ( rbl.snapshotItem(i).checked == true )
            {
               stla[stla.length] = rbl.snapshotItem(i).value;
               stla[stla.length] = rbl.snapshotItem(i).parentNode.textContent;
            }
         }

         savePersistentUserObject('stla', stla, TB3O.ActiveVillageId);
      }
   }

   //-------------------------------------------------------------
   function uiCreateTroopsTimesTable(x,y)
   {
      return uiCreateTroopsMerchantsDistTable("tb_unitstime", null, xy2id(x,y),
                                                 {show_troops:true, show_all_races:true, show_coords:true});
   }

   //-------------------------------------------------------------
   var elems = searchRallyPointSendElems();
   if ( elems )
   {
      var sendContainer = elems[0];
      var sendTable = elems[1];
      
      availableTroops = getAvailableTroopsInfo(sendTable);
      sendTroops = getSendTroopsInfo(availableTroops);

      uiAddTopMenu(sendContainer);
      uiModifySendTable(sendTable);

      statSendTable = uiCreateTroopsAttDefInfoTable2("tb_sendtroopstat", sendTroops, T("STAT"), true);
      if ( statSendTable )
      {
         insertAfter(sendTable, statSendTable);
      }

      if ( crtUrl.queryKey.c === undefined ) { uiModifyDefaultAttackType(); }

      if ( TBO_SHOW_LAST_ATTACK === "1") 
      {
         uiAddLastAttackTable();
      }

      new DestinationPicker(searchRallyPointSendTroopsTimesContainer,uiCreateTroopsTimesTable);
   }

   __EXIT__
}
