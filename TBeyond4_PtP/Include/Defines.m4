m4_dnl ***************************************************************
m4_dnl ************************************************* TBEYOND SSE *
m4_dnl  Distrubuted under Creative Commons Attribution-Noncommercial-Share 
m4_dnl  Alike 3.0 License 
m4_dnl                                       e-mail: npocmu@gmail.com 
m4_dnl                      http://userscripts.org/scripts/show/98310 
m4_dnl ***************************************************************
m4_dnl  FILE:        Defines.m4
m4_dnl  CREATED:     Thu, 24 Feb 2011 08:59:08 +0200
m4_dnl  AUTHORS:     npocmu
m4_dnl  COPYRIGHT:   (c) npocmu 2011
m4_dnl  PROJECT:     Travian Beyond - SSE
m4_dnl  PURPOSE:     
m4_dnl ***************************************************************
M4_ECHO_OFF

m4_define({{TPL_USERINFO}},		{{TB3O.U[{{$1}}]}})
m4_define({{TBU_NAME}},			{{TPL_USERINFO(0)}})
m4_define({{TBU_RACE}},			{{TPL_USERINFO(1)}})
m4_define({{TBU_RACE_LOCAL}},		{{TPL_USERINFO(2)}})
m4_define({{TBU_CAPITAL_NAME}},		{{TPL_USERINFO(3)}})
m4_define({{TBU_CAPITAL_MAPID}},	{{TPL_USERINFO(4)}})
m4_define({{TBU_CAPITAL_ID}},		{{TPL_USERINFO(5)}})
m4_define({{TBU_CAPITAL_XY}},		{{TPL_USERINFO(6)}})
m4_define({{TBU_RACE_DELTA}},		{{TPL_USERINFO(7)}})


m4_define({{TPL_CNCOLOR}},		{{TB3O.CNc[{{$1}}]}})

m4_define({{CN_COL_TXT}},		{{0}})
m4_define({{CN_COL_NEUTRAL}},		{{1}})
m4_define({{CN_COL_MAXLVL}},		{{2}})
m4_define({{CN_COL_NORES}},		{{3}})
m4_define({{CN_COL_NPCUPGRADE}},	{{4}})
m4_define({{CN_COL_NOCAP}},		{{5}})

m4_define({{TBCN_COL_TXT}},		{{TPL_CNCOLOR(CN_COL_TXT)}})
m4_define({{TBCN_COL_NEUTRAL}},		{{TPL_CNCOLOR(CN_COL_NEUTRAL)}})
m4_define({{TBCN_COL_MAXLVL}},		{{TPL_CNCOLOR(CN_COL_MAXLVL)}})
m4_define({{TBCN_COL_NORES}},		{{TPL_CNCOLOR(CN_COL_NORES)}})
m4_define({{TBCN_COL_NPCUPGRADE}},	{{TPL_CNCOLOR(CN_COL_NPCUPGRADE)}})
m4_define({{TBCN_COL_NOCAP}},		{{TPL_CNCOLOR(CN_COL_NOCAP)}})

m4_define({{TB_TTF_THRESHOLD}},		7200)

m4_dnl Indicies for units cost
m4_define({{UCI_LUMBER}},		0)
m4_define({{UCI_CLAY}},			1)
m4_define({{UCI_IRON}},			2)
m4_define({{UCI_CROP}},			3)
m4_define({{UCI_LOAD}},			4)
m4_define({{UCI_ATTACK}},		5)
m4_define({{UCI_DEFENCE_I}},		6)
m4_define({{UCI_DEFENCE_C}},		7)
m4_define({{UCI_SPEED}},		8)
m4_define({{UCI_CC}},			9)

m4_dnl Indicies for buildings cost
m4_define({{BCI_LUMBER}},		0)
m4_define({{BCI_CLAY}},			1)
m4_define({{BCI_IRON}},			2)
m4_define({{BCI_CROP}},			3)
m4_define({{BCI_CP}},			4)
m4_define({{BCI_CC}},			5)

m4_dnl States for getAvailability
m4_define({{STA_NORES}},		0)
m4_define({{STA_AVAIL}},		1)
m4_define({{STA_NPCAVAIL}},		2)
m4_define({{STA_NOSTORE}},		3)
m4_define({{STA_MAX}},                  4)

m4_dnl Commands for troops
m4_define({{ATC_DEFEND}},		0)
m4_define({{ATC_ATTACK}},		1)
m4_define({{ATC_RAID}},	        	2)
m4_define({{ATC_SPY}},	        	3)
m4_define({{ATC_ADVENTURE}},	      	4)
m4_define({{ATC_SETTLE}},	      	5)
m4_define({{ATC_IMPRISON}},	      	6)

M4_ECHO_ON
m4_dnl ************************* END OF FILE *************************
