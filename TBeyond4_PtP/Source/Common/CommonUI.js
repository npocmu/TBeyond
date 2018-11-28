//////////////////////////////////////////////////////////////////////
function $df(dWidth, posX, posY, strTitle, sCookieN, divID, boolShowMinMax, content)
{
   var wCMM = 25;
   var iPx = parseInt10(posX);
   if (iPx < -dWidth/2) iPx = -dWidth/2;
   var iPy = parseInt10(posY);
   if (iPy < -dWidth/2) iPy = -dWidth/2;

   if (boolShowMinMax === true) wCMM *= 2;
   var fDiv = $div([['id', divID], ['class', 'fldiv'], ['style', 'width:' + dWidth + 'px; top:' + iPy + 'px; left:' + iPx + 'px; -moz-border-radius:5px;border-radius:5px;']]);
   if (strTitle === '?') strTitle = "<img src='" + image["search"] + "'</img>";
   var dragDiv = $div([['id', 'dragDiv_' + sCookieN], ['class', 'dragdiv'], ['style', 'width:' + (dWidth - wCMM) + 'px;']], strTitle);

   if (boolShowMinMax === true)
   {
      var xi = 70;
      switch (sCookieN)
      {
         case "resbar":        xi = 70;  break;
         case "userbookmarks": xi = 71;  break;
         case "noteblock":     xi = 72;  break;
         case "vl2table":      xi = 73;  break;
         case "searchbar":     xi = 74;  break;
      }
      var mmDiv = $div([['id', 'mmdiv_' + sCookieN], ['class', 'mmdiv']]);
      var strImgMM = (TB3O.O[xi] === '0' ? 'bMax' : 'bMin');
      mmDiv.appendChild(uiCreateTool(strImgMM,T(TB3O.O[xi] === '0' ? 'WMAX' : 'WMIN'),minmaxDiv));
   }

   var closeDiv = $div(['class', 'closediv'], uiCreateTool_Close(fcloseDiv));
   makeDraggable(fDiv, dragDiv);
   fDiv.appendChild(dragDiv);
   if ( mmDiv ) fDiv.appendChild(mmDiv);
   fDiv.appendChild(closeDiv);
   document.body.appendChild(fDiv);
   if ( content ) 
   {
      fDiv.appendChild(content);
      adjustFloatDiv(content, dWidth-1, sCookieN);
      //setTimeout(bind(adjustFloatDiv,[content, dWidth, sCookieN]), 0);
   }
   return fDiv;

   function minmaxDiv()
   {
      removeElement($g(divID));
      switch (sCookieN)
      {
         case "resbar":
            TB3O.O[70] = (TB3O.O[70] == '0' ? '1' : '0');
            uiCreateResBarWidget();
            break;
         case "userbookmarks":
            TB3O.O[71] = (TB3O.O[71] == '0' ? '1' : '0');
            showUserBookmarks();
            break;
         case "noteblock":
            TB3O.O[72] = (TB3O.O[72] == '0' ? '1' : '0');
            showNoteBlock();
            break;
         case "vl2table":
            TB3O.O[73] = (TB3O.O[73] == '0' ? '1' : '0');
            uiCreate2ndVillageListWidget();
            break;
         case "searchbar":
            TB3O.O[74] = (TB3O.O[74] == '0' ? '1' : '0');
            uiCreateSearchBarWidget();
            break;
      }
      saveTBOptions();
   }

   function fcloseDiv()
   {
      $g(divID).style.display = "none";
      switch (sCookieN)
      {
         case "resbar":        TBO_SHOW_RESBARTABLE = '0'; break;
         case "userbookmarks": TBO_SHOW_BOOKMARKS = '0'; break;
         case "noteblock":     TBO_SHOW_NOTEBLOCK = '0'; break;
         case "vl2table":      TBO_SHOW_VL2TABLE = '0'; break;
         case "searchbar":     TBO_SHOW_SEARCHBAR = '0'; break;
         case "resupg":        TBO_SHOW_RESUPGTABLE = '0'; break;
         case "bupg":          TBO_SHOW_BLDUPGTABLE = '0'; break;
         case "mapTable":      TBO_SHOW_NEIGHBORHOODTABLE = '0'; break;
      }
      saveTBOptions();
   }
}

//////////////////////////////////////////////////////////////////////
function uiFloatWindow_Remove(windowId)
{
   removeElement($g(windowId));
}

//////////////////////////////////////////////////////////////////////
function uiFloatWindow_SetContent(windowId, content)
{
}

//////////////////////////////////////////////////////////////////////
function adjustFloatDiv(theTB, xmin, idDrag)
{
   var wCMM,dragDiv;

   if ( xmin < theTB.offsetWidth ) { xmin = theTB.offsetWidth; }

   if ( parseInt10(theTB.parentNode.style.width) !== xmin )
   {
      __LOG__(3,"Need to adjust float div: width old=" + theTB.parentNode.style.width + ", req width="+xmin)
      theTB.parentNode.style.width = xmin + 'px';

      dragDiv = $g('dragDiv_' + idDrag);
      if ( dragDiv ) 
      {
         wCMM = 25;
         if ( $g('mmdiv_' + idDrag) ) { wCMM *= 2; }
         dragDiv.style.width = (xmin - wCMM) + 'px';
      }
   }

   return;
}
