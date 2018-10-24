//////////////////////////////////////////////////////////////////////
function uiModifyMsgBody(msg)
{
   //-----------------------------------------------------------------
   function replaceTextByRE(txtNode, re, freplace)
   {
      var str = txtNode.nodeValue;
      var prevLastIndex = 0;
      var children = [];
      var result;

      while ( (result = re.exec(str)) !== null ) 
      {
         if ( result.index > prevLastIndex )
         {
            children.push(str.substring(prevLastIndex,result.index));
         }
         prevLastIndex = re.lastIndex;
         var replacement = freplace(result[0]);
         if ( replacement )
         {
            children.push(replacement);
         }
         else
         {
            children.push(str.substring(result.index,re.lastIndex));
         }

      }
      var tail = str.substring(prevLastIndex);
      if ( tail ) { children.push(tail); }

      replaceElement(txtNode, children);
   }

   //-----------------------------------------------------------------
   function replaceCoordsWithLink(txt)
   {
      var aLink = null;
      var txy = txt.replace(/ /g, "").replace(/[,\/\\]/, "|");
      if ( /*txy.indexOf("(") === 0 && txy.indexOf(")") !== -1 &&*/ txy.indexOf("|") !== -1 )
      {
         var xy = txy.replace("(", "").replace(")", "").split("|");
         aLink = uiCreateIntMapLinkXY(xy[0], xy[1], formatCoords(trimBlanks(xy[0]),trimBlanks(xy[1])), {disable_tip:true});
      }
      return aLink;
   }

   //-----------------------------------------------------------------
   function replaceURLWithLink(txt)
   {
     return $lnk([attrInject$,['href',txt],['target','_blank']],txt);
   }

   //-----------------------------------------------------------------
   function processMessageText(msg, re, freplace)
   {
      var texts = $xf(".//text()", 'l', msg);
      var i;
      for ( i = 0; i < texts.snapshotLength; ++i )
      {
         var txtNode = texts.snapshotItem(i);
         if ( TAG(txtNode.parentNode) !== "A" ) 
         {
            replaceTextByRE(txtNode, re, freplace);
         }
      }
   }

   //var reCoords = /\(?\s*(-?\d+)\s*[\|\,\s\/\\]\s*(-?\d+)\s*\)?/g;
   var reCoords = /(\(\s*(-?\d+)\s*[\|\,\s\/\\]\s*(-?\d+)\s*\))|((?=\b)(-?\d+)\s*[\|\,\s\/\\]\s*(-?\d+)(?=\b))/g;
   processMessageText(msg, reCoords, replaceCoordsWithLink);

   var reURL = /\w+:\/\/[\w-]+([.][\w-]+)+(\/\S*)?/g;
   processMessageText(msg, reURL, replaceURLWithLink);
}

//////////////////////////////////////////////////////////////////////
function getMsgRptHighlight(mrTable)
{
   return __TEST__($xf(".//tr[contains(@class,'tbSelected')]"));
}

//////////////////////////////////////////////////////////////////////
function uiRemoveMsgRptHighlight(mrTable)
{
   var i;
   for( i = 0; i < mrTable.rows.length; ++i )
   {
     delClass(mrTable.rows[i],"tbSelected");
   }
}

//////////////////////////////////////////////////////////////////////
function uiSetMsgRptHighlight(aNode)
{
   var tr = __TEST__($xf(".//ancestor::tr[1]", 'f', aNode));
   if ( tr ) { addClass(tr,"tbSelected"); }
}

//////////////////////////////////////////////////////////////////////
function uiSetMsgRptCheck(aNode,state)
{
   var input = __TEST__($xf(".//ancestor::tr[1]/td[@class='sel']/input[@class='check']", 'f', aNode));
   if ( input ) { input.checked = state; }
}


//////////////////////////////////////////////////////////////////////
// stop "Delete all" reports if the user changed the page
function clearReportDeletingState()
{
   var options = loadPersistentUserObject("reports_delete");

   if ( options.deleteType )
   {
      savePersistentUserObject("reports_delete", {});
   }  	
}

//////////////////////////////////////////////////////////////////////
function uiCreateDelRepTable(menu, mrTable)
{
   function onDeleteReports(tabNo, delType)
   {
      savePersistentUserObject("reports_delete", {pageToReturn: crtUrl.source, deleteType: delType, activeTab: tabNo, tabToReturn: menu.active });

      if ( menu.active === tabNo )
      {
         deleteReports(menu.active, mrTable);
      }
      else
      {
         location.href = menu.items[tabNo][1];
      }
   }

   var delToolsArr = 
                   [
                      // DeleteType,         TipIndex,    TabNo
            IIF_TB4({{["messageStatusRead", "REPREAD_TT",0],}})
                      ["iReport1",          "REP1_TT",   IIF_TB4(1,3)],
                      ["iReport4",          "REP4_TT",   IIF_TB4(1,3)],
                      ["iReport8",          "REP8_TT",   IIF_TB4(1,2)],
                      ["iReport11",         "REP11_TT",  IIF_TB4(2,1)],
                      ["iReport12",         "REP12_TT",  IIF_TB4(2,1)],
                      ["iReport13",         "REP13_TT",  IIF_TB4(2,1)],
                      ["iReport14",         "REP14_TT",  IIF_TB4(2,1)],
            IIF_TB4({{["iReport21",         "REP21_TT",  3]}})
                   ];
   var menuItems = menu.items;
   var iMax = IIF_TB4(4,(menuItems.length > 5 ? 5 : menuItems.length));

   var bRow, cRow, cCell, i, j;
   var delTb = $t(['id', 'tb_delreptable'],
               [
                  $e("thead", null, $th(['colspan', iMax], T('DEL'))),
                  bRow = $r(['class', 'r1']),
                  cRow = $r(['class', 'r2'])
               ]);

   for ( i = 0; i < iMax; i++ )
   {
      var bTitle = menuItems[i][0];
      bRow.appendChild($td(null, [bTitle + " ",uiCreateTool("bDel", T('DEL') + " " + bTitle, bind(onDeleteReports,[i,"$all"]))]));
      cRow.appendChild(cCell = $td());
      for ( j = 0; j < delToolsArr.length; ++j )
      {
         var delTool = delToolsArr[j];
         if ( delTool[2] === i )
         {
            cCell.appendChild(uiCreateTool(delTool[0], 
                                           T('DEL') + " " + T(delTool[1]), 
                                           bind(onDeleteReports,[delTool[2],delTool[0]])));
         }
      }
   }
   return delTb;
}

//////////////////////////////////////////////////////////////////////
function isMsgRptListEmpty(mrTable)
{
   return !$xf(".//input[@type='checkbox' and not (@id)]", 'f', mrTable)
}

//////////////////////////////////////////////////////////////////////
function deleteReports(activeTab, mrTable)
{
   function stop()
   {
      savePersistentUserObject("reports_delete", {});
      if ( activeTab !== options.tabToReturn )
      {
         location.href = options.pageToReturn;
      }
   }

   __ENTER__
   var options = loadPersistentUserObject("reports_delete");

   if ( options.deleteType )
   {
      if ( activeTab === options.activeTab )
      {
         pauseScript(TB3O.Timeouts.reports_delete);
         var bDel = $g(IIF_TB4("del","btn_delete"));

         if ( !isMsgRptListEmpty(mrTable) && bDel )
         {
            var bFounded = false;
            if ( options.deleteType === "$all" )
            {
               uiSelectAllMsgRpt(mrTable);
               bFounded = true;
            }
            else
            {
               var i;
               var tbR = mrTable.getElementsByTagName('img');
               for ( i = 0; i < tbR.length; i++ )
               {
                  if ( hasAnyClass(tbR[i], options.deleteType) )
                  {
                     bFounded = true;
                     uiSetMsgRptCheck(tbR[i],true);
                  }
               }
               if ( !bFounded )
               {
                  pauseScript(TB3O.Timeouts.reports_search);
                  if ( !navigateNextRptPage() )
                  {
                     stop();
                  }
               }
            }

            if ( bFounded )
            {
               pauseScript(TB3O.Timeouts.reports_delete);
               bDel.click();
            }
         }
         else
         {
            stop();
         }
      }
      else { savePersistentUserObject("reports_delete", {}); }
   }
   __EXIT__
}

//////////////////////////////////////////////////////////////////////
function clearReportSearchingState()
{
   var options = loadPersistentUserObject("reports_search");

   if ( options.searchType )
   {
      savePersistentUserObject("reports_search", {});
   }
}

//////////////////////////////////////////////////////////////////////
function uiCreateSearchRepTable(menu, mrTable)
{
   //-----------------------------------------------------------------
   function onSearchReports(tabNo, ser)
   {
      savePersistentUserObject("reports_search", {searchType:ser, activeTab: tabNo});

      var highlight = getMsgRptHighlight(mrTable);
      if ( highlight && menu.active === tabNo )
      {
         uiRemoveMsgRptHighlight(mrTable);
         searchReports(tabNo, mrTable, highlight);
      }
      else
      {
         location.href = menu.items[tabNo][1];
      }
   }

   //-----------------------------------------------------------------
   var sdvs = $div(['id', 'tb_searchreports'], 
   [   
      $span(T("FINDREP") + " : "),
      uiCreateTool("iReport2", T("REP2_TT"), bind(onSearchReports,[IIF_TB4(1,3),"iReport2"])),
      uiCreateTool("iReport3", T("REP3_TT"), bind(onSearchReports,[IIF_TB4(1,3),"iReport3"])),
      uiCreateTool("iReport7", T("REP7_TT"), bind(onSearchReports,[IIF_TB4(1,3),"iReport7"])),
      uiCreateTool("iReport5", T("REP5_TT"), bind(onSearchReports,[IIF_TB4(1,3),"iReport5"])),
      uiCreateTool("iReport6", T("REP6_TT"), bind(onSearchReports,[IIF_TB4(1,3),"iReport6"])),
      uiCreateTool("iReport17",T("REP17_TT"),bind(onSearchReports,[IIF_TB4(3,4),"iReport17"])),
      IIF_TB4(uiCreateTool("iReport21",T("REP21_TT"),bind(onSearchReports,[3,"iReport21"]))),
      $lnk([['href', jsVoid], ['title', T("ALL")], 
            ['click', bind(onSearchReports,[0,"iReport2 iReport3 iReport5 iReport6 iReport7 iReport17 IIF_TB4(iReport21)"]), false]], 
           T("ALL"))
   ]);

   return sdvs;
}	

//////////////////////////////////////////////////////////////////////
function searchReports(activeTab, mrTable, highlight)
{
   __ENTER__
   var options = loadPersistentUserObject("reports_search");

   if ( options.searchType )
   {
      if ( activeTab === options.activeTab )
      {
         var tbR = mrTable.getElementsByTagName('img');
         var i = 0;
         var bFounded = false;

         if ( highlight )
         {
            for ( i = 0; i < tbR.length; i++ ) 
            {
               if ( hasAncestor(tbR[i], highlight) ) { break; }
            }
            ++i;
         }

         for ( ; i < tbR.length; i++ )
         {
            if ( hasAnyClass(tbR[i], options.searchType) )
            {
               bFounded = true;
               savePersistentUserObject("reports_search", {});
               uiSetMsgRptHighlight(tbR[i]);
               break;
            }
         }

         if ( !bFounded )
         {
            pauseScript(TB3O.Timeouts.reports_search);
            if ( !navigateNextRptPage() )
            {
               savePersistentUserObject("reports_search", {});
            }
         }
      }
      else
      {
         savePersistentUserObject("reports_search", {});
      }
   }
   __EXIT__
}


//////////////////////////////////////////////////////////////////////
function MessageListOptions()
{
   //general variables needed for this function
   var mrTable = searchMsgRptTable();
   var subMenu = searchAndParseSubMenu();

   if ( subMenu && mrTable )
   {
      if ( TB3O.pageSelector === "report_list" )
      {
         if ( TBO_SHOW_REP_DEL_TABLE === "1")
         {
            var content = $g(ID_CONTENT);
            var searchTb = uiCreateSearchRepTable(subMenu, mrTable);
            if ( searchTb )
            {
               insertLast(content, searchTb);
            }

            var delTb = uiCreateDelRepTable(subMenu, mrTable);
            if ( delTb )
            {
               insertLast(content, delTb);
            }
         }
         deleteReports(subMenu.active, mrTable);
         searchReports(subMenu.active, mrTable);
      }
   }
}


//////////////////////////////////////////////////////////////////////
function uiModifyMsgRptList()
{
   __ENTER__
   uiAddKeyboardNavigation();
   MessageListOptions();
   __EXIT__
}

//////////////////////////////////////////////////////////////////////
function uiModifyMsgRptMenu()
{
   var subMenu = searchAndParseSubMenu();
   if ( subMenu )
   {
      IF_TB3(uiAddArchiveMenuItem(subMenu.container));
   }
}

//////////////////////////////////////////////////////////////////////
function uiModifyMessage(bPopup)
{
   __ENTER__

   var msgBody = searchMsgBody();
   if ( msgBody )
   {
      uiModifyMsgBody(msgBody);
   }

   __EXIT__
}

//////////////////////////////////////////////////////////////////////
function uiModifyMsgView()
{
   __ENTER__

   uiModifyMsgRptMenu();
   uiModifyMessage();

   __EXIT__
}

//////////////////////////////////////////////////////////////////////
function uiModifyTradeReport(rptBody, bPopup)
{
   var resCell = IIF_TB4($xf(".//*[@id='trade']/tbody/tr[2]/td", 'f', rptBody),
                         $xf(".//*[@id='trade']/tbody/tr/td", 'f', rptBody));
   if ( resCell )
   {
      var Res = getResourcesFromString(getTextContent(resCell));
      if ( Res )
      {
         insertAfter(resCell.lastChild, 
            $span(attrInject$,[
               " = ", I("r0"), " ",
               $e("b", $ls(totalResources(Res)))
            ])); 
      }
   }
}

//////////////////////////////////////////////////////////////////////
function uiModifyReport(bPopup)
{
   __ENTER__
   var rptBody = searchRptBody();
   if ( rptBody )
   {
      uiModifyTradeReport(rptBody, bPopup);
   }
   __EXIT__
}

//////////////////////////////////////////////////////////////////////
function uiModifyRptView()
{
   __ENTER__

   uiModifyMsgRptMenu();
   uiModifyReport();

   __EXIT__
}

//////////////////////////////////////////////////////////////////////
// Add features:
// - sending message by pressing CTRL+ENTER
function uiModifyMsgPost()
{
   __ENTER__
   function sendMessage(event)
   {
      if ( event.keyCode === 13 && event.ctrlKey )
      {
         var mF = __TEST__($xf("//form[@id='messageForm' or @name='msg']"));
         if ( mF ) { mF.submit(); }
      }
   }

   uiModifyMsgRptMenu();

   //code provided by rtellezi for enabling sending message by pressing the CTRL+ENTER keys.
   var msgNode = __TEST__($g("message"));
   if ( msgNode )
   {
      msgNode.addEventListener("keydown", sendMessage, false);
   }
   __EXIT__
}
