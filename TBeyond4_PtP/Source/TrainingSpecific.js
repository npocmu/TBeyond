//////////////////////////////////////////////////////////////////////
function getTrainingBlockPath()
{
   return "//div[@id='" + ID_CONTENT + "']//div[" + $xClass('trainUnits') + "]";
}


//////////////////////////////////////////////////////////////////////
function isThisTrainingBuilding()
{
   var aValue = $xf(getTrainingBlockPath());
   return !!aValue;
}

//////////////////////////////////////////////////////////////////////
function searchTrainingQueueTable(aDoc)
{
   return searchQueueTable(aDoc);
}

//////////////////////////////////////////////////////////////////////
function scanTrainingInfo(aDoc, ttServer)
{
   var result = true;
   var titTb = searchTrainingQueueTable(aDoc);
   var trainingInfo =  new TrainingInfo(); trainingInfo.ttUpd = ttServer;

   if ( titTb )
   {
      var rows = titTb.rows;
      var countdownElem  = $nth_tag(rows[rows.length-1],"span");
      var ttFirst = null;

      if ( countdownElem )
      {
         ttFirst = ttServer + toSeconds(countdownElem.textContent) * 1000;
      }

      var xi;
      for (xi = 1; xi < rows.length - 1; ++xi)
      {
         var cells = rows[xi].cells;
         if ( cells.length === 3 )
         {
            var aInf = cells[0];
            var aImg = __TEST__($nth_tag(aInf,"img"));
            if ( aImg )
            {
               var tInfo = getTroopIndexTitleFromImg(aImg);
               var count = parseInt10(aInf.textContent);
               if ( isIntValid(count) )
               {
                  var ttEnd = getEventTimeStamp(ttServer, cells[1].textContent);
                  trainingInfo.evA.push(new TrainingEvent(tInfo[1], ttEnd, [tInfo[0],count], ttFirst));
                  ttFirst = null;
               }
            }
         }
      }
      result = ( trainingInfo.evA.length === (titTb.rows.length - 2) );
   }

   return result ? trainingInfo : null;
}

//////////////////////////////////////////////////////////////////////
function scanTrainingContracts(aDoc)
{
   function scanContract(node)
   {
      var contract = null;
      try
      {
         var countNode = __TEST__($xf(".//span[" + $xClass('furtherInfo') + "]", 'f', node, aDoc));
         var count, countTxt; 
         if ( countNode.textContent.search(/(\d+)/) !== -1 )
         {
            countTxt = RegExp.$1;
            count = parseInt10(countTxt);
         }

         var aImg = __TEST__($nth_tag(node,"img"));
         var tInfo = getTroopIndexTitleFromImg(aImg);

         var contract = scanCommonContractInfo(node);

         var inputNode = __TEST__($nth_tag(node,"input"));
         var countContract = parseInt10(inputNode.value);
         var setMaxNode = __TEST__($xf("./following-sibling::a", 'f', inputNode, aDoc));

         if ( isIntValid(count) && inputNode && setMaxNode && contract )
         {
            contract.contractNode = node;
            contract.tInfo = tInfo;
            contract.countNode = countNode;
            contract.count = count;
            contract.countTxt = countTxt;
            contract.countContract = ( isIntValid(countContract) ) ? countContract : 0;
            contract.inputNode = inputNode;
            contract.setMaxNode = setMaxNode;
         }
         else
         {
            contract = null;
         }
      }
      catch(e)
      {
         __DUMP_EXCEPTION__(e)
         contract = null;
      }
      return contract;
   }

   __ENTER__
   var xi;
   var contracts = [];
   var contractNodes = $xf(getTrainingBlockPath() + "//div[" + $xClass('details') + "]", 'l', aDoc, aDoc);
   forEach(contractNodes, 
      function (item) 
      { 
         var contract = scanContract(item); 
         if ( contract ) { contract.contractNo = contracts.push(contract)-1; }
      });

   __EXIT__

   return contracts;
}

//////////////////////////////////////////////////////////////////////
function uiModifyTrainingContractLayout(trainingContract)
{
   var t,c;
   insertAfter(trainingContract.setMaxNode,
      t = $t(['class','tbInject tbTrainContract'],
         $r(null,[
            c = $td(['class','tbOrg']),
            trainingContract.quickPadContainer = $td(['class','tbContainer'])
         ])
      )
   );
   moveElement(trainingContract.inputNode.previousElementSibling, c);
   moveElement(trainingContract.inputNode, c);
   moveElement(trainingContract.setMaxNode.previousElementSibling, c);
   moveElement(trainingContract.setMaxNode, c);

   //Remove original options
   hide(trainingContract.setMaxNode);
}

