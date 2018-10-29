/////////////////////////////////////////////////////////////////////
/*
MerchantUnderwayDOMInfo
{
   id:     string    - DOM id for table with info about route
}
*/
function MerchantUnderwayDOMInfo(id)
{
   this.id  = id; 
   return this;
}

/////////////////////////////////////////////////////////////////////
/*
   Local info about marketplace 'Send' page. Not persistent.
*/
var MerchantsUnderwayDOMInfo = (function () 
{
   // counter for assign new id for merchant tables
   var nextid_counter = 0;

   // map for MerchantUnderwayInfo --> MerchantUnderwayDOMInfo
   var mapToUI = new Map();      

   function reset() 
   {
      nextid_counter = 0; 
      mapToUI.clear();
   }

   function generateId() 
   {
      return "tb_mu_" + nextid_counter++; 
   }

   function associate(merchantUnderwayInfo, merchantUnderwayDOMInfo) 
   {
      mapToUI.set(merchantUnderwayInfo, merchantUnderwayDOMInfo);
   }

   function getDOMInfo(merchantUnderwayInfo) 
   {
      return mapToUI.get(merchantUnderwayInfo);
   }

   function getId(merchantUnderwayInfo) 
   {
      var id;
      var merchantUnderwayDOMInfo = getDOMInfo(merchantUnderwayInfo);
      if ( merchantUnderwayDOMInfo )
      {
         id =  merchantUnderwayDOMInfo.id;
      }
      return id;
   }

   return {
      'reset':      reset,
      'generateId': generateId,
      'associate':  associate,
      'getDOMInfo': getDOMInfo,
      'getId':      getId
   };
})();

