m4_dnl ***************************************************************
m4_dnl ************************************************* TBEYOND SSE *
m4_dnl  Distrubuted under Creative Commons Attribution-Noncommercial-Share 
m4_dnl  Alike 3.0 License 
m4_dnl                                       e-mail: npocmu@gmail.com 
m4_dnl                      http://userscripts.org/scripts/show/98310 
m4_dnl ***************************************************************
m4_dnl  FILE:        TB.m4
m4_dnl  CREATED:     Tue, 21 Dec 2010 11:03:14 +0200
m4_dnl  AUTHORS:     npocmu
m4_dnl  COPYRIGHT:   (c) npocmu 2011
m4_dnl  PROJECT:     Travian Beyond - SSE
m4_dnl  PURPOSE:     Main M4 header
m4_dnl ***************************************************************
m4_include(Debug.m4)m4_dnl
m4_include(Standard.m4)m4_dnl
m4_include(_VerInfo.m4)m4_dnl
m4_include(Options.m4)m4_dnl
m4_include(Defines.m4)m4_dnl
m4_include(GID.m4)m4_dnl
m4_include(Travian.m4)m4_dnl
m4_include(Specific.m4)m4_dnl
m4_include(uso.m4)m4_dnl
M4_ECHO_OFF

m4_define({{TPL_STR_QUOTE}},{{'m4_patsubst({{$1}},{{'}},{{\\'}})'}})

m4_define({{__ENTER__}},{{M4_DEBUG($enter(arguments);)}})m4_dnl
m4_define({{__EXIT__}}, {{M4_DEBUG($exit();)}})m4_dnl

m4_define({{__LOG__}},  {{M4_DEBUG($log($@);)}})m4_dnl
m4_define({{__DUMP__}}, {{M4_DEBUG($dump_expr({{M4_FOREACH(arg,{{TPL_STR_QUOTE({{arg}}),arg,}},$@)}}undefined);)}})m4_dnl
m4_define({{__DUMP_NODE__}},  {{M4_DEBUG($log_node(8,TPL_STR_QUOTE({{$1}}),{{$1}});)}})m4_dnl
m4_define({{__DUMP_STYLE__}}, {{M4_DEBUG($log_style(8,TPL_STR_QUOTE({{$1}}),{{$1}});)}})m4_dnl
m4_define({{__DUMP_EVENT__}}, {{M4_DEBUG($log_event(8,TPL_STR_QUOTE({{$1}}),{{$1}});)}})m4_dnl

m4_define({{__TEST__}}, {{M4_IIF_DEBUG({{$test(TPL_STR_QUOTE({{$1}}),$1)}},{{$1}})}})m4_dnl

m4_define({{__ASSERT__}}, {{M4_DEBUG({{if ( !({{$1}}) ) { $log(3,"Assertion (" + TPL_STR_QUOTE({{$1}}) + ") failed! " m4_ifelse({{$2}},,,+ {{$2}}));} }})}})m4_dnl
m4_define({{__ERROR__}},  {{M4_DEBUG($log(3, "Error!", $@);)}})m4_dnl

m4_define({{TB_USO_BASE}},		{{http://userscripts.org/scripts/}})
m4_define({{TB_USO_URL_INSTALL}},  	{{TB_USO_BASE{{}}source/{{}}TB_USO_NO{{}}.user.js}})
m4_define({{TB_USO_URL_META}},  	{{TB_USO_BASE{{}}source/{{}}TB_USO_NO{{}}.meta.js}})
m4_define({{TB_USO_URL_HOME}},  	{{TB_USO_BASE{{}}show/{{}}TB_USO_NO}})

m4_define({{IF_TB3}},     	m4_ifdef({{TB4}},,{{$1}}))
m4_define({{IF_TB4}},  	        m4_ifdef({{TB4}},{{$1}}))
m4_define({{IIF_TB3}},  	m4_ifdef({{TB4}},{{$2}},{{$1}}))
m4_define({{IIF_TB4}},  	m4_ifdef({{TB4}},{{$1}},{{$2}}))

m4_changecom({{///}})m4_dnl

M4_ECHO_ON
m4_dnl ************************* END OF FILE *************************
