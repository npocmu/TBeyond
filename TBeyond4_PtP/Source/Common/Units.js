M4_ECHO_OFF
/*////////////////////////////////////////////////////////////////////
uc format:
uc[troopIndex] - array about troop with given index
uc[troopIndex][0]-[3] = Training cost for each unit (lumber, clay, iron, crop)
uc[troopIndex][4]     = load capacity
uc[troopIndex][5]     = attack power
uc[troopIndex][6]     = def power against infantry, 
uc[troopIndex][7]     = def power against cavalry, 
uc[troopIndex][8]     = speed
uc[troopIndex][9]     = crop consumption
////////////////////////////////////////////////////////////////////*/
M4_ECHO_ON

var uc = [];

// Romans
uc[ 1] = [  120,  100,  150,   30,  50,  40,  35,  50,  6, 1]; // Legionnaire
uc[ 2] = [  100,  130,  160,   70,  20,  30,  65,  35,  5, 1]; // Praetorian
uc[ 3] = [  150,  160,  210,   80,  50,  70,  40,  25,  7, 1]; // Imperian
uc[ 4] = [  140,  160,   20,   40,   0,   0,  20,  10, 16, 2]; // Equites legati
uc[ 5] = [  550,  440,  320,  100, 100, 120,  65,  50, 14, 3]; // Equites imperatoris
uc[ 6] = [  550,  640,  800,  180,  70, 180,  80, 105, 10, 4]; // Equites cesaris
uc[ 7] = [  900,  360,  500,   70,   0,  60,  30,  75,  4, 3]; // Battering ram
uc[ 8] = [  950, 1350,  600,   90,   0,  75,  60,  10,  3, 6]; // Fire catapult
uc[ 9] = [30750,27200,45000,37500,   0,  50,  40,  30,  4, 5]; // Senator
uc[10] = [ 4600, 4200, 5800, 4400,3000,   0,  80,  80,  5, 1]; // Settler

// Teutons
uc[11] = [   95,   75,   40,   40,  60,  40,  20,   5,  7, 1]; // Club swinger
uc[12] = [  145,   70,   85,   40,  40,  10,  35,  60,  7, 1]; // Spearman
uc[13] = [  130,  120,  170,   70,  50,  60,  30,  30,  6, 1]; // Axeman
uc[14] = [  160,  100,   50,   50,   0,   0,  10,   5,  9, 1]; // Scout
uc[15] = [  370,  270,  290,   75, 110,  55, 100,  40, 10, 2]; // Paladin
uc[16] = [  450,  515,  480,   80,  80, 150,  50,  75,  9, 3]; // Teutonic knight
uc[17] = [ 1000,  300,  350,   70,   0,  65,  30,  80,  4, 3]; // Ram
uc[18] = [  900, 1200,  600,   60,   0,  50,  60,  10,  3, 6]; // Catapult
uc[19] = [35500,26600,25000,27200,   0,  40,  60,  40,  4, 4]; // Chief
uc[20] = [ 5800, 4400, 4600, 5200,3000,  10,  80,  80,  5, 1]; // Settler

// Gauls
uc[21] = [  100,  130,   55,   30,  35,  15,  40,  50,  7, 1]; // Phalanx
uc[22] = [  140,  150,  185,   60,  45,  65,  35,  20,  6, 1]; // Swordsman
uc[23] = [  170,  150,   20,   40,   0,   0,  20,  10, 17, 2]; // Pathfinder
uc[24] = [  350,  450,  230,   60,  75,  90,  25,  40, 19, 2]; // Theutates thunder
uc[25] = [  360,  330,  280,  120,  35,  45, 115,  55, 16, 2]; // Druidrider
uc[26] = [  500,  620,  675,  170,  65, 140,  60, 165, 13, 3]; // Haeduan
uc[27] = [  950,  555,  330,   75,   0,  50,  30, 105,  4, 3]; // Ram
uc[28] = [  960, 1450,  630,   90,   0,  70,  45,  10,  3, 6]; // Trebuchet
uc[29] = [30750,45400,31000,37500,   0,  40,  50,  50,  5, 4]; // Chieftain
uc[30] = [ 4400, 5600, 4200, 3900,3000,   0,  80,  80,  5, 1]; // Settler

// Egyptians
uc[51] = [   45,   60,   30,   15,  15,  10,  30,  20,  7, 1]; // Slave Militia
uc[52] = [  115,  100,  145,   60,  50,  30,  55,  40,  6, 1]; // Ash Warden
uc[53] = [  170,  180,  220,   80,  45,  65,  50,  20,  7, 1]; // Khopesh Warrior
uc[54] = [  170,  150,   20,   40,   0,   0,  20,  10, 16, 2]; // Sopdu Explorer
uc[55] = [  360,  330,  280,  120,  50,  50, 110,  50, 15, 2]; // Anhur Guard
uc[56] = [  450,  560,  610,  180,  70, 110, 120, 150, 10, 3]; // Resheph Chariot
uc[57] = [  995,  575,  340,   80,   0,  55,  30,  95,  4, 3]; // Ram
uc[58] = [  980, 1510,  660,  100,   0,  65,  55,  10,  3, 6]; // Stone Catapult
uc[59] = [34000,50000,34000,42000,   0,  40,  50,  50,  4, 4]; // Nomarch
uc[60] = [ 4560, 5890, 4370, 4180,3000,   0,  80,  80,  5, 1]; // Settler

// Huns
uc[61] = [  130,   80,   40,   40,  50,  35,  40,  30,  6, 1]; // Mercenary
uc[62] = [  140,  110,   60,   60,  30,  50,  30,  10,  6, 1]; // Bowman
uc[63] = [  170,  150,   20,   40,   0,   0,  20,  10, 19, 2]; // Spotter
uc[64] = [  290,  370,  190,   45, 115, 120,  30,  15, 16, 2]; // Steppe Rider
uc[65] = [  320,  350,  330,   50, 105, 115,  80,  70, 16, 2]; // Marksman
uc[66] = [  450,  560,  610,  140,  80, 180,  60,  40, 14, 3]; // Marauder
uc[67] = [ 1060,  330,  360,   70,   0,  65,  30,  90,  4, 3]; // Ram
uc[68] = [  950, 1280,  620,   60,   0,  45,  55,  10,  3, 6]; // Catapult
uc[69] = [37200,27600,25200,27600,   0,  50,  40,  30,  5, 4]; // Logades
uc[70] = [ 6100, 4600, 4800, 5400,3000,   0,  80,  80,  5, 1]; // Settler

//Nature
uc[31] = [0,0,0,0,0,10,25,20,0,1];//Rat
uc[32] = [0,0,0,0,0,20,35,40,0,1];//Spider
uc[33] = [0,0,0,0,0,60,40,60,0,1];//Snake
uc[34] = [0,0,0,0,0,80,66,50,0,1];//Bat
uc[35] = [0,0,0,0,0,50,70,33,0,2];//Wild boar
uc[36] = [0,0,0,0,0,100,80,70,0,2];//Wolf
uc[37] = [0,0,0,0,0,250,140,200,0,3];//Bear
uc[38] = [0,0,0,0,0,450,380,240,0,3];//Crocodile
uc[39] = [0,0,0,0,0,200,170,250,0,3];//Tiger
uc[40] = [0,0,0,0,0,600,440,520,0,5];//Elephant

//Natarian - fr3nchlover
uc[41] = [0,0,0,0,0,20,35,50,0,1];//Pikeman
uc[42] = [0,0,0,0,0,65,30,10,0,1];//Thorned warrior
uc[43] = [0,0,0,0,0,100,90,75,0,1];//Guardsman
uc[44] = [0,0,0,0,0,0,10,0,0,1];//Birds of prey
uc[45] = [0,0,0,0,0,155,80,50,0,2];//Axerider
uc[46] = [0,0,0,0,0,170,140,80,0,3];//Natarian knight
uc[47] = [0,0,0,0,0,250,120,150,0,6];//Warelephant
uc[48] = [0,0,0,0,0,60,45,10,0,5];//Ballista
uc[49] = [0,0,0,0,0,80,50,50,0,0];//Natarian emperor
uc[50] = [0,0,0,0,0,30,40,40,0,0];//Settler

uc[98] = [20,30,10,20,0,0,0,0,0,0];//trap
uc[99] = [20,30,10,20,0,0,0,0,0,0];//trap

/////////////////////////////////////////////////////////////////////
// return [index of troop, title] from valid image
// index of troop is NaN if can't be determined
function getTroopIndexTitleFromImg(tImg)
{
   var tix = Number.NaN;

   var imgCN = tImg.className;
   if ( imgCN && imgCN.indexOf("unit") !== -1 && imgCN.search(/u(\d+)/) !== -1 )
   {
      tix = parseInt10(RegExp.$1);
   }

   return [tix, tImg.title];
}

//////////////////////////////////////////////////////////////////////
function getTroopImage(tix)
{
   return ( isIntValid(tix) ) ?  I("u" + tix) :  I("uhero");
}

//////////////////////////////////////////////////////////////////////
function getUnitImage(race, uix)
{
   var img = null;

   if ( TB3O.BaseTroopIndex[race] !== undefined )
   {
      img = getTroopImage(uix + TB3O.BaseTroopIndex[race]);
   }
   return img;
}

/////////////////////////////////////////////////////////////////////
function getUnitIndexFromTroopIndex(tix)
{
   return tix - Math.floor((tix-1)/10)*10;
}

/////////////////////////////////////////////////////////////////////
function getRaceIndexFromTroopIndex(tix)
{
   __ASSERT__(isIntValid(tix), "Invalid troop index")

   return Math.floor((tix-1)/10);
}

/////////////////////////////////////////////////////////////////////
function getRaceFromTroopIndex(tix)
{
   var racex = getRaceIndexFromTroopIndex(tix);
   var race = ( racex >= 0 && racex < TB3O.KnownRaces.length ) ? TB3O.KnownRaces[racex] : '';

   __ASSERT__(isStrValid(race), "Unknown race for troop index: " + tix)

   return race;
}

/////////////////////////////////////////////////////////////////////
function getScoutTroopIndex(race)
{
   return TB3O.ScoutTroopIndex[race];
}

//////////////////////////////////////////////////////////////////////
function getTroopIndexFromRace(race) 
{
   return TB3O.BaseTroopIndex[race];
}

//////////////////////////////////////////////////////////////////////
function getTroopNoByIndex(troopsInfo, tix)
{
   var troopNo;
   for ( troopNo = 0; troopNo < troopsInfo.length; ++troopNo )
   {
      if ( troopsInfo[troopNo][0] === tix )
      {
         return troopNo;
      }
   }

   return undefined;
}


//////////////////////////////////////////////////////////////////////
// Calculate total troops statistics for all troops in troopsInfo.
// troopsInfo is array of records troopInfo for each troop.
// troopInfo is an array: [tix,count]
// 
// villageId is a player village to which troops are belonging to
// (or undefined if troops origin is unknown).
//
// Returns the following structure:
//  {
//     base: {off, def_i, def_c},        // total base battle stats
//     upgraded: {off, def_i, def_c, lvl}, // total upgraded battle stats
//                                       // present only if villageId is given and valid
//                                       // lvl present only when collect stat about one troop
//     cap,                              // total capacity
//     cost:[lumber, clay, iron, crop],  // total training cost
//     speed,                            // speed for most slower troop
//     cc                                // total crop consumption
//  }
function calcTroopsTotals(troopsInfo,villageId/*opt*/)
{
   var upgradeLevels;
   var tNinfo = [0,0,0,0,0,0,0,0,Infinity,0];

   if ( villageId )
   {
      upgradeLevels = TB3O.VillagesInfo[villageId].upi.uul;
   }

   var i,j;
   for ( i = 0; i < troopsInfo.length; i++ )
   {
      var tix = troopsInfo[i][0];
      var count = troopsInfo[i][1];
      if ( count > 0 )
      {
         if ( isIntValid(tix) )
         {
            for ( j = 0; j <= 9; ++j ) 
            {
               if ( j === UCI_SPEED ) // speed
               {
                  var speed = uc[tix][UCI_SPEED] * TB3O.nTroopSpeedFactor[TB3O.nServerType];
                  tNinfo[UCI_SPEED] = Math.min(tNinfo[UCI_SPEED],speed); 
               }
               else
               {
                  tNinfo[j] += count * uc[tix][j];
               }
            }
         }
         else 
         {
            tNinfo[UCI_CC] += count * 6; //heroes
         }
      }

   }

   return {
      'base':  {'off':tNinfo[UCI_ATTACK], 'def_i':tNinfo[UCI_DEFENCE_I], 'def_c':tNinfo[UCI_DEFENCE_C]},
      'cap':   tNinfo[UCI_LOAD],
      'cost':  [tNinfo[UCI_LUMBER], tNinfo[UCI_CLAY], tNinfo[UCI_IRON], tNinfo[UCI_CROP]],
      'speed': tNinfo[UCI_SPEED],
      'cc':    tNinfo[UCI_CC]
   };
}

//////////////////////////////////////////////////////////////////////
function getUnitsCountInfoTotals()
{
   var villageId;
   var sumTT = fillArray(new Array(TG_UNITS_COUNT),0);

   for ( villageId in TB3O.VillagesInfo )
   {
      var unitsCountInfo = TB3O.VillagesInfo[villageId].uci;
      if ( unitsCountInfo.ttUpd )
      {
         accumulateArray(sumTT, unitsCountInfo.ut);
      }
   }

   return sumTT;
}

//////////////////////////////////////////////////////////////////////
function getTroopInfoFromUnitCount(race, uix, unitCount)
{
   return [getTroopIndexFromRace(race) + uix, unitCount];
}

//////////////////////////////////////////////////////////////////////
function getTroopsInfoFromUnitsCount(race, arrUnits)
{
   var troopsInfo = [];
   var i, tix, tixBase = getTroopIndexFromRace(race);

   for ( i = 0; i < TG_UNITS_COUNT; ++i )
   {
      if ( arrUnits[i] > 0 )
      {
         tix = ( i === TG_UIDX_HERO ) ? null : tixBase + i;
         troopsInfo.push([tix, arrUnits[i]]);
      }
   }
   return troopsInfo;
}

