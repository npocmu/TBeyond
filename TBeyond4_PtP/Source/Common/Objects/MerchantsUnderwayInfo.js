/////////////////////////////////////////////////////////////////////
/*
MerchantUnderwayInfo
{
   Res:       array[4]  - resources carrying
   ttArrival: number    - server timestamp for merchant arrival

   s_id:      number    - id of map source cell
   d_id:      number    - id of map destination cell

   xn:        number    - number of sheduled routes

   own_id:    number    - user ID for merchant owner
   rec_id:    number    - user ID for merchant recepient

   own_n:     string    - user name for merchant owner
   rec_n:     string    - user name for merchant recepient

   (*)id:     string    - DOM id for table with info about route (optional)
}
*/
function MerchantUnderwayInfo(ownerId, ownerName, recepientId, recepientName,
                              srcMapId, destMapId, ttArrival, res, xn)
{
   this.Res  = res; 
   this.ttArrival = ttArrival;

   this.s_id = srcMapId;  
   this.d_id = destMapId; 

   this.xn = xn;       

   this.own_id = ownerId; 
   this.rec_id = recepientId; 

   this.own_n = ownerName; 
   this.rec_n = recepientName; 

   return this;
}

/////////////////////////////////////////////////////////////////////
function MerchantsUnderwayInfo()
{
   this.i = []; // incoming merchants
   this.o = []; // outgoing merchants
   this.r = []; // returning merchants

   this.ttUpd = undefined; // date of information update (server timestamp when marketplace last visited)

   return this;
}

