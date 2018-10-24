m4_dnl ***************************************************************
m4_dnl ************************************************* TBEYOND SSE *
m4_dnl  Distrubuted under Creative Commons Attribution-Noncommercial-Share 
m4_dnl  Alike 3.0 License 
m4_dnl                                       e-mail: npocmu@gmail.com 
m4_dnl                      http://userscripts.org/scripts/show/98310 
m4_dnl ***************************************************************
m4_dnl  FILE:        Standard.m4
m4_dnl  CREATED:     Sat, 16 Mar 2002 19:38:23
m4_dnl  AUTHORS:     npocmu
m4_dnl  COPYRIGHT:   (c) npocmu 2011
m4_dnl  PROJECT:     Travian Beyond - SSE
m4_dnl  PURPOSE:     Set of usable M4 macros
m4_dnl ***************************************************************
m4_changequote([,])m4_dnl
m4_changequote({{,}})m4_dnl
m4_changecom({{--}})m4_dnl
m4_define({{M4_ECHO_OFF}},{{m4_pushdef({{_divnumPrev}}, m4_divnum)m4_divert(-1)}})m4_dnl
m4_define({{M4_ECHO_ON}}, {{m4_divert(_divnumPrev)m4_popdef({{_divnumPrev}})m4_dnl}})m4_dnl
M4_ECHO_OFF

m4_define({{M4_TRUE}},1)
m4_define({{M4_FALSE}},1)

----------------------------------------------------------------------
-- M4_ERR(macro,message)
-- yell error message
--    m4: 'file.m4(line number) - <macro>: message 
m4_define({{M4_ERR}},
   {{{{m4_errprint({{m4: '}}m4___file__{{'(}}m4___line__{{) - $1: $2}}
)}}}}) -- New line required

m4_define({{M4_ERR1}},
   {{m4_errprint({{m4: '}}m4___file__{{'(}}m4___line__{{) - $1: $2}}
)}}) -- New line required

----------------------------------------------------------------------
-- M4_ERR_BADARGNO(macro,need,supplied)
-- yell error message
--    m4: 'file.m4(line number) - <macro>: Invalid number of arguments (need <need>, called with <supplied>) 
m4_define({{M4_ERR_BADARGNO}},
   {{M4_ERR({{$1}},{{Invalid number of arguments (need $2, called with $3)}})}})

m4_define({{M4_ERR_BADARGNO1}},
   {{M4_ERR1({{$1}},{{Invalid number of arguments (need $2, called with $3)}})}})

----------------------------------------------------------------------
-- M4_DUMP(arg1,arg2,...,argN) 
-- Dump all arguments in form #1=arg1, #2=arg2, ... #N=argN
m4_define({{M4_DUMP}},
   {{m4_ifelse(
       $#, 0,,
       $#, 1, #{{}}1={{{{{{$1}}}}}},
       {{#{{}}1={{{{$1}}}}, m4_indir({{$M4_DUMP}},2,m4_shift($@))}})}})

m4_define({{$M4_DUMP}},
   {{m4_ifelse(
       $#, 2, #$1={{{{{{$2}}}}}},
       {{#$1={{{{$2}}}}, m4_indir({{$M4_DUMP}},m4_incr($1),m4_shift(m4_shift($@)))}})}})

----------------------------------------------------------------------
-- M4_REVERSE(arg1,arg2,...,argN) 
-- expand to argN,...,arg2,arg1
m4_define({{M4_REVERSE}},
   {{m4_ifelse(
       $#, 0,,
       $#, 1, {{{{$1}}}},
       {{M4_REVERSE(m4_shift($@)), {{$1}}}})}})m4_dnl

----------------------------------------------------------------------
-- $M4_CHECK_INDEX(k,count,macro)
-- check index validness
-- k must be present, positive integer in range [1:count-1]
-- macro - caller name
m4_define({{$M4_CHECK_INDEX}}, 
   {{m4_ifelse(
       m4_eval({{$2>=2}}), 0, M4_ERR_BADARGNO({{$3}},2,$2)0,
       {{m4_ifelse(
           {{$1}},, M4_ERR({{$3}},{{Missing index of arguments}})0,
           {{m4_ifelse(
               m4_regexp({{$1}},{{^[0-9]+$}}),-1,M4_ERR({{$3}},{{The index must be positive integer}})0,
               {{m4_ifelse(
                   m4_eval({{($1 < 1) || ($1 >= $2)}}), 1, M4_ERR({{$3}},{{Index $1 out of range 1-}}m4_decr($2){{}})0,
                   1)}})}})}})}})

--m4_define({{M4_CHECK_INDEX}}, {{m4_indir({{$M4_CHECK_INDEX}},{{$1}},{{$2}},{{$3}})}})
----------------------------------------------------------------------
-- M4_ARGN(k,arg1,...,argN) 
-- expand to argk
m4_define({{$M4_ARGN}}, 
   {{m4_ifelse(
       $1, 1, {{{{$2}}}},
              {{m4_indir({{$M4_ARGN}},m4_decr($1), m4_shift(m4_shift($@)))}})}})

m4_define({{M4_ARGN}}, 
   {{m4_ifelse(
       m4_indir({{$M4_CHECK_INDEX}},{{$1}},$#,{{$0}}),1,
          {{m4_indir({{$M4_ARGN}},$@)}})}})

----------------------------------------------------------------------
-- M4_ARGR(k,arg1,...,argN) 
-- expand to argk,...,argN
m4_define({{$M4_ARGR}}, 
   {{m4_ifelse(
       $1, 1, {{m4_shift($@)}},
              {{m4_indir({{$M4_ARGR}},m4_decr($1),m4_shift(m4_shift($@)))}})}})

m4_define({{M4_ARGR}}, 
   {{m4_ifelse(
       m4_indir({{$M4_CHECK_INDEX}},{{$1}},$#,{{$0}}),1,
          {{m4_indir({{$M4_ARGR}},$@)}})}})

----------------------------------------------------------------------
-- M4_ARGL(k,arg1,...,argN) 
-- expand to arg1,...,argk
m4_define({{$M4_ARGL}}, 
   {{M4_REVERSE(m4_indir({{$M4_ARGR}},m4_eval({{$#-$1}}),M4_REVERSE(m4_shift($@))))}})

m4_define({{M4_ARGL}}, 
   {{m4_ifelse(
       m4_indir({{$M4_CHECK_INDEX}},{{$1}},$#,{{$0}}),1,
          {{m4_indir({{$M4_ARGL}},$@)}})}})

----------------------------------------------------------------------
-- M4_ARGX(k,arg1,...,argN) 
-- expand to arg1,...,argk-1,argk+1,...,argN
m4_define({{$M4_ARGX}}, 
   {{m4_ifelse(
       $1,           1, {{m4_indir({{$M4_ARGR}},m4_incr($1),m4_shift($@))}},
       m4_incr($1), $#, {{m4_indir({{$M4_ARGL}},m4_decr($1),m4_shift($@))}},
       {{m4_indir({{$M4_ARGL}},m4_decr($1),m4_shift($@)),m4_indir({{$M4_ARGR}},m4_incr($1),m4_shift($@))}})}})

m4_define({{M4_ARGX}}, 
   {{m4_ifelse(
       m4_indir({{$M4_CHECK_INDEX}},{{$1}},$#,{{$0}}),1,
          {{m4_indir({{$M4_ARGX}},$@)}})}})

----------------------------------------------------------------------
-- M4_PASTE2(arg1,arg2) 
-- expand to arg1arg2
m4_define({{M4_PASTE2}},
   {{m4_ifelse(
       $#, 2, {{{{$1}}}}{{{{$2}}}},
              M4_ERR_BADARGNO({{$0}},2,$#))}})

----------------------------------------------------------------------
-- M4_PASTE(arg1,arg2,...,argN) 
-- expand to arg1arg2...argN
m4_define({{M4_PASTE}},
   {{m4_ifelse(
       $#, 0,,
       $#, 1, {{{{$1}}}},
       {{M4_PASTE2({{$1}},M4_PASTE(m4_shift($@)))}})}})

----------------------------------------------------------------------
-- M4_INDEX_LAST(string, substring)
-- expand to the index of the last occurrence of <substring> in <string>.
-- The first character in string has index 0.
-- If <substring> does not occur in <string>, M4_INDEX_LAST expands to `-1'.
m4_define({{M4_INDEX_LAST}},
   {{m4_ifelse(
      m4_eval($# != 2), M4_TRUE, M4_ERR_BADARGNO({{$0}},2,$#),
      m4_index({{$1}},{{$2}}),-1,-1,
      {{m4_indir(
         {{$M4_INDEX_LAST}},
         m4_substr({{$1}},m4_eval(m4_index({{$1}},{{$2}})+m4_len({{$2}}))),
         {{$2}},
         m4_eval(m4_index({{$1}},{{$2}})+m4_len({{$2}})))}})}})

m4_define({{$M4_INDEX_LAST}},
   {{m4_ifelse(
      m4_eval($# != 3), M4_TRUE, M4_ERR_BADARGNO({{$0}},3,$#),
      m4_index({{$1}},{{$2}}),-1,m4_eval($3-m4_len({{$2}})),
      {{m4_indir(
         {{$M4_INDEX_LAST}},
         m4_substr({{$1}},m4_eval(m4_index({{$1}},{{$2}})+m4_len({{$2}}))),
         {{$2}},
         m4_eval(m4_index({{$1}},{{$2}})+m4_len({{$2}})+$3))}})}})

----------------------------------------------------------------------
--   ATTENTION:  m4_substr usage warning
-- Michael Breen wrote:
-- Unfortunately, m4's usual approach of rescanning the expansion of a macro
-- can be a problem with macros that operate on strings.
-- It's not possible to prevent the string that's returned from being expanded.
-- Steven Simpson wrote a patch for m4 which fixes the problem by allowing 
-- an extra parameter to be passed to string macros - however this of course 
-- means using a non-standard m4.
--
--   CONSEQUENCE: don't use result of string manipulation function as
-- arguments for another macro if result may contain comma character or 
-- quote characters

----------------------------------------------------------------------
-- M4_STR_BEFORE_MATCH(string,substring)
-- expand to the part of the <string> that ended with first occurrence 
-- of <substring>, but without <substring> itself.
-- If <substring> does not occur in <string>, M4_STR_BEFORE_MATCH expands to
-- whole <string>.
m4_define({{M4_STR_BEFORE_MATCH}},
   {{m4_ifelse(
      m4_eval($# != 2), 1, {{M4_ERR_BADARGNO1({{$0}},2,$#)}},
      m4_index({{$1}},{{$2}}), -1, {{$1}},
      {{m4_substr({{$1}},0,m4_index({{$1}},{{$2}}))}})}})

----------------------------------------------------------------------
-- M4_STR_AFTER_MATCH(string,substring)
-- expand to the part of the <string> that started after first occurrence 
-- of <substring>.
-- If <substring> does not occur in <string>, M4_STR_AFTER_MATCH expands to
-- empty string.
m4_define({{M4_STR_AFTER_MATCH}},
   {{m4_ifelse(
      m4_eval($# != 2), 1, {{M4_ERR_BADARGNO1({{$0}},2,$#)}},
      m4_index({{$1}},{{$2}}), -1,,
      {{m4_substr({{$1}},m4_eval(m4_index({{$1}},{{$2}})+m4_len({{$2}})))}})}})

----------------------------------------------------------------------
-- M4_STR_TRIM(string,substring)
-- remove any occurrences of the <substring> from head and tail of the <string>
-- If <substring> missing it assumed to be space character
m4_define({{$M4_STR_TRIM_SPACES}},{{m4_patsubst({{$1}},{{\(^ +\)\|\( +$\)}})}})

m4_define({{$M4_STR_TRIM}},
   {{m4_ifelse(
      {{$1}},,,
      m4_substr({{$1}},0,m4_len({{$2}})),{{$2}},
         {{m4_indir({{$M4_STR_TRIM}},m4_substr({{$1}},m4_len({{$2}})),{{$2}})}},
      m4_substr({{$1}},m4_eval(m4_len({{$1}})-m4_len({{$2}})),m4_len({{$2}})),{{$2}},
         {{m4_indir({{$M4_STR_TRIM}},m4_substr({{$1}},0,m4_eval(m4_len({{$1}})-m4_len({{$2}}))),{{$2}})}},
      {{$1}})}})

m4_define({{M4_STR_TRIM}},
   {{m4_ifelse(
      m4_eval(($# > 2) || ($# < 1)), 1, {{M4_ERR_BADARGNO1({{$0}},2,$#)}},
      {{$2}},,{{m4_indir({{$M4_STR_TRIM_SPACES}},{{$1}})}},
      {{$2}},{{ }},{{m4_indir({{$M4_STR_TRIM_SPACES}},{{$1}})}},
      {{m4_indir({{$M4_STR_TRIM}},{{$1}},{{$2}})}})}})

----------------------------------------------------------------------
m4_define({{M4_FORLOOP}},
       {{m4_pushdef({{$1}}, {{$2}})_M4_FORLOOP({{$1}}, {{$2}}, {{$3}}, {{$4}})m4_popdef({{$1}})}})m4_dnl

m4_define({{_M4_FORLOOP}},
       {{$4{{}}m4_ifelse($1, {{$3}}, ,
       {{m4_define({{$1}}, m4_incr($1))_M4_FORLOOP({{$1}}, {{$2}}, {{$3}}, {{$4}})}})}})m4_dnl

----------------------------------------------------------------------
-- PUBLIC: M4_FOREACH(iterator, text, arg1,...argN) 
----------------------------------------------------------------------
-- Expand to <text> for each argument from arg1 to argN.
-- Any occurrence of the <iterator> in <text> replaced with current argument value
m4_define({{M4_FOREACH}},
   {{m4_ifelse(
       m4_eval($# < 3), 1, {{M4_ERR_BADARGNO1({{$0}},3,$#)}},
       {{$1}},, {{M4_ERR1({{$0}},{{Missing name of iterator}})}},
       {{m4_pushdef({{$1}})m4_indir({{$M4_FOREACH}}, {{$1}}, {{$2}}, m4_shift(m4_shift($@))){{}}m4_popdef({{$1}})}})}})m4_dnl

m4_define({{$M4_FOREACH}},
   {{m4_define({{$1}}, {{$3}})m4_ifelse(
       $#, 3, {{$2}}, 
       {{$2}}{{{{}}}}{{m4_indir({{$M4_FOREACH}},{{$1}},{{$2}},m4_shift(m4_shift(m4_shift($@))))}})}})m4_dnl

m4_define({{M4_ARGUMENT}},{{$$1}})m4_dnl

m4_define({{M4_FIRST}},$1)m4_dnl

M4_ECHO_ON
m4_dnl ************************* END OF FILE *************************
