            Notes about persistent object in TBeyond

BE CAREFULL:
  Persistent objects will loose its origin when loaded from persistent storage!
  It is mean that they always loaded as simply objects/arrays without prototyping.


  List of persistent objects (not complete yet)


   Object                 Where used              Persistent storage key            Access key
ConstructionInfo     part of VillageInfo    <server>_<playerid>_VillagesInfo    villageInfo.csi
UnitsCountInfo       part of VillageInfo    <server>_<playerid>_VillagesInfo    villageInfo.uci
CulturePointsInfo    part of VillageInfo    <server>_<playerid>_VillagesInfo    villageInfo.cpi
TownHallInfo         part of VillageInfo    <server>_<playerid>_VillagesInfo    villageInfo.thi
UpgradeInfo          part of VillageInfo    <server>_<playerid>_VillagesInfo    villageInfo.thi
ResourcesInfo        part of VillageInfo    <server>_<playerid>_VillagesInfo    villageInfo.r
VillageInfo          part of VillagesInfo   <server>_<playerid>_VillagesInfo    villagesInfo[village_id]
TrainingInfo         TrainingInfoColl       <server>_<playerid>_<villageid>_TrI trainingInfoColl[building_gid]

