//////////////////////////////////////////////////////////////////////
function Overview(aDoc)
{
   this.origT = __TEST__({{$xf1("//div[@id='" + ID_CONTENT + "']//table[@id='overview' or @id='ressources' or @id='warehouse' or @id='culture_points' or @id='troops' or @class='vil_troops']",'a',aDoc,aDoc)}});
   this.secRowText = [];
   this.plAc = false;

   this.menu = searchAndParseSubMenu(aDoc);
   if ( this.menu )
   {
      this.plAc = ( this.menu.countLockedItems() === 0 && this.menu.countLinks() > 1 );
   }

   if ( this.origT.length > 0 )
   {
      this.secRowText = getHeaders(this.origT[0]);
      if ( this.secRowText.length === 0 ) { this.origT = null; } //disable following processing

      __ASSERT__(this.secRowText.length > 0, "Can't parse dorf3 table header!")
   }

   //-------------------------------------------------------------
   function getHeaders(tbl)
   {
      var i;
      var origSecRow = tbl.rows[0].cells;
      var arrSecRow = [];

      for ( i = 0; i < origSecRow.length; i++ )
      {
         arrSecRow[i] = origSecRow[i].textContent;
      }

      return arrSecRow;
   }
}

//////////////////////////////////////////////////////////////////////
Overview.prototype.getTableTitle = function(tabNo)
{
   return null; // Travian 4 not use dorf3 table title
};

//////////////////////////////////////////////////////////////////////
// return column index for merchant info 
Overview.prototype.getMerchantCol = function(tabNo)
{
   var mi = 0;

   if ( this.origT && this.origT.length > 0 )
   {
      switch ( this.origT[0].id )
      {
         case "overview":   mi = 4; break;
         case "ressources": mi = 5; break;
      }
   }

   __ASSERT__(mi,"can't find merchant info column")
   return mi;
};

//////////////////////////////////////////////////////////////////////
Overview.prototype.setActiveTab = function(tabNo)
{
   this.menu.active = tabNo - 1;
   this.menu.uiModify();
};
