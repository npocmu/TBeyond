//////////////////////////////////////////////////////////////////////
function searchMsgRptTable(aDoc)
{
   var mrTable = $g("overview", aDoc);
   __ASSERT__(mrTable,"Can't find messages/report table")

   return mrTable;
}

//////////////////////////////////////////////////////////////////////
function searchMsgBody(aDoc)
{
   return __TEST__($g("message", aDoc));
}

//////////////////////////////////////////////////////////////////////
function searchRptBody() 
{
   return __TEST__($g("report_surround"));
}

//////////////////////////////////////////////////////////////////////
function uiSelectAllMsgRpt(mrTable)
{
   var inputElem = $g("sAll");
   inputElem.click();
}

//////////////////////////////////////////////////////////////////////
function uiAddSelectAllCheckbox(mrTable)
{
   // GotGs -- 2011.04.15 -- adding select all for messages and reports
   function toggleAllMsg()
   {
      var inputElem = $g("sAll");
      var allInputElems = $xf('./tbody/tr/td[@class="sel"]/input[@class="check"]', 'l', mrTable);
      var ctr;
      for ( ctr = 0; ctr < allInputElems.snapshotLength; ctr++ )
      {
         allInputElems.snapshotItem(ctr).checked = inputElem.checked;
      }
   }

   //check for the "sAll" element to avoid double checkbox
   if ( !$g("sAll") )
   {
      if ( $xf('./tbody/tr/td[@class="sel"]/input[@class="check"]', 'f', mrTable) )
      {
         //selectAll
         insertFirst(mrTable.nextElementSibling,
           $div([['id','markAll'],['class','checkAll tbInject']],[
              $i([['id','sAll'], ['name','sAll'],['class','check'], ['type','checkbox'], 
                  ['click', toggleAllMsg, false]]),
              $span($e("label", ['for','sAll'], T('SELECTALL')))])
         );
      }
   }
}

//////////////////////////////////////////////////////////////////////
// Add features:
// - navigate between pages with:
//    CTRL + <- (prev page) and CTRL + -> (next page)
//    CTRL + Home (first page) and CTRL + End (last page)
function uiAddKeyboardNavigation()
{
   var navLinks;

   function navToPage(cls)
   {
      var i;
      for (i = 0; i < navLinks.snapshotLength; i++)
      {
         if ( hasClass(navLinks.snapshotItem(i), cls) ) 
         {
            location.href = navLinks.snapshotItem(i).href;
            break;
         }
      }
   }

   function onKeyDown(event)
   {
      if ( event.ctrlKey )
      {
         switch (event.keyCode)
         {
            case 35: navToPage("last"); break;
            case 36: navToPage("first"); break;
            case 37: navToPage("previous"); break;
            case 39: navToPage("next"); break;
         }
      }
   }

   navLinks = searchNavigationLinks();
   if ( navLinks.snapshotLength > 0 ) { document.addEventListener("keydown", onKeyDown, false); }
}


//////////////////////////////////////////////////////////////////////
function navigateNextRptPage()
{
   nextLink = $xf("//div[@id='" + ID_CONTENT + "']//a[contains(@href, 'page=') and contains(@class, 'next')]");
   if ( nextLink )
   {
      location.href = nextLink;
      return true;
   }
   return false;
}
