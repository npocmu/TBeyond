m4_dnl ***************************************************************
m4_dnl ************************************************* TBEYOND SSE *
m4_dnl  Distrubuted under Creative Commons Attribution-Noncommercial-Share 
m4_dnl  Alike 3.0 License 
m4_dnl                                       e-mail: npocmu@gmail.com 
m4_dnl                      http://userscripts.org/scripts/show/98310 
m4_dnl ***************************************************************
m4_dnl  FILE:        Debug.m4
m4_dnl  CREATED:     Fri, 09 Jul 2004 16:26:47
m4_dnl  AUTHORS:     npocmu
m4_dnl  COPYRIGHT:   (c) npocmu 2011
m4_dnl  PROJECT:     Travian Beyond - SSE
m4_dnl  PURPOSE:     Set of M4 macros for debugging
m4_dnl ***************************************************************
m4_include(Standard.m4)m4_dnl
M4_ECHO_OFF

----------------------------------------------------------------------
-- M4_DEBUG(arg)
--   Output arg only if DEBUG >= 1
--    
m4_define({{M4_DEBUG}},{{m4_ifdef({{__DEBUG__}},{{m4_ifelse(m4_eval(__DEBUG__>=1), 1,{{$1}})}})}})m4_dnl

----------------------------------------------------------------------
-- M4_NDEBUG(arg)
--   Output arg only if DEBUG = 0
--    
m4_define({{M4_NDEBUG}},{{m4_ifdef({{__DEBUG__}},{{m4_ifelse(m4_eval(__DEBUG__>=1), 1,,{{$1}})}},{{$1}})}})m4_dnl

----------------------------------------------------------------------
-- M4_IIF_DEBUG(arg1,arg2)
--   Output arg1 only if DEBUG >= 1, arg2 otherwise
--    
m4_define({{M4_IIF_DEBUG}},{{m4_ifdef({{__DEBUG__}},{{m4_ifelse(m4_eval(__DEBUG__>=1), 1,{{$1}},{{$2}})}},{{$2}})}})m4_dnl

----------------------------------------------------------------------
-- M4_DEBUG2(arg)
--   Output arg only if DEBUG >= 2
--    
m4_define({{M4_DEBUG2}},{{m4_ifdef({{__DEBUG__}},{{m4_ifelse(m4_eval(__DEBUG__>=2), 1,{{$1}})}})}})m4_dnl


----------------------------------------------------------------------
-- M4_TEST(macro,arg1,...argN)
-- Testing of macro
-- M4_TEST dump it's arguments, invoke <macro> and pass all arguments, 
-- dump result of <macro> invokation.
-- M4_TEST require at lest one argument - macro name
m4_define({{M4_TEST}},
   {{m4_ifelse(
       {{$#}}, 0, {{M4_ERR_BADARGNO1({{$0}},1,$#)}},
       {{$1}},,   {{M4_ERR1({{$0}},{{macro name required}})}},
       {{Testing <{{$1}}> args: M4_DUMP(m4_shift($@)) ==> results: M4_DUMP(m4_indir({{$1}},m4_shift($@)))}})}})


M4_ECHO_ON
m4_dnl ************************* END OF FILE *************************
