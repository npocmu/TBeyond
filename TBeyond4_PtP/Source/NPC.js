//////////////////////////////////////////////////////////////////////
function uiOpenNPCAssistantDialog(cost /*opt*/)
{
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

   var triggerParam = 
   [
      null,
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
   ];

   var clonedParam = (typeof(cloneInto) === "function") ? cloneInto(triggerParam, window.wrappedJSObject) : triggerParam;

   window.wrappedJSObject.jQuery(window).trigger('buttonClicked', clonedParam);
}
