/////////////////////////////////////////////////////////////////////
function uiModifySideBars()
{
   function uiModifyDirectLinkButton(button, gid)
   {
      function uiCreateTriPTooltip()
      {
         var aTb = $t();
         aTb.id = 'tb_BiPTM';
         var trainingInfoColl = {}; 
         trainingInfoColl[gid] = TB3O.VillagesTrInfo.load(TB3O.ActiveVillageId)[gid]; // restrict collection to this building only
         uiFillTriPTable(aTb, TB3O.ActiveVillageInfo, trainingInfoColl);
         return ( aTb.hasChildNodes() ) ? aTb : null;
      }

      if ( button )
      {
         var cls = button.className.replace("gold","green").replace("Black","White");
         button.className = cls;
         button.removeAttribute('id');
         if ( cls.indexOf('disabled') === -1 )
         {
            button.title = T('BN_GID' + gid);
            button.onclick = function () { window.location = TB_MAKE_URL(gid="+gid+"); }
            if ( canBuildingTrainUnits(gid) )
            {
               uiAddTooltip(button, uiCreateTriPTooltip);
            }
         }
      }
   }

   if ( TB3O.ServerInfo.version > 4.0 )
   {
      uiModifyDirectLinkButton(document.querySelector(".workshopBlack"),GID_WORKSHOP);
      uiModifyDirectLinkButton(document.querySelector(".stableBlack"),GID_STABLE);
      uiModifyDirectLinkButton(document.querySelector(".barracksBlack"),GID_BARRACKS);
      uiModifyDirectLinkButton(document.querySelector(".marketBlack"),GID_MARKETPLACE);
   }
}
