//////////////////////////////////////////////////////////////////////
function uiModifyDorf3_TabsHeader(activeTabNo)
{
   if ( !TB3O.Overview.plAc )
   {
      var menu = TB3O.Overview.menu;
      if ( menu )
      {
         var i;
         for ( i = 0; i < menu.items.length; ++i )
         {
            var mitem = menu.items[i];
            //if ( mitem[1] === "" || mitem[2] ) { mitem[1] = getDorf3Url('dorf3.php',i+1); }
            mitem[1] = jsVoid;
            var node = menu.getItemNode(i);
            if ( node ) 
            {
               if ( TB3O.ServerInfo.version > 4.0 )
               {
                  node.title = "";
                  // remove ingame listeners
                  var aLink = $nth_tag(node,"a");
                  var newLink = aLink.cloneNode(true);
                  replaceElement(aLink,newLink);
               }
               node.addEventListener("click", bind(uiSwitchDorf3Tab,[i+1]), false);
            }

            mitem[2] = 0;
         }
         menu.active = activeTabNo - 1;
         menu.uiModify();
      }
   }
}

