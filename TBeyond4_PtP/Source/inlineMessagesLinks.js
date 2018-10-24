//////////////////////////////////////////////////////////////////////
function insertMsgRptPopupLink(aNode)
{
   var unreadMessageMark = null;
   var unreadMarkContainer = null;

   if ( !hasClass(aNode.parentNode,"navi") )
   {
      var aBt = uiCreateTool("imgo", T("REPTT"), onClick);
      $at(aBt, [['class','tbInject tbMsgPop']]);

      var reportSubjCell = $xf("./ancestor::td[1][" + $xClass('sub') + " or " + $xClass('lastRaid') + "]", 'f', aNode, document);

      if ( reportSubjCell ) 
      { 
         insertFirst(reportSubjCell, aBt);
      }
      else
      {
         insertAfter(aNode, aBt);
      }
   }

   function onClick(e)
   {
      if ( isSomeOf(TB3O.pageSelector, "message_list", "report_list") )
      {
         var mrTable = searchMsgRptTable();
         if ( mrTable && hasAncestor(aNode, mrTable) )
         {
            uiRemoveMsgRptHighlight(mrTable);
            uiSetMsgRptHighlight(aNode);

            unreadMessageMark = __TEST__({{$xf("./ancestor::td[1]//*[contains(@class,'messageStatus')]", 'f', aNode, document)}});
            if ( !unreadMessageMark )
            {
               unreadMarkContainer = aNode.parentNode;
            }
         }
      }

      ajaxLoadDocument(aNode.href, uiCreateMsgRptPopup);
   }

   function uiCreateMsgRptPopup(aDoc)
   {
      __ENTER__
      var msgNode = __TEST__($g(ID_CONTENT, aDoc, aDoc));
      if ( msgNode )
      {
         var unnecessaryNodes = $xf("./*[not(@id='reportWrapper' or @class='paper')]", 'l', msgNode, aDoc );

         var i;
         for ( i = 0; i < unnecessaryNodes.snapshotLength; i++ )
         {
            unnecessaryNodes.snapshotItem(i).style.display = "none";
         }

         if ( unreadMessageMark ) { addClass(unreadMessageMark,"messageStatusRead"); }

         // remove (new) text
         if ( unreadMarkContainer )
         {
            var tCol = $xf("./text()", 'l', unreadMarkContainer); 
            for ( i = 0; i < tCol.snapshotLength; i++ )
            {
               removeElement(tCol.snapshotItem(i));
            }
         }

         document.adoptNode(msgNode);
         removeElement($g("mr_tooltip"));
         var dW = ( msgNode.className === "reports") ? (( TB3O.ServerInfo.version > 4.0 ) ? 579 : 551 ) : 581;
         var dxy = TBO_MSGPOPUP_XY.split("|");
         $df(dW, dxy[0], dxy[1], '', '', "mr_tooltip", false, msgNode);

         //process message
         uiModifyMessage(true);
         uiModifyReport(true);
         uiModifyLinks(msgNode,{ add_send_troops2:true } );
         if ( TBO_SHOW_TROOP_INFO_TOOLTIPS === "1" ) { uiAddTroopInfoTooltips(msgNode); }
      }
      __EXIT__
   }
}
