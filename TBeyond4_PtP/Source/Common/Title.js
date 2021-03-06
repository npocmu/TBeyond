//////////////////////////////////////////////////////////////////////
// change the browser title, get active village coords 
// and coords for the cell/oasis/village opened from the map
function uiModifyBrowserTitle()
{
   __ENTER__

   var crtLocTitle = "", title;
   var strXY = formatCoords(TB3O.xCrt,TB3O.yCrt);
   var vname = "[" + TB3O.ActiveVillageInfo.name + "]";

   var aNode;

   if ( crtUrl.queryKey.newdid !== undefined )
   {
      crtLocTitle += vname + " ";
   }

   if ( TB3O.pageSelector === "dorf3" )
   {
      crtLocTitle += T("ALDEAS") + " " + strXY;
   }
   else
   {
      aNode = $qf("h1");

      if ( aNode )
      {
         title = removeInvisibleChars(trimWhitespaces(aNode.textContent));
      }
      else
      {
         aNode = $qf("#navigation .active");
         if ( aNode )
         {
            title = aNode.title.split("||")[0];
         }
      }

      __ASSERT__(title, "Can't find title for page");

      if ( isStrValid(title) )
      {
         crtLocTitle += title;

         // if present no coords in title then add current coordinates)
         if ( title.search(/\(.*\d+.*[|].*\d+.*\)/) === -1 )
         {
            crtLocTitle += " " + strXY;
         }
      }
   }

   //change browser title
   __DUMP__(crtLocTitle,strXY)

   if ( crtLocTitle.length > 0 )
   {
      TB3O.crtBrT = trimBlanks(crtLocTitle);
      document.title = TB3O.origBrT + " - " + TB3O.crtBrT;
   }

   __EXIT__
}
