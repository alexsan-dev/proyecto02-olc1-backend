%{
    const { DataType } = require('../compiler/utils')
    const { 
        Declaration, 
        Assignment,
        VectorAssignment,
        DynamicList  } = require('../compiler/instruction/variable')
    const { ExpValue } = require('../compiler/instruction/expression')
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
"DynamicList"               return 'dynamicListRw'
"append"                    return 'appendRw'
"getValue"                  return 'getValueRw'
"setValue"                  return 'setValueRw'
'writeLine'                 return 'writeLineRw'
'toLower'                   return 'toLowerRw'
'toUpper'                   return 'toUpperRw'
'length'                    return 'lengthRw'
'truncate'                  return 'truncateRw'
'round'                     return 'roundRw'
'typeOf'                    return 'typeOfRw'
'toString'                  return 'toStringRw'
'toCharArray'               return 'toCharArrayRw'
'start'                     return 'startRw'
'with'                      return 'withRw'

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
        $$ = DataType.INT; 
    }
    | dblType  { 
        $$ = DataType.DECIMAL; 
    } 
    | boolType { 
        $$ = DataType.BOOLEAN; 
    } 
    | charType { 
        $$ = DataType.CHAR; 
    }
    | strType  { 
        $$ = DataType.STRING; 
    }
    | dynamicListRw minor TYPE major {
        $$ = DataType.DYNAMICLIST
    };

/*. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .*/
/* INSTRUCCIONES */
BLOCKCONTENT : openBracket INSTRUCTIONS closeBracket {
        $$ = $2;
    };

INSTRUCTIONS : INSTRUCTIONS INSTRUCTION {
        $$ = $1;
        $$.push($2);
    }
    | INSTRUCTIONS MAIN {
        $$ = $1;
        $$.push($2);
    }
    | INSTRUCTION {
        $$ = [$1];
    };

INSTRUCTION : DECLARATION semicolom {
        $$ = $1;
    }
| INCREMENTEXP semicolom | METHODS semicolom | breakRw semicolom
| continueRw semicolom | returnRw EXPRESSIONS semicolom | FUNCTION
| CONTROLSEQ | SWITCHSEQ | LOOPSEQ;

MAIN : startRw withRw FUNCTIONHEADER semicolom;

/*. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .*/
/* DECLARACION DE VARIABLES */
DECLARATION : TYPE ASSIGNMENTS {
        $$ = new Declaration({ token: @1, type: $1, assignments: $2 });
    };

ASSIGNMENTS : ASSIGNMENTS comma ASSIGNMENT {
        $$ = $1;
        $$.push($3);
    }
    | ASSIGNMENT {
        $$ = [$1];
    };

ASSIGNMENT : id {
        $$ = new Assignment({ token: @1, id: $1 });
    }
    | id equals EXPRESSIONS {
        $$ = new Assignment({ token: @1, id: $1, exp: $3 });  
    }
    | id equals TERNARY {
        $$ = new Assignment({ token: @1, id: $1 });
    }
    | VECTORASSIGNMENT {
        $$ = new Assignment({ token: @1, vector: $1 });
    }
    | DYNAMICLIST {
        $$ = new Assignment({ token: @1, list: $1 });
    }
    | VECTORVALUE equals EXPRESSIONS {
        $$ = new Assignment({ token: @1, id: '' });
    };

VECTORASSIGNMENT : id openSquareBracket closeSquareBracket 
    equals newRw TYPE openSquareBracket integer closeSquareBracket {
        $$ = new VectorAssignment({ 
            token: @1, type: $6, id: $1, size: $8  });
    }
    | id openSquareBracket closeSquareBracket
    equals openBracket EXPLIST closeBracket {
        $$ = new VectorAssignment({ 
            token: @1, id: $1, defValues: [] });
    };

DYNAMICLIST : id equals newRw dynamicListRw minor TYPE major {
        $$ = new DynamicList({ token: @1, id: $1, type: $6 });
    };

/*. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .*/
/* VALORES DE VARIABLES */
VARVALUE : decimal | text | id | integer | character | trBool 
| flBool | FUNCTIONHEADER | TOLOWER | TOUPPER | LENGTHSEQ
| TYPEOFSEQ | TOSTRINGSEQ | TOCHARARRAY | TRUNCATE | ROUND
| GETVALUE | VECTORVALUE;

VECTORVALUE : id openSquareBracket integer closeSquareBracket;

/*. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .*/
/* TODAS LAS EXPRESIONES VALIDAS */
EXPRESSIONS : EXPRESSIONS plus EXPRESSIONS {
        $$ = new ExpValue({ token: @1 });
    }
    | EXPRESSIONS equalsEquals EXPRESSIONS {
        $$ = new ExpValue({ token: @1 });
    }
    | EXPRESSIONS moreOrEquals EXPRESSIONS {
        $$ = new ExpValue({ token: @1 });
    }
    | EXPRESSIONS lessOrEquals EXPRESSIONS {
        $$ = new ExpValue({ token: @1 });
    }
    | EXPRESSIONS notEquals EXPRESSIONS {
        $$ = new ExpValue({ token: @1 });
    }
    | EXPRESSIONS divition EXPRESSIONS {
        $$ = new ExpValue({ token: @1 });
    }
    | EXPRESSIONS module EXPRESSIONS {
        $$ = new ExpValue({ token: @1 });
    }
    | EXPRESSIONS power EXPRESSIONS {
        $$ = new ExpValue({ token: @1 });
    }
    | EXPRESSIONS times EXPRESSIONS {
        $$ = new ExpValue({ token: @1 });
    }
    | EXPRESSIONS minus EXPRESSIONS {
        $$ = new ExpValue({ token: @1 });
    }
    | EXPRESSIONS minor EXPRESSIONS {
        $$ = new ExpValue({ token: @1 });
    }
    | EXPRESSIONS major EXPRESSIONS {
        $$ = new ExpValue({ token: @1 });
    }
    | EXPRESSIONS and EXPRESSIONS {
        $$ = new ExpValue({ token: @1 });
    }
    | EXPRESSIONS or EXPRESSIONS {
        $$ = new ExpValue({ token: @1 });
    }
    | not EXPRESSIONS | minus EXPRESSIONS {
        $$ = new ExpValue({ token: @1 });
    }
    | openParenthesis EXPRESSIONS closeParenthesis {
        $$ = new ExpValue({ token: @1 });
    }
    | openParenthesis TYPE closeParenthesis EXPRESSIONS {
        $$ = new ExpValue({ token: @1 });
    }
    | openParenthesis TERNARY closeParenthesis {
        $$ = new ExpValue({ token: @1 });
    }
    | VARVALUE {
        $$ = new ExpValue({ token: @1 });
    };

TERNARY : EXPRESSIONS questionMark EXPRESSIONS colom EXPRESSIONS;

INCREMENTEXP : id plusPlus | id minusMinus;

EXPLIST : EXPLIST comma EXPRESSIONS
| EXPRESSIONS;

/*. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .*/
/* BUILT-IN FUNCTIONS */
METHODS : APPEND | SETVALUE | FUNCTIONHEADER | WRITELINE;

APPEND : appendRw openParenthesis id comma EXPRESSIONS closeParenthesis;

GETVALUE : getValueRw openParenthesis id comma EXPRESSIONS closeParenthesis;

SETVALUE : setValueRw openParenthesis 
id comma EXPRESSIONS comma EXPRESSIONS closeParenthesis;

WRITELINE : writeLineRw openParenthesis EXPRESSIONS closeParenthesis;

TOLOWER : toLowerRw openParenthesis EXPRESSIONS closeParenthesis;

TOUPPER : toUpperRw openParenthesis EXPRESSIONS closeParenthesis;

LENGTHSEQ : lengthRw openParenthesis VARVALUE closeParenthesis;

TRUNCATE : truncateRw openParenthesis VARVALUE closeParenthesis;

ROUND : roundRw openParenthesis VARVALUE closeParenthesis;

TYPEOFSEQ : typeOfRw openParenthesis VARVALUE closeParenthesis;

TOSTRINGSEQ : toStringRw openParenthesis VARVALUE closeParenthesis;

TOCHARARRAY : toCharArrayRw openParenthesis VARVALUE closeParenthesis;

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
PARAMSLIST : PARAMSLIST comma PARAMVAR
| PARAMVAR;

PARAMVAR : TYPE id;

FUNCTIONPARAMS : openParenthesis PARAMSLIST closeParenthesis
| openParenthesis closeParenthesis; 

FUNCTIONHEADER : id openParenthesis EXPLIST closeParenthesis 
| id openParenthesis closeParenthesis;

FUNCTION : TYPE id FUNCTIONPARAMS BLOCKCONTENT 
| voidType id FUNCTIONPARAMS BLOCKCONTENT;