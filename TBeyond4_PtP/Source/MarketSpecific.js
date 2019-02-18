//////////////////////////////////////////////////////////////////////
// only for new style market layout since Dinah mod
function detectMarketPage()
{
   __ENTER__
   var menu = searchAndParseSubMenu();
   if ( menu ) 
   {
      var url = parseUri(menu.items[menu.active][1]);
      if ( url.queryKey.hasOwnProperty("t") )
      {
         var t = url.queryKey.t
         TB3O.pageSelector = ifEqual(t, "0", "market_routes",
                                        "1", "market_buy",
                                        "2", "market_offer",
                                        "5", "market_send",   "");

         if ( TB3O.pageSelector === "market_routes" && isSomeOf(crtUrl.queryKey.option,"1","2") )
         {
            TB3O.pageSelector += "_edit";
         }

         if ( TB3O.pageSelector !== "" ) { TB3O.ServerInfo.features.new_market_style = true; }
      }
   }

   if ( TB3O.pageSelector === "market_send" )
   {
      if ( !($xf("//form[@action='build.php' and @name='snd']") &&
             $xf("//input[@type='Text']|//input[@type='text']", 'l').snapshotLength >= 5 ) )
      {
         __LOG__(3,"INVALID MARKET SEND PREREQUISITES")
         TB3O.pageSelector = ""; 
      }
   } 
   else if ( TB3O.pageSelector === "market_offer" )
   {
      if ( !($xf("//form[@action='build.php' and contains(@class,'sell_resources')]") &&
             $xf("//input[@type='hidden' and @name='t' and @value='2']")) )
      {
         __LOG__(3,"INVALID MARKET OFFER PREREQUISITES")
         TB3O.pageSelector = ""; 
      }
   }

   if ( TB3O.pageSelector !== "" )
   {
      // ensure valid value for merchants capacity (need for all market pages)
      if ( !isIntValid(TB3O.ActiveVillageInfo.mCap) )
      {
         TB3O.ActiveVillageInfo.mCap = TB3O.DefaultMerchantsCapacity[getVillageRace(TB3O.ActiveVillageInfo)] 
                                       * TB3O.nMerchantCapacityFactor[TB3O.nServerType];
      }
   }

   __EXIT__

   return TB3O.pageSelector !== "";
}

//////////////////////////////////////////////////////////////////////
function searchMarketSendResTable()
{
   return __TEST__($g("send_select")); 
}

//////////////////////////////////////////////////////////////////////
function searchMerchantsCountContainer()
{
   return __TEST__($xf("//div[contains(@class,'traderCount')]/div[contains(@class,'boxes-contents')]"));
}

//////////////////////////////////////////////////////////////////////
function searchMerchantsRepeatCount()
{
   return __TEST__($xf("//*[@name='x2']"));
}

//////////////////////////////////////////////////////////////////////
function searchMerchantsDestinationContainer()
{
   return __TEST__($xf("//div[contains(@class,'destination')]//div[contains(@class,'boxes-contents')]"));
}

//////////////////////////////////////////////////////////////////////
// Read and return information about all merchants underway
// Return MerchantsUnderwayInfo object with parsed info or null if info can't be collected successfully.
// If bReadOnly = false then assign id for all merchant tables and 
//  store additional info about UI elements in MerchantsUnderwayDOMInfo
function getMerchantsUnderway(villageId, aDoc, ttServer, bReadOnly)
{
   __ENTER__
   var merchantsUnderwayInfo = new MerchantsUnderwayInfo();
   var merchantGroups = $xf("//div[@id='build' and contains(@class,'gid17')]//h4", 'r');

   if ( !bReadOnly ) { MerchantsUnderwayDOMInfo.reset(); }

   try
   {
      if ( merchantGroups.snapshotLength !== 0 )
      {
         var villageInfo = TB3O.VillagesInfo[villageId];
         var firstGroup = merchantGroups.snapshotItem(0);
         var firstGroupTitle = trimWhitespaces(firstGroup.textContent);
         
         //2 groups: 1st is arriving mercs, 2nd is own mercs
         if ( merchantGroups.snapshotLength === 2 ) 
         {
            getMerchantsUnderwayGroup(merchantsUnderwayInfo, villageInfo, aDoc, firstGroup, true, ttServer, bReadOnly);
            getMerchantsUnderwayGroup(merchantsUnderwayInfo, villageInfo, aDoc, merchantGroups.snapshotItem(1), false, ttServer, bReadOnly);

            persistence.saveValue(TB3O.lng, "mgroups", [firstGroupTitle,trimWhitespaces(merchantGroups.snapshotItem(1).textContent)]);
         }
         else // one group, try to determine
         {
            var bIncoming;
            var groupsTitles;

            // if all merchants available - then there is only incoming merchants group
            if ( TB3O.MerchantsInfo.mTotal && TB3O.MerchantsInfo.mAvail === TB3O.MerchantsInfo.mTotal )
            {
               bIncoming = true;
            }
            else
            {
               // check labels if present
               groupsTitles = persistence.loadValue(TB3O.lng, "mgroups");
               if ( groupsTitles && groupsTitles instanceof Array && groupsTitles.length === 2 )
               {
                  if ( firstGroupTitle === groupsTitles[0] ) { bIncoming = true; }
                  else if ( firstGroupTitle === groupsTitles[1] ) { bIncoming = false; }
                  else if ( groupsTitles[0] === null && groupsTitles[1] !== null ) { bIncoming = true; }
                  else if ( groupsTitles[0] !== null && groupsTitles[1] === null ) { bIncoming = false; }
                  else { persistence.drop(TB3O.lng, "mgroups"); groupsTitles = null; }
               }
               else { groupsTitles = null; }
            }

            __DUMP__(bIncoming,groupsTitles)

            // if bIncoming is undefined then try read as is
            getMerchantsUnderwayGroup(merchantsUnderwayInfo, villageInfo, aDoc, firstGroup, bIncoming, ttServer, bReadOnly);

            if ( bIncoming === undefined )
            {
               // if detect one or more returning merchants then "Own merchants underway" group present,
               // all information read properly
               if ( merchantsUnderwayInfo.r.length > 0 ) { bIncoming = false; }
            }

            /* after latest changes in Travian next code not work
            if ( bIncoming === undefined )
            {
               // last try, check merchants owners
               var xi;
               for ( xi = 0; xi < merchantsUnderwayInfo.o.length; ++xi )
               {
                  if ( merchantsUnderwayInfo.o[xi].own_id != TB3O.UserID )
                  {
                     bIncoming = true;
                     break;
                  }
               }
            }
            */

            if ( bIncoming === undefined )
            {
               merchantsUnderwayInfo = null;
            }
            else
            {
               if ( !groupsTitles )
               {
                  persistence.saveValue(TB3O.lng, "mgroups", ( bIncoming ) ? [firstGroupTitle,null] : [null,firstGroupTitle] );
               }
            }
         }
      }

      if ( merchantsUnderwayInfo ) 
      { 
         merchantsUnderwayInfo.ttUpd = ttServer; 
         __DUMP__(merchantsUnderwayInfo)
      }
   }
   catch(e)
   {
      __DUMP__(e)
      merchantsUnderwayInfo = null;
   }
   __EXIT__

   return merchantsUnderwayInfo;
}


//////////////////////////////////////////////////////////////////////
function uiModifyMarketSendLayout(resTb,mercContainer)
{
   if ( TB3O.ServerInfo.features.new_market_style )
   {
      if ( resTb.rows.length > 4 ) { resTb.rows[4].style.display = "none";  }
      if ( resTb.rows.length > 5 ) { resTb.rows[5].style.display = "none";  }
   }
}

//////////////////////////////////////////////////////////////////////
function searchMarketOfferMerchantsCountContainer()
{
   return searchMerchantsCountContainer();
}

//////////////////////////////////////////////////////////////////////
function searchMarketOfferFormItems()
{
   var names = ["m1", "m2", "rid1", "rid2", "d1", "d2", "ally"];
   var items = { };

   var i;
   var forms = $xf("//form[@action='build.php' and contains(@class,'sell_resources')]",'l');

   for ( i = 0; i < forms.snapshotLength; i++)
   {
      var f = forms.snapshotItem(i);
      var style = window.getComputedStyle(f,null);

      __DUMP__(style.display)
      if ( style.display !== "none" )
      {
         items.form = f;
         for ( i = 0; i < names.length; i++) 
         {
            items[names[i]] = __TEST__($xf(".//*[@name='"+names[i]+"']",'f',f));
         }
         items.button = __TEST__($xf(".//button[@type='submit']",'f',f));
         items.optable = __TEST__($xf(".//*[@id='sell']/tbody",'f',f));
         items.optable_cols = 3;
      }
   }

   return items;
}

//////////////////////////////////////////////////////////////////////
function uiModifyMarketOfferOverview()
{
}
