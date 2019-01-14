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
   return __TEST__($g("reportWrapper"));
}

//////////////////////////////////////////////////////////////////////
function uiSelectAllMsgRpt(mrTable)
{
   var inputElem = __TEST__($g("sAll") || $g("sAll1"));
   if ( inputElem )
   {
      inputElem.click();
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
            location.href = navLinks.snapshotItem(i).getAttribute("href");
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
