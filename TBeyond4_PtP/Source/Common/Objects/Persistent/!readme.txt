            Notes about persistent object in TBeyond

BE CAREFULL:
  Persistent objects will loose its origin when loaded from persistent storage!
  It is mean that they always loaded as simply objects/arrays without prototyping.


  List of persistent objects (not complete yet)


   Object                 Where used              Persistent storage key            Access key
ConstructionInfo       part of VillageInfo    <UserSpecificNS>_VillagesInfo    villageInfo.csi
UnitsCountInfo         part of VillageInfo    <UserSpecificNS>_VillagesInfo    villageInfo.uci
CulturePointsInfo      part of VillageInfo    <UserSpecificNS>_VillagesInfo    villageInfo.cpi
TownHallInfo           part of VillageInfo    <UserSpecificNS>_VillagesInfo    villageInfo.thi
UpgradeInfo            part of VillageInfo    <UserSpecificNS>_VillagesInfo    villageInfo.thi
ResourcesInfo          part of VillageInfo    <UserSpecificNS>_VillagesInfo    villageInfo.r
VillageInfo            part of VillagesInfo   <UserSpecificNS>_VillagesInfo    villagesInfo[village_id]
TrainingInfo           TrainingInfoColl       <VillageSpecificNS>_TrI trainingInfoColl[building_gid]
MerchantsUnderwayInfo                         <VillageSpecificNS>_MUI
MarketRoutesInfo                              <VillageSpecificNS>_MRI


Note:
  UserSpecificNS - depending on strorage type 
  VillageSpecificNS = <UserSpecificNS>_<villageid>