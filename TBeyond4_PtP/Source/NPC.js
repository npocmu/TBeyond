//////////////////////////////////////////////////////////////////////
function uiOpenNPCAssistantDialog(cost /*opt*/)
{
   __ENTER__
   var ri;

   var data =
   {
      "cmd": "exchangeResources",
      "defaultValues":{"r1":0,"r2":0,"r3":0,"r4":0,"npc":true},
      "did": TB3O.ActiveVillageId.toString()
   };

   if ( cost )
   {
      for ( ri = 0; ri < 4; ++ri )  
      { 
         data.defaultValues['r'+(ri+1)] = cost[ri];
      }
   }

   __DUMP__(data)

   window.wrappedJSObject.jQuery(window).trigger('buttonClicked',[
      this, 
      {
         "dialog":
         {
            "cssClass":         "white",
            "draggable":        false,
            "overlayCancel":    true,
            "buttonOk":         false,
            "saveOnUnload":     false,
            "preventFormSubmit":true,
            "data":             data
         }
      }
   ]);

   __EXIT__
}
