%{
%}

%lex
%options case-insensitive

%%

\s+                                   /* IGNORE */
"//".*                                /* IGNORE */
[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/]   /* IGNORE */
		
/*. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .*/
/* TIPOS DE DATOS */
"char"                      return 'charType'
"void"                      return 'voidType'
"boolean"                   return 'boolType'
"string"                    return 'strType'
"double"                    return 'dblType'
"int"                       return 'intType'
"true"                      return 'trBool'
"false"                     return 'flBool'

/*. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .*/
/* OPERADORES */
"<="                        return 'lessOrEquals'
">="                        return 'moreOrEquals'
"=="                        return 'equalsEquals'
"!="                        return 'notEquals'
"--"                        return 'minusMinus'
"++"                        return 'plusPlus'

"?"                         return 'questionMark'
":"                         return 'colom'

"/"                         return 'divition'
"%"                         return 'module'
"*"                         return 'times'
"^"                         return 'power'

"="                         return 'equals'
"<"                         return 'minor'
">"                         return 'major'

"-"                         return 'minus'
"+"                         return 'plus'

"&&"                        return 'and'
"!"                         return 'not'
"||"                        return 'or'

/*. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .*/
/* SIMBOLOS */
","                         return 'comma'
";"                         return 'semicolom'
"{"                         return 'openBracket'
"}"                         return 'closeBracket'
"("                         return 'openParenthesis'
")"                         return 'closeParenthesis'
"["                         return 'openSquareBracket'
"]"                         return 'closeSquareBracket'

/*. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .*/
/* PALABRAS RESERVADAS */
"new"                       return 'newRw';
"DynamicList"               return 'dynamicList'
"append"                    return 'appendRw'
"getValue"                  return 'getValueRw'
"setValue"                  return 'setValueRw'

'if'                        return 'ifRw'
'else'                      return 'elseRw'

'switch'                    return 'switchRw'
'break'                     return 'breakRw'
'case'                      return 'caseRw'
'default'                   return 'defaultRw'

'while'                     return 'whileRw'
'for'                       return 'forRw'
'do'                        return 'doRw'

'continue'                  return 'continueRw'
'return'                    return 'returnRw'

/*. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .*/
/* SECUENCIAS DE ESCAPE */
QUOTES "\""
PIPE_QUOTES "\\\""
DOUBLE_PIPES "\\\\"
BREAKLINE "\\n"
CARRETURN "\\r"
TABULATION "\\t"
NULLCHAR "\\0"

/*. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .*/
/* REGEX */
\"[^\"]*\"				    { yytext = yytext.substr(1,yyleng-2); return 'text'; }
\'[^\']?\'                  { yytext = yytext.substr(1,yyleng-2); return 'character'; }
[0-9]*"."[0-9]+\b           return 'decimal'
[0-9]+\b				    return 'integer'
([a-zA-Z])[a-zA-Z0-9_]*	    return 'id'

<<EOF>>				        return 'EOF'
.					        { console.error('Error léxico: ' 
                              + yytext + ', en la linea: ' + yylloc.first_line 
                              + ', en la columna: ' + yylloc.first_column); }

/lex

/*. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .*/
/* GLOBAL */
%{
    const DATATYPE = require('./ast')
%}

/*. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .*/
/* PRESEDENCIA */
%left 'minus'
%nonassoc 'power'
%left 'divition' 'times'
%left 'plus' 'minus'
%left 'module'
%left 'equalsEquals' 'notEquals' 'minor' 'lessOrEquals' 'major' 'moreOrEquals'
%right 'not'
%left 'and'
%left 'or'
%left 'openParenthesis' 'closeParenthesis'
%left 'comma' 'semicolom'

%start START

%%
/*. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .*/
/* INICIO */
START : INSTRUCTIONS EOF { 
        return $1; 
    };

/*. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .*/
/* GLOBALES */
TYPE : 
    intType { 
        $$ = DATATYPE.INT; 
    }
    | dblType  { 
        $$ = DATATYPE.DECIMAL; 
    } 
    | boolType { 
        $$ = DATATYPE.BOOLEAN; 
    } 
    | charType { 
        $$ = DATATYPE.CHAR; 
    }
    | strType  { 
        $$ = DATATYPE.STRING; 
    }
    | dynamicList minor TYPE major {
        $$ = DATATYPE.DYNAMICLIST
    }
    | voidType {
        $$ = DATATYPE.VOID
    };

/*. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .*/
/* INSTRUCCIONES */
BLOCKCONTENT : openBracket INSTRUCTIONS closeBracket;

INSTRUCTIONS : INSTRUCTIONS INSTRUCTION
| INSTRUCTION;

INSTRUCTION : DECLARATION semicolom | LINEASSIGNMENT semicolom 
| INCREMENTEXP semicolom | METHODS semicolom | breakRw semicolom
| continueRw semicolom | returnRw semicolom
| CONTROLSEQ | SWITCHSEQ | LOOPSEQ;

/*. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .*/
/* DECLARACION DE VARIABLES */
DECLARATION : TYPE ASSIGNMENTS;

LINEASSIGNMENT : ASSIGNMENT
| VECTORVALUE equals EXPRESSIONS;

ASSIGNMENTS : ASSIGNMENTS comma ASSIGNMENT
| ASSIGNMENT;

ASSIGNMENT : id 
| id equals EXPRESSIONS 
| id equals TERNARY
| VECTORASSIGNMENT
| CLASSINSTANCE;

VECTORASSIGNMENT : id openSquareBracket closeSquareBracket 
equals newRw TYPE openSquareBracket integer closeSquareBracket
| id openSquareBracket closeSquareBracket
equals openBracket EXPLIST closeBracket;

CLASSINSTANCE : id equals newRw TYPE
| id equals newRw id
| id equals newRw TYPE openParenthesis closeParenthesis
| id equals newRw id openParenthesis closeParenthesis
| id equals newRw TYPE openParenthesis EXPLIST closeParenthesis
| id equals newRw id openParenthesis EXPLIST closeParenthesis;

/*. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .*/
/* TODAS LAS EXPRESIONES VALIDAS */
EXPRESSIONS : EXPRESSIONS plus EXPRESSIONS
| EXPRESSIONS equalsEquals EXPRESSIONS
| EXPRESSIONS moreOrEquals EXPRESSIONS
| EXPRESSIONS lessOrEquals EXPRESSIONS
| EXPRESSIONS notEquals EXPRESSIONS
| EXPRESSIONS divition EXPRESSIONS
| EXPRESSIONS module EXPRESSIONS
| EXPRESSIONS times EXPRESSIONS
| EXPRESSIONS minus EXPRESSIONS
| EXPRESSIONS minor EXPRESSIONS
| EXPRESSIONS major EXPRESSIONS
| EXPRESSIONS and EXPRESSIONS
| EXPRESSIONS or EXPRESSIONS
| not EXPRESSIONS
| minus EXPRESSIONS
| openParenthesis EXPRESSIONS closeParenthesis
| openParenthesis TYPE closeParenthesis EXPRESSIONS
| openParenthesis TERNARY closeParenthesis
| FUNCTIONHEADER
| VARVALUE;

TERNARY : EXPRESSIONS questionMark EXPRESSIONS colom EXPRESSIONS;

INCREMENTEXP : id plusPlus | id minusMinus;

EXPLIST : EXPLIST comma EXPRESSIONS
| EXPRESSIONS;

/*. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .*/
/* VALORES DE VARIABLES */
VARVALUE : decimal | text | id | integer | character | trBool 
| flBool | VECTORVALUE;

VECTORVALUE : id openSquareBracket integer closeSquareBracket;

/*. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .*/
/* BUILT-IN FUNCTIONS */
METHODS : APPEND | GETVALUE | SETVALUE | FUNCTIONHEADER | FUNCTION;

APPEND : appendRw openParenthesis id comma EXPRESSIONS closeParenthesis;

GETVALUE : getValueRw openParenthesis id comma EXPRESSIONS closeParenthesis;

SETVALUE : setValueRw openParenthesis 
id comma EXPRESSIONS comma EXPRESSIONS closeParenthesis;

/*. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .*/
/* SENTENCIAS DE CONTROL */
CONTROLSEQ : CONSTROLSEQSYM openParenthesis EXPRESSIONS
closeParenthesis BLOCKCONTENT
| elseRw BLOCKCONTENT;

CONSTROLSEQSYM : ifRw | elseRw ifRw;

/*. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .*/
/* SWITCH */
SWITCHSEQ : switchRw openParenthesis EXPRESSIONS closeParenthesis
openBracket SWITCHSEQCASES closeBracket;

SWITCHSEQCASES : SWITCHSEQCASES SWITCHSEQCONTENT
| SWITCHSEQCONTENT;

SWITCHSEQCONTENT : caseRw EXPRESSIONS colom INSTRUCTIONS
| defaultRw colom INSTRUCTIONS;

/*. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .*/
/* CICLOS */
LOOPSEQ : WHILESEQ | DOWHILESEQ | FORSEQ;

WHILESEQ : whileRw openParenthesis EXPRESSIONS closeParenthesis BLOCKCONTENT;

DOWHILESEQ : doRw BLOCKCONTENT 
whileRw openParenthesis EXPRESSIONS closeParenthesis semicolom;

FORSEQ : forRw openParenthesis FORSEQPARAMS closeParenthesis BLOCKCONTENT;

FORSEQPARAMS : DECLARATION semicolom EXPRESSIONS semicolom EXPRESSIONS
| DECLARATION semicolom EXPRESSIONS semicolom INCREMENTEXP
| LINEASSIGNMENT semicolom EXPRESSIONS semicolom EXPRESSIONS
| LINEASSIGNMENT semicolom EXPRESSIONS semicolom INCREMENTEXP;

/*. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .*/
/* METODOS */
FUNCTIONHEADER : id openParenthesis EXPLIST closeParenthesis 
| id openParenthesis closeParenthesis;

FUNCTION : TYPE FUNCTIONHEADER BLOCKCONTENT;