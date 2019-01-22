m4_dnl ***************************************************************
m4_dnl ************************************************* TBEYOND SSE *
m4_dnl  Distrubuted under Creative Commons Attribution-Noncommercial-Share 
m4_dnl  Alike 3.0 License 
m4_dnl                                       e-mail: npocmu@gmail.com 
m4_dnl                      http://userscripts.org/scripts/show/98310 
m4_dnl ***************************************************************
m4_dnl  FILE:        Options.m4
m4_dnl  CREATED:     Tue, 15 Feb 2011 11:04:52 +0200
m4_dnl  AUTHORS:     npocmu
m4_dnl  COPYRIGHT:   (c) npocmu 2011
m4_dnl  PROJECT:     Travian Beyond - SSE
m4_dnl  PURPOSE:     Names for all options stored in TB3O.O
m4_dnl ***************************************************************
M4_ECHO_OFF

m4_define({{TPL_OPTION}},{{TB3O.O[{{$1}}]}})


m4_define({{TBO_SCRIPT_LANG}},             	{{TPL_OPTION(0)}})
m4_define({{TBO_SHOW_BIG_ICON_MARKET}},    	{{TPL_OPTION(4)}})
m4_define({{TBO_SHOW_BIG_ICON_MILITARY}},  	{{TPL_OPTION(5)}})
m4_define({{TBO_SHOW_BIG_ICON_MILITARY2}}, 	{{TPL_OPTION(6)}})
m4_define({{TBO_SHOW_BIG_ICON_MISC}},      	{{TPL_OPTION(7)}})

//m4_define({{TBO_SHOW_MENU_SECTION3}},		{{TPL_OPTION(9)}})

m4_define({{TBO_WARSIM_INDEX}},  		{{TPL_OPTION(10)}})
m4_define({{TBO_REPSITE_INDEX}},		{{TPL_OPTION(11)}})
m4_define({{TBO_SHOW_IN_OUT_ICONS_VL}},		{{TPL_OPTION(12)}})
m4_define({{TBO_SHOW_CENTER_MAP_ICON_VL}},      {{TPL_OPTION(13)}})
m4_define({{TBO_SHOW_SEND_TROOPS_RESOURCES_VL}},{{TPL_OPTION(14)}})
m4_define({{TBO_SHOW_PPH_VL}},  		{{TPL_OPTION(15)}})
m4_define({{TBO_SHOW_CROP_EPPH_VL}},		{{TPL_OPTION(16)}})
m4_define({{TBO_SHOW_POP_VL}},			{{TPL_OPTION(17)}})
m4_define({{TBO_SHOW_VL2TABLE}},		{{TPL_OPTION(18)}})
m4_define({{TBO_SHOW_BIP_ATT_VL}},  		{{TPL_OPTION(19)}})

m4_define({{TBO_SHOW_BOOKMARKS}},               {{TPL_OPTION(20)}})
m4_define({{TBO_FLOAT_BOOKMARKS}},              {{TPL_OPTION(21)}})
m4_define({{TBO_SHOW_NOTEBLOCK}},               {{TPL_OPTION(22)}})
m4_define({{TBO_FLOAT_NOTEBLOCK}},              {{TPL_OPTION(23)}})
m4_define({{TBO_NBSIZE}},                       {{TPL_OPTION(24)}})
m4_define({{TBO_NBHEIGHT}},                     {{TPL_OPTION(25)}})
m4_define({{TBO_NPC_ASSISTANT}},                {{TPL_OPTION(26)}})
m4_define({{TBO_WS_ANALYSER_INDEX}},  		{{TPL_OPTION(27)}})
m4_define({{TBO_SHOW_STAT_LINKS}},		{{TPL_OPTION(28)}})
m4_define({{TBO_MAP_ANALYSER_INDEX}},		{{TPL_OPTION(29)}})

m4_define({{TBO_SHOW_MAP_USER_LINKS}},  	{{TPL_OPTION(30)}})
m4_define({{TBO_SHOW_MAP_ALLY_LINKS}},		{{TPL_OPTION(31)}})
m4_define({{TBO_SHOW_SEARCHBAR}},		{{TPL_OPTION(32)}})
m4_define({{TBO_FLOAT_SEARCHBAR}},  		{{TPL_OPTION(33)}})
m4_define({{TBO_SHOW_CP_IN_UPGTABLES}},		{{TPL_OPTION(34)}})
m4_define({{TBO_SHOW_CC_IN_UPGTABLES}},  	{{TPL_OPTION(35)}})
m4_define({{TBO_SHOW_UNTIL_THEN_RESIDUE}},	{{TPL_OPTION(36)}})
m4_define({{TBO_SHOW_RESUPGTABLE}},             {{TPL_OPTION(37)}})
m4_define({{TBO_SHOW_COLOR_RES_LEVELS}},  	{{TPL_OPTION(38)}})
m4_define({{TBO_SHOW_RESBARTABLE}},		{{TPL_OPTION(39)}})
m4_define({{TBO_FLOAT_RESBARTABLE}},		{{TPL_OPTION(40)}})
m4_define({{TBO_SHOW_BLDUPGTABLE}},		{{TPL_OPTION(41)}})
m4_define({{TBO_SHOW_SORTED_BLDUPGTABLE}},	{{TPL_OPTION(42)}})
m4_define({{TBO_SHOW_CENTER_NUMBERS}},  	{{TPL_OPTION(43)}})
m4_define({{TBO_SHOW_COLOR_BLD_LEVELS}},	{{TPL_OPTION(44)}})
m4_define({{TBO_SHOW_BLDBLINK}},		{{TPL_OPTION(45)}})
m4_define({{TBO_SHOW_ADDINFO_INCOMING_MERC}},	{{TPL_OPTION(46)}})
m4_define({{TBO_SHOW_LAST_MARKET_SEND}},  	{{TPL_OPTION(47)}})

m4_define({{TBO_MARKETPRELOAD}},  {{TPL_OPTION(48)}})
m4_define({{TBO_RP_DEFAULT_ACTION}},  		{{TPL_OPTION(49)}})

m4_define({{TBO_NO_OF_SCOUTS}},			{{TPL_OPTION(50)}})
m4_define({{TBO_SHOW_LAST_ATTACK}},		{{TPL_OPTION(51)}})
m4_define({{TBO_SHOW_LAST_ATTACK_TARGET}},	{{TPL_OPTION(52)}})
m4_define({{TBO_SHOW_TROOP_INFO_TOOLTIPS}},	{{TPL_OPTION(53)}})
m4_define({{TBO_SHOW_DIST_TOOLTIPS}},		{{TPL_OPTION(54)}})
m4_define({{TBO_SHOW_CELL_TYPE}},		{{TPL_OPTION(56)}})
m4_define({{TBO_SHOW_DIST_TIMES}},		{{TPL_OPTION(57)}})
m4_define({{TBO_SHOW_NEIGHBORHOODTABLE}},  	{{TPL_OPTION(58)}})
//m4_define({{TBO_MSG_RPT_PRELOAD}},		{{TPL_OPTION(59)}})

m4_define({{TBO_SHOW_MES_OPEN_LINKS}},	 	{{TPL_OPTION(60)}})
m4_define({{TBO_SHOW_REP_DEL_TABLE}},		{{TPL_OPTION(61)}})
m4_define({{TBO_SHOW_IGM_LINK_FOR_ME}},		{{TPL_OPTION(62)}})
//m4_define({{TBO_SHOW_BATTLE_REPORT}},		{{TPL_OPTION(63)}})
//m4_define({{TBO_SHOWBRSTATDETAILS}},  {{TPL_OPTION(64)}})

m4_define({{TBO_CN_COL_NEUTRAL}},		{{TPL_OPTION(65)}})
m4_define({{TBO_CN_COL_MAXLEV}},  		{{TPL_OPTION(66)}})
m4_define({{TBO_CN_COL_NORES}},  		{{TPL_OPTION(67)}})
m4_define({{TBO_CN_COL_NPCUPGRADE}},  		{{TPL_OPTION(68)}})
m4_define({{TBO_CN_COL_NOCAP}},			{{TPL_OPTION(101)}})

m4_define({{TBO_CONSOLE_LOG_LEVEL}},            {{TPL_OPTION(69)}})

m4_define({{TBO_RESBARTABLE_STATE}},  	{{TPL_OPTION(70)}})
m4_define({{TBO_BOOKMARKS_STATE}},              {{TPL_OPTION(71)}})
m4_define({{TBO_NOTEBLOCK_STATE}},              {{TPL_OPTION(72)}})
m4_define({{TBO_VL2TABLE_STATE}},  {{TPL_OPTION(73)}})
m4_define({{TBO_SEARCHBAR_STATE}},	{{TPL_OPTION(74)}})
m4_define({{TBO_RESBARTABLE_XY}},  {{TPL_OPTION(75)}})
m4_define({{TBO_BOOKMARKS_XY}},                 {{TPL_OPTION(76)}})
m4_define({{TBO_NOTEBLOCK_XY}},                 {{TPL_OPTION(77)}})
m4_define({{TBO_VL2TABLE_XY}},		{{TPL_OPTION(78)}})
m4_define({{TBO_SEARCHBAR_XY}},		{{TPL_OPTION(79)}})

m4_define({{TBO_SHOW_TROOP_INFO_TOOLTIPS_RP}},  {{TPL_OPTION(80)}})
m4_define({{TBO_SHOW_DIST_TOOLTIPS_RP}},  	{{TPL_OPTION(81)}})
m4_define({{TBO_LOCK_BOOKMARKS}},		{{TPL_OPTION(82)}})
m4_define({{TBO_SEARCHBAR_TYPE}},		{{TPL_OPTION(83)}})
m4_define({{TBO_MARKET_SEND_COUNT}},		{{TPL_OPTION(84)}})
m4_define({{TBO_SHOW_SEND_TROOPS_RESOURCES_RP}},{{TPL_OPTION(85)}})
m4_define({{TBO_SHOW_USER_LINKS_RP}},		{{TPL_OPTION(86)}})
m4_define({{TBO_REMEMBER_SEND_COUNT}},		{{TPL_OPTION(87)}})
m4_define({{TBO_RESUPGTABLE_XY}},		{{TPL_OPTION(88)}})
m4_define({{TBO_BLDUPGTABLE_XY}},		{{TPL_OPTION(89)}})
m4_define({{TBO_NEIGHBORHOODTABLE_XY}},		{{TPL_OPTION(90)}})

m4_define({{TBO_CUSTOMIZE_VLIST}},	        {{TPL_OPTION(91)}})
m4_define({{TBO_LOCK_VL}},                      {{TPL_OPTION(92)}})
m4_define({{TBO_DORF3_DEFAULT_TAB}},		{{TPL_OPTION(93)}})

m4_define({{OID_DORF3_REFRESH_TROOPS_TRAINING}},94)
m4_define({{TBO_DORF3_REFRESH_TROOPS_TRAINING}},{{TPL_OPTION(OID_DORF3_REFRESH_TROOPS_TRAINING)}})
m4_define({{TBO_DORF3_REFRESH_CP}},  		{{TPL_OPTION(OID_DORF3_REFRESH_TROOPS_TRAINING+1)}})
m4_define({{TBO_DORF3_REFRESH_CELEBRATIONS}},  	{{TPL_OPTION(OID_DORF3_REFRESH_TROOPS_TRAINING+2)}})
m4_define({{TBO_DORF3_REFRESH_TROOPS}},  	{{TPL_OPTION(OID_DORF3_REFRESH_TROOPS_TRAINING+3)}})
m4_define({{TBO_DORF3_REFRESH_SLOTS}},  	{{TPL_OPTION(OID_DORF3_REFRESH_TROOPS_TRAINING+4)}})
m4_define({{TBO_SHOW_SEND_TROOPS_RESOURCES}},   {{TPL_OPTION(99)}})

m4_define({{TBO_RESBARTABLE_SHOW_VTYPE}},	{{TPL_OPTION(102)}})
m4_define({{TBO_SHOW_NPC_IN_UPGTABLES}},	{{TPL_OPTION(103)}})
m4_define({{TBO_MSGPOPUP_XY}},			{{TPL_OPTION(104)}})

m4_define({{TBO_SHOW_IN_OUT_ICONS_VL2}},	{{TPL_OPTION(105)}})
m4_define({{TBO_SHOW_CENTER_MAP_ICON_VL2}},	{{TPL_OPTION(106)}})
m4_define({{TBO_SHOW_SEND_TROOPS_RESOURCES_VL2}},{{TPL_OPTION(107)}})
m4_define({{TBO_SHOW_PPH_VL2}},  		{{TPL_OPTION(108)}})
m4_define({{TBO_SHOW_CROP_EPPH_VL2}},		{{TPL_OPTION(109)}})
m4_define({{TBO_SHOW_POP_VL2}},			{{TPL_OPTION(110)}})
m4_define({{TBO_SHOW_BIP_ATT_VL2}},  		{{TPL_OPTION(111)}})
m4_define({{TBO_SHOW_DISTANCE_VL2}},		{{TPL_OPTION(112)}})
m4_define({{TBO_SHOW_DISTANCE_VL}},		{{TPL_OPTION(113)}})
m4_define({{TBO_SHOW_CP_VL2}},		        {{TPL_OPTION(114)}})
m4_define({{TBO_SHOW_CP_VL}},		        {{TPL_OPTION(115)}})
m4_define({{TBO_LOCK_VL2}},                     {{TPL_OPTION(116)}})
m4_define({{TBO_COLUMNS_VL2}},                  {{TPL_OPTION(117)}})
m4_define({{TBO_SHOW_MAP_TOOLTIPS}},            {{TPL_OPTION(118)}})
m4_define({{TBO_GT_WORLD_ID}},                  {{TPL_OPTION(119)}})
m4_define({{TBO_SHOW_EDIT_ROUTES_UI}},          {{TPL_OPTION(120)}})
m4_define({{TBO_SHOW_ARR_TOTALS_TABLE_MP}},	{{TPL_OPTION(121)}})

M4_ECHO_ON
m4_dnl ************************* END OF FILE *************************
