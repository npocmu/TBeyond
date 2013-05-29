//////////////////////////////////////////////////////////////////////
// Fill 'Training in progress' tip table
function uiFillTriPTable(aTb, trainingInfoColl)
{
   var j,k; 
   var TriPInfo;
   var ttEnd, ttCurrent = toTimeStamp(getServerTimeNow());
   var dtNow = getDesiredTime(ttCurrent);

   var stats = getTrainingInfoCollStats(trainingInfoColl, ttCurrent);
   var arrTriP = stats.troopsNext;

   if ( arrTriP.length > 0 )
   {
      aTb.appendChild(uiCreateVillageInfoTipHead(getTroopImage(TBU_RACE_DELTA)));

      for ( j = 0; j < arrTriP.length; ++j )
      {
         TriPInfo = arrTriP[j];
         ttEnd = TriPInfo[0];
         aTb.appendChild(uiCreateVillageInfoTipRow([getTroopImage(TriPInfo[1])," " + TriPInfo[2]], T("BN_GID"+TriPInfo[3]), dtNow, ttEnd)); 
      }
   }

   arrTriP = stats.buildingsUsage;
   if ( arrTriP.length > 0 )
   {
      aTb.appendChild(uiCreateVillageInfoTipHead(getBuildingIcon(GID_BARRACKS)));

      for ( j = 0; j < arrTriP.length; ++j )
      {
         TriPInfo = arrTriP[j];
         ttEnd = TriPInfo[0];
         var col2content = [];
         for ( k = 0; k < TriPInfo[2].length; ++k )
         {
            var troopInfo = TriPInfo[2][k][0];
            if ( col2content.length ) { col2content.push(", "); };
            col2content.push(troopInfo[1] + "\u00A0\u00D7\u00A0",getTroopImage(troopInfo[0]));
         }
         aTb.appendChild(uiCreateVillageInfoTipRow([getBuildingIcon(TriPInfo[1])," " + T("BN_GID"+TriPInfo[1])], col2content, dtNow, ttEnd)); 
      }
   }
}

//////////////////////////////////////////////////////////////////////
// create the 'Training in progress' table for a village
function uiCreateTriPTable(villageId)
{
   var aTb = $t();

   aTb.id = 'tb_BiPTM';
   uiFillTriPTable(aTb,TB3O.VillagesTrInfo.load(villageId));

   return ( aTb.hasChildNodes() ) ? aTb : null;
}

//////////////////////////////////////////////////////////////////////
// Used for updates info from refresh callbacks
function getTrainingInfo(gid, villageId, aDoc, ttServer)
{
   __ENTER__

   var trainingInfoColl = TB3O.VillagesTrInfo.load(villageId);
   var trainingInfo =  scanTrainingInfo(aDoc, ttServer);

   if ( trainingInfo )
   {
      trainingInfoColl[gid] = trainingInfo;
      TB3O.VillagesTrInfo.flush(villageId);
   }
   else
   {
      delete trainingInfoColl[gid];
   }
   __EXIT__

   return !!trainingInfo;
}

//////////////////////////////////////////////////////////////////////
function processTrainingBuilding(gid)
{
   getTrainingInfo(gid, TB3O.ActiveVillageId, document, toTimeStamp(TB3O.serverTime));
}

//////////////////////////////////////////////////////////////////////
function uiModifyTrainingBuilding(gid)
{
   //-----------------------------------------------------------------
   function uiAddTrainingSummary(titTb,arrTriP)
   {
      var xi;
      var ttCurrent = toTimeStamp(getServerTimeNow());
      var dtNow = getDesiredTime(ttCurrent);
      var headerNode = __TEST__($xf("./preceding-sibling::h4[1]",'f',titTb));
      var summaryInsertionPoint = titTb;

      if ( headerNode )
      {
         var summaryHeaderNode = headerNode.cloneNode(true);
         addClass(summaryHeaderNode,"tbInject");
         summaryHeaderNode.textContent = T("TOTTRTR");

         insertBefore(headerNode,summaryHeaderNode);
         summaryInsertionPoint = headerNode;
      }

      var aBody;
      var totTb = titTb.cloneNode(false);
      totTb.className = "tbInject tbTrainingSummary";
 
      var cells = titTb.rows[0].cells;
      addChildren(totTb,[
         $e("thead",
            $r(['class','cbgx'],[
               $td(IF_TB3({{T('SUMMARY') + " - " + }})cells[0].textContent),
               $td(T("TAVGDUR")),
               $td(cells[1].textContent),
               $td(cells[2].textContent)

            ])),
         aBody = $e("tbody")]);

      for ( xi = 0; xi < arrTriP.length; ++xi )
      {
         var TriPInfo = arrTriP[xi];
         var ttEnd = TriPInfo[0];
         var troopInfo = TriPInfo[3];

         var row = $r(null,[
            $td(['class','desc'], [getTroopImage(troopInfo[0]),troopInfo[1] + " " + TriPInfo[4]]),
            $td(['class','avg'],  formatTimeSpan(Math.round(TriPInfo[2]),0)),
            $td(['class','dur'],  [I("hourglass"),uiSetTimeSpanByDate($span(), dtNow, getDesiredTime(ttEnd), {format:1})]),
            $td(['class','fin'],  [I("clock"),$span(formatDateTime(dtNow,getDesiredTime(ttEnd),1))])
         ]);

         uiAddTooltip(row.cells[0],bind(uiCreateTroopInfoTooltip,[troopInfo,TriPInfo[4]]));

         aBody.appendChild(row);
      }

      insertBefore(summaryInsertionPoint,totTb);

      return totTb;
   }

   //-----------------------------------------------------------------
   function uiModifyTrainingContracts(trainingContracts, trainedTroops)
   {
      var bUpdateUrl = true;
      var refreshTimer = new Timer;

      //--------------------------------------------------------------
      function updateResourcesInfo(resourcesInfo, contractNo)
      {
         var xi, ri;
         var r = cloneResourcesInfo(resourcesInfo);

         for ( xi = 0; xi < trainingContracts.length; ++xi )
         {
            if ( xi !== contractNo )
            {
               var trainingContract = trainingContracts[xi];
               var count = trainingContract.countContract;
               var ucost = trainingContract.cost;

               for ( ri = 0; ri < 4; ++ri )
               {
                  r.Res[ri] -= ucost[ri] * count;
               }
            }
         }
         return r;
      }

      //--------------------------------------------------------------
      function __calculateContractCountMax(resourcesInfo, contractNo)
      {
         var ri;
         var resAvail = resourcesInfo.Res;
         var trainingContract = trainingContracts[contractNo];
         var ucost = trainingContract.cost;
         var countMax = Infinity, countNPCMax = Infinity;
         var ucTotal = 0;

         for ( ri = 0; ri < 4; ++ri )
         {
            var cost = ucost[ri];
            ucTotal += cost;

            countMax = Math.min(countMax, Math.max(0, Math.floor(resAvail[ri] / cost)));
            countNPCMax = Math.min(countNPCMax, Math.floor(resourcesInfo.Cap[ri] / cost));
         }

         trainingContract.countMax = countMax;
         trainingContract.countNPCMax = Math.min(countNPCMax, Math.floor(totalResources(resAvail) / ucTotal));
      }

      //--------------------------------------------------------------
      function calculateContractCountMax(resourcesInfo, contractNo)
      {
         __calculateContractCountMax(updateResourcesInfo(resourcesInfo, contractNo), contractNo);
      }

      //--------------------------------------------------------------
      function getUnitsAvailability(count, cost1, resourcesInfo)
      {
         var cost = countResources(cloneArray(cost1),count);
         return getAvailability(cost, resourcesInfo, TB3O.bIsNPCInVillage);
      }

      //--------------------------------------------------------------
      // refresh UI for unit counts bar
      function uiRefreshContractCounts(trainingContract)
      {
         var tix = trainingContract.tInfo[0];
         var troopNo = getTroopNoByIndex(trainedTroops, tix);
         var contractNo = trainingContract.contractNo;
         var countPresent = trainingContract.count;
         var countTrained = ( troopNo === undefined ) ?  0 : trainedTroops[troopNo][1];
         var countContract = trainingContract.countContract;
         var countNew = countTrained + countContract;
         var countTotal = countPresent + countNew;
         var node;

         display($g("tb_cntp_" + contractNo), (countNew > 0) );

         if ( countNew > 0 )
         {
            node = $g("tb_cntr_" + contractNo);
            node.textContent = countNew;
            ifClass(node, countContract > 0, 'tbNew');

            node = $g("tb_cnta_" + contractNo);
            node.textContent = countTotal;
            ifClass(node, countContract > 0, 'tbNew');
         }
      }

      //--------------------------------------------------------------
      // refresh UI for quick pad
      function uiRefreshQuickPad(trainingContract, resourcesInfo)
      {
         var tsRefresh = Infinity;
         var av = getUnitsAvailability(trainingContract.countContract, trainingContract.cost, resourcesInfo);
         uiSetCenterNumberState(trainingContract.inputNode, av[0], false);
         tsRefresh = getAvailabilityRefreshTimeout(av);

         var quickPadCells = trainingContract.quickPadContainer.firstChild.rows[0].cells;
         var i;
         for ( i = 1; i < 4; ++i )
         {
            var node = quickPadCells[i].firstChild;
            if ( node )
            {
               var count = trainingContract.countContract + parseInt10(node.textContent);
               av = getUnitsAvailability(count, trainingContract.cost, resourcesInfo);
               tsRefresh = Math.min(tsRefresh, getAvailabilityRefreshTimeout(av));
               uiSetCenterNumberState(node, av[0], false);
            }
         }

         quickPadCells[5].firstChild.textContent = trainingContract.countMax;
         av = getUnitsAvailability(trainingContract.countMax+1, trainingContract.cost, resourcesInfo);
         tsRefresh = Math.min(tsRefresh, getAvailabilityRefreshTimeout(av,1));

         if ( TB3O.bIsNPCInVillage )
         {
            quickPadCells[6].firstChild.textContent = trainingContract.countNPCMax;
            av = getUnitsAvailability(trainingContract.countNPCMax+1, trainingContract.cost, resourcesInfo);
            tsRefresh = Math.min(tsRefresh, getAvailabilityRefreshTimeout(av,2));
         }

         return tsRefresh;
      }

      //--------------------------------------------------------------
      function uiRefreshResAndTimeTable(trainingContract, resourcesInfo)
      {
         var cc = trainingContract.cc;
         var countContract = trainingContract.countContract;
         var node = $g("tb_trtt_" + trainingContract.contractNo);
         var av = getUnitsAvailability(countContract, trainingContract.cost, resourcesInfo);
         var aTb = uiCreateResAndTimeTable(av, resourcesInfo, null, null, 
                   [cc*trainingContract.count, cc*(trainingContract.count+countContract)], 
                   { top_title: true,
                     NPC: (TBO_NPC_ASSISTANT === "1" && TB3O.bIsNPCInVillage),
                   });
         replaceChildren(node,aTb);
      }

      //--------------------------------------------------------------
      function _uiRefreshResourcesDependences(resourcesInfo)
      {
         var tsRefresh = Infinity;

         // renew all contracts
         var contractNo;
         for ( contractNo = 0; contractNo < trainingContracts.length; ++contractNo )
         {
            var updatedInfo = updateResourcesInfo(resourcesInfo, contractNo);
            __calculateContractCountMax(updatedInfo, contractNo);
            tsRefresh = Math.min(tsRefresh, uiRefreshQuickPad(trainingContracts[contractNo], updatedInfo));
            uiRefreshResAndTimeTable(trainingContracts[contractNo], updatedInfo);
         }
         __DUMP__(tsRefresh)

         refreshTimer.cancel();

         if ( isFinite(tsRefresh) )
         {
            refreshTimer.set(uiRefreshResourcesDependences, tsRefresh*1000);
         }
      }


      //--------------------------------------------------------------
      function uiRefreshResourcesDependences()
      {
         __ENTER__
         _uiRefreshResourcesDependences(getActualResourcesInfoNow(TB3O.ActiveVillageInfo.r, true));
         __EXIT__
      }

      //--------------------------------------------------------------
      function onChangeContractCount(contractNo)
      {
         __ENTER__
         var trainingContract = trainingContracts[contractNo];
         trainingContract.countContract = validateInputInt(trainingContract.inputNode, 0, 9999);

         uiRefreshContractCounts(trainingContract);

         // update url when it needed
         if ( bUpdateUrl )
         {
            TB3O.onHashChange = function(e) // temporary disable listener
            {
               TB3O.onHashChange = setContractsCountsFromUrl;  // reenable listener
            }
            
            crtUrl.hashKey["t" + trainingContract.tInfo[0]] = trainingContract.countContract;
            combineUri(crtUrl);
            __DUMP__("set window.location.hash", crtUrl.hash)
            window.location.hash = crtUrl.hash;
         }

         uiRefreshResourcesDependences();

         __EXIT__
      }

      //--------------------------------------------------------------
      function setContractCount(contractNo, count)
      {
         if ( count === '' || isIntValid(count) )
         {
            __DUMP__("setContractCount", contractNo, count)
            var control = trainingContracts[contractNo].inputNode;
            control.value = count;
            fireChangeEvent(control);
         }
      }

      //-----------------------------------------------------------------
      function onClearContractCount(contractNo)
      {
         setContractCount(contractNo,0);
      }

      //-----------------------------------------------------------------
      function onAddContractCount(contractNo, count)
      {
         setContractCount(contractNo, count + trainingContracts[contractNo].countContract);
      }

      //-----------------------------------------------------------------
      function updateContractMax(contractNo)
      {
         //calculateContractCountMax(getActualResourcesInfoNow(TB3O.ActiveVillageInfo.r, true), contractNo);
      }

      //-----------------------------------------------------------------
      function onSetContractMax(contractNo)
      {
         updateContractMax(contractNo);
         setContractCount(contractNo, trainingContracts[contractNo].countMax);
      }

      //-----------------------------------------------------------------
      function onSetContractNPCMax(contractNo)
      {
         updateContractMax(contractNo);
         setContractCount(contractNo, trainingContracts[contractNo].countNPCMax);
      }

      //-------------------------------------------------------------
      // set default values from url
      function setContractsCountsFromUrl()
      {
         __ENTER__
         var bParamsPresent = false;
         if ( crtUrl.hashbang )
         {
            var contractNo;

            bParamsPresent = true;
            bUpdateUrl = false;
            
            // cleanup all contracts count
            for ( contractNo = 0; contractNo < trainingContracts.length; ++contractNo )
            {
               trainingContracts[contractNo].countContract = 0;
            }

            // fill all contracts count from url
            for ( contractNo = 0; contractNo < trainingContracts.length; ++contractNo )
            {
               var trainingContract = trainingContracts[contractNo];
               var tix = trainingContract.tInfo[0];

               var defValue = crtUrl.hashKey["t" + tix];
               if ( defValue === "max" ) 
               { 
                  onSetContractMax(contractNo);
               }
               else 
               { 
                  setContractCount(contractNo, parseInt10(defValue));
               }
            }
            bUpdateUrl = true;
         }
         __EXIT__
         return bParamsPresent;
      }

      //--------------------------------------------------------------
      function uiCreateCountTip(tInfo,e)
      {
         var tip = null;
         var count = parseInt10(e.target.textContent);
         if ( isIntValid(count) && count > 0 )
         {
            tip = uiCreateTroopInfoTooltip2(tInfo,count);
         }
         return tip;
      }

      function uiCreateCountSpan(id, countTxt, tInfo)
      {
         var node = $span(countTxt);
         if ( id ) { node.id = id; }
         node.className = "tbCount"; 
         uiAddTooltip(node,bind2(uiCreateCountTip,[tInfo]));
         return node;
      }

      function uiCreateQLink(contractNo, handler, count)
      {
         return ( count ) ? $div([['class','CN a'],['click',bind(onAddContractCount,[contractNo,count]),false]],"+" + count) : null;
      }

      //--------------------------------------------------------------
      (function() 
      {
      var contractNo;
      var countMax = 0;
      var trainingContract;
      var resourcesInfo = getActualResourcesInfoNow(TB3O.ActiveVillageInfo.r, true);

      // detect quick count
      for ( contractNo = 0; contractNo < trainingContracts.length; ++contractNo )
      {
         calculateContractCountMax(resourcesInfo, contractNo);
         trainingContract = trainingContracts[contractNo];
         if ( trainingContract.countMax > countMax )
         {
            countMax = trainingContract.countMax;
         }
      }
      var Qcount = ifGreater(countMax, 
         2000,[100,500,1000],
         1000,[ 50,100, 500],
          200,[ 10, 50, 100],
           50,[  5, 10,  50],
           20,[  5, 10],
           10,[  5],
           [  ]
         );


      for ( contractNo = 0; contractNo < trainingContracts.length; ++contractNo )
      {
         trainingContract = trainingContracts[contractNo];
         __DUMP__(trainingContract)

         uiModifyTrainingContractLayout(trainingContract);

         // modify count of units as follow:
         // was: (present: x)
         // now: (present: <x><+<n>=<z>>)
         var countNodeTxt = trainingContract.countNode.textContent;
         var countTxt = trainingContract.countTxt;
         var insertPoint = countNodeTxt.indexOf(countTxt);
         replaceChildren(trainingContract.countNode, [
            countNodeTxt.substr(0,insertPoint),
            uiCreateCountSpan(null, countTxt, trainingContract.tInfo),
            $span([['id','tb_cntp_' + contractNo],['style','display:none;'],attrInject$],[
               "+",
               uiCreateCountSpan('tb_cntr_' + contractNo, "", trainingContract.tInfo),
               " " + getArrowChar() + " ",
               uiCreateCountSpan('tb_cnta_' + contractNo, "", trainingContract.tInfo)
            ]),
            countNodeTxt.substr(insertPoint+countTxt.length)
         ]);

         // modify input control
         uiAddBuiltinUpDownControl(trainingContract.inputNode);
         var fHandler = bind(onChangeContractCount,[contractNo]);
         trainingContract.inputNode.addEventListener('keyup', fHandler, false);
         trainingContract.inputNode.addEventListener('change', fHandler, false);

         trainingContract.quickPadContainer.appendChild(
            $t(['class','tbInject tbTrainQuick'],
               $r(null,[
                  $td(['class','tbQDel'], uiCreateTool("del", null, bind(onClearContractCount,[contractNo]))),
                  $td(['class','tbQAdd'], uiCreateQLink(contractNo, onAddContractCount, Qcount[0])),
                  $td(['class','tbQAdd'], uiCreateQLink(contractNo, onAddContractCount, Qcount[1])),
                  $td(['class','tbQAdd'], uiCreateQLink(contractNo, onAddContractCount, Qcount[2])),
                  $td(['class','tbSep'],"/"),
                  $td(['class','tbQSet tbQMax'],$div([['class','CN a ' + getCNClass(STA_AVAIL)],['click',bind(onSetContractMax,[contractNo]),false]],trainingContract.countMax)),
                  ( TB3O.bIsNPCInVillage ) ?
                     $td(['class','tbQSet tbQNPCMax'], $div([['class','CN a ' + getCNClass(STA_NPCAVAIL)],['click',bind(onSetContractNPCMax,[contractNo]),false]],trainingContract.countNPCMax)) :
                     null
               ])
            )
         );

         insertAfter(trainingContract.costNode,$e("p",[attrInject$,['id','tb_trtt_' + contractNo]]));
      }

      if ( !setContractsCountsFromUrl() )
      {
         // first time regen
         for ( contractNo = 0; contractNo < trainingContracts.length; ++contractNo )
         {
            uiRefreshContractCounts(trainingContracts[contractNo]);
         }
         _uiRefreshResourcesDependences(resourcesInfo);
      }

      TB3O.onHashChange = setContractsCountsFromUrl;

      })();
   }

   //--------------------------------------------------------------
   function updateUnitCountInfo(trainingContracts)
   {
      var unitsTotal = TB3O.ActiveVillageInfo.uci.ut;
      var contractNo;

      for ( contractNo = 0; contractNo < trainingContracts.length; ++contractNo )
      {
         var trainingContract = trainingContracts[contractNo];
         var uix = trainingContract.tInfo[0]-TBU_RACE_DELTA;
         if ( trainingContract.count > unitsTotal[uix] )
         {
            unitsTotal[uix] = trainingContract.count;
         }
      }
   }

   __ENTER__

   (function() 
   {
   var xi;
   var trainingInfo = TB3O.VillagesTrInfo.load(TB3O.ActiveVillageId)[gid]; // restrict collection to this building only
   if ( trainingInfo )
   {
      var trainingInfoColl = {}; trainingInfoColl[gid] = trainingInfo;
      // arrTriP: [ [ttEvent, dur, avg, [tix,count], name] ]
      var arrTriP = getTrainingInfoCollStats(trainingInfoColl, toTimeStamp(TB3O.serverTime)).troopsTotal;
      var trainedTroops = [];
      for ( xi = 0; xi < arrTriP.length; ++xi )
      {
         trainedTroops.push(arrTriP[xi][3]);
      }

      var trainingContracts = scanTrainingContracts();
      uiModifyTrainingContracts(trainingContracts, trainedTroops);
      updateUnitCountInfo(trainingContracts);

      var titTb = searchTrainingQueueTable(document);
      if ( titTb )
      {
         var rows = titTb.rows;

         // add summary table (only if queue has more the one order for some unit)
         // and statistic table
         var statTrainTable = ( gid === GID_TRAPPER ) ? null: uiCreateTroopsAttDefInfoTable2("tb_traintroopstat", trainedTroops, T("STAT"), true);
         if ( arrTriP.length < trainingInfo.evA.length )
         {
            var summaryTable = uiAddTrainingSummary(titTb,arrTriP);
            if ( statTrainTable )
            {
               insertAfter(summaryTable, statTrainTable);
            }
         }
         else if ( statTrainTable )
         {
            insertAfter(titTb, statTrainTable);
         }

         // add tip to each row of training queue
         for ( xi = 1; xi < rows.length - 1; ++xi )
         {
            var trainingEvent = trainingInfo.evA[xi-1];
            uiAddTooltip(rows[xi].cells[0],bind(uiCreateTroopInfoTooltip,[trainingEvent.tri,trainingEvent.name]));
         }
      }
   }
   })();
   __EXIT__
}
