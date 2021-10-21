%{
    const errors = require('../compiler/error')
    const { DataType, getToken, Operator } = require('../compiler/utils')
    const { 
        Main,
        Declaration, 
        Assignment,
        VectorAssignment,
        DynamicList,
        Expression,
        Value,
        VectorValue,
        FunctionBlock, 
        FunctionCall, 
        WriteLine } = require('../compiler/instruction')
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
"!="                        return 'nonEquals'
"--"                        return 'minusMinus'
"++"                        return 'plusPlus'

"?"                         return 'questionMark'
":"                         return 'colom'

"/"                         return 'division'
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
.					        { errors.push({
                                type: 'Lexical',
                                token: { line: yylloc.first_line, col: yylloc.fist_column },
                                msg: `${yytext} no reconocido`
                            }); }

/lex

/*. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .*/
/* GLOBAL */
%{
%}

/*. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .*/
/* PRESEDENCIA */
%left 'minus'
%nonassoc 'power'
%left 'division' 'times'
%left 'plus' 'minus'
%left 'module'
%left 'equalsEquals' 'nonEquals' 'minor' 'lessOrEquals' 'major' 'moreOrEquals'
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
        $$ = DataType.INTEGER; 
    }
    | dblType  { 
        $$ = DataType.DECIMAL; 
    } 
    | boolType { 
        $$ = DataType.BOOLEAN; 
    } 
    | charType { 
        $$ = DataType.CHARACTER; 
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
    | INCREMENTEXP semicolom {
        $$ = $1;
    }  
    | METHODS semicolom {
        $$ = $1;
    }
    | breakRw semicolom
| continueRw semicolom | returnRw EXPRESSIONS semicolom | FUNCTION
| CONTROLSEQ | SWITCHSEQ | LOOPSEQ;

MAIN : startRw withRw FUNCTIONCALL semicolom {
        $$ = new Main(getToken(@1), $3);
};

/*. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .*/
/* DECLARACION DE VARIABLES */
DECLARATION : TYPE ASSIGNMENTS {
        $$ = new Declaration(getToken(@1), { type: $1, assignments: $2 });
    };

ASSIGNMENTS : ASSIGNMENTS comma ASSIGNMENT {
        $$ = $1;
        $$.push($3);
    }
    | ASSIGNMENT {
        $$ = [$1];
    };

ASSIGNMENT : id {
        $$ = new Assignment(getToken(@1), { id: $1 });
    }
    | id equals EXPRESSIONS {
        $$ = new Assignment(getToken(@1), { id: $1, exp: $3 });  
    }
    | id equals TERNARY {
        $$ = new Assignment(getToken(@1), { id: $1 });
    }
    | VECTORASSIGNMENT {
        $$ = new Assignment(getToken(@1), { vector: $1 });
    }
    | DYNAMICLIST {
        $$ = new Assignment(getToken(@1), { list: $1 });
    }
    | VECTORVALUE equals EXPRESSIONS {
        $$ = new Assignment(getToken(@1), { id: '' });
    };

VECTORASSIGNMENT : id openSquareBracket closeSquareBracket 
    equals newRw TYPE openSquareBracket integer closeSquareBracket {
        $$ = new VectorAssignment(getToken(@1), { type: $6, id: $1, size: $8 });
    }
    | id openSquareBracket closeSquareBracket
    equals openBracket EXPLIST closeBracket {
        $$ = new VectorAssignment(getToken(@1), { id: $1, defValues: $6 });
    };

DYNAMICLIST : id equals newRw dynamicListRw minor TYPE major {
        $$ = new DynamicList(getToken(@1), { id: $1, type: $6 });
    };

/*. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .*/
/* VALORES DE VARIABLES */
VARVALUE : decimal {
        $$ = new Value(getToken(@1), { value: $1, type: DataType.DECIMAL })
    }
    | text {
        $$ = new Value(getToken(@1), { value: $1, type: DataType.STRING })
    }
    | id {
        $$ = new Value(getToken(@1), { value: $1, type: DataType.ID })
    }
    | integer {
        $$ = new Value(getToken(@1), { value: $1, type: DataType.INTEGER })
    }
    | character {
        $$ = new Value(getToken(@1), { value: $1, type: DataType.CHARACTER })
    }
    | trBool {
        $$ = new Value(getToken(@1), { value: $1, type: DataType.BOOLEAN })
    }
    | flBool {
        $$ = new Value(getToken(@1), { value: $1, type: DataType.BOOLEAN })
    }
    | FUNCTIONCALL | TOLOWER | TOUPPER | LENGTHSEQ
| TYPEOFSEQ | TOSTRINGSEQ | TOCHARARRAY | TRUNCATE | ROUND
| GETVALUE | VECTORVALUE;

VECTORVALUE : id openSquareBracket integer closeSquareBracket {
        $$ = new VectorValue(getToken(@1), $3, { 
            value: $1, type: DataType.STRING });
    };

/*. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .*/
/* TODAS LAS EXPRESIONES VALIDAS */
EXPRESSIONS : EXPRESSIONS plus EXPRESSIONS {
        $$ = new Expression(getToken(@1), { 
            left: $1, right: $3, operator: Operator.PLUS });
    }
    | EXPRESSIONS equalsEquals EXPRESSIONS {
        $$ = new Expression(getToken(@1), { 
            left: $1, right: $3, operator: Operator.EQUALSEQUALS });
    }
    | EXPRESSIONS moreOrEquals EXPRESSIONS {
        $$ = new Expression(getToken(@1), { 
            left: $1, right: $3, operator: Operator.MOREOREQUALS });
    }
    | EXPRESSIONS lessOrEquals EXPRESSIONS {
        $$ = new Expression(getToken(@1), { 
            left: $1, right: $3, operator: Operator.LESSOREQUALS });
    }
    | EXPRESSIONS nonEquals EXPRESSIONS {
        $$ = new Expression(getToken(@1), { 
            left: $1, right: $3, operator: Operator.NONEQUALS });
    }
    | EXPRESSIONS division EXPRESSIONS {
        $$ = new Expression(getToken(@1), { 
            left: $1, right: $3, operator: Operator.DIVISION });
    }
    | EXPRESSIONS module EXPRESSIONS {
        $$ = new Expression(getToken(@1), { 
            left: $1, right: $3, operator: Operator.MODULE });
    }
    | EXPRESSIONS power EXPRESSIONS {
        $$ = new Expression(getToken(@1), { 
            left: $1, right: $3, operator: Operator.POWER });
    }
    | EXPRESSIONS times EXPRESSIONS {
        $$ = new Expression(getToken(@1), { 
            left: $1, right: $3, operator: Operator.TIMES });
    }
    | EXPRESSIONS minus EXPRESSIONS {
        $$ = new Expression(getToken(@1), { 
            left: $1, right: $3, operator: Operator.MINUS });
    }
    | EXPRESSIONS minor EXPRESSIONS {
        $$ = new Expression(getToken(@1), { 
            left: $1, right: $3, operator: Operator.MINOR });
    }
    | EXPRESSIONS major EXPRESSIONS {
        $$ = new Expression(getToken(@1), { 
            left: $1, right: $3, operator: Operator.MAJOR });
    }
    | EXPRESSIONS and EXPRESSIONS {
        $$ = new Expression(getToken(@1), { 
            left: $1, right: $3, operator: Operator.AND });
    }
    | EXPRESSIONS or EXPRESSIONS {
        $$ = new Expression(getToken(@1), { 
            left: $1, right: $3, operator:Operator.OR });
    }
    | not EXPRESSIONS {
        $$ = new Expression(getToken(@1), { 
            left: $2, operator: Operator.NOT });
    }
    | minus EXPRESSIONS {
        $$ = new Expression(getToken(@1), { 
            left: $2, operator: Operator.NEGATION });
    }
    | openParenthesis EXPRESSIONS closeParenthesis {
        $$ = new Expression(getToken(@1), { left: $2 });
    }
    | openParenthesis TYPE closeParenthesis EXPRESSIONS {
        $$ = new Expression(getToken(@1), { left: $4 } );
    }
    | openParenthesis TERNARY closeParenthesis {
        $$ = new Expression(getToken(@1));
    }
    | VARVALUE {
        $$ = new Expression(getToken(@1), { value: $1 });
    };

TERNARY : EXPRESSIONS questionMark EXPRESSIONS colom EXPRESSIONS;

INCREMENTEXP : id plusPlus {
        $$ = new Expression(getToken(@1), { 
            left: new Value(getToken(@1), { 
                value: $1, type: DataType.ID }),
            operator: Operator.PLUSPLUS
    })}
    | id minusMinus {
        $$ = new Expression(getToken(@1), { 
            left: new Value(getToken(@1), { 
                value: $1, type: DataType.ID }),
            operator: Operator.MINUSMINUS
        })   
    };

EXPLIST : EXPLIST comma EXPRESSIONS {
        $$ = $1;
        $$.push($3);
    }
    | EXPRESSIONS {
        $$ = [$1];
    };

/*. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .*/
/* BUILT-IN FUNCTIONS */
METHODS : APPEND | SETVALUE | FUNCTIONCALL 
    | WRITELINE {
        $$ = $1;
    };

APPEND : appendRw openParenthesis id comma EXPRESSIONS closeParenthesis;

GETVALUE : getValueRw openParenthesis id comma EXPRESSIONS closeParenthesis;

SETVALUE : setValueRw openParenthesis 
id comma EXPRESSIONS comma EXPRESSIONS closeParenthesis;

WRITELINE : writeLineRw openParenthesis EXPRESSIONS closeParenthesis {
        $$ = new WriteLine(getToken(@1), { id:'writeLine', params: [$3] });
    };

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
PARAMSLIST : PARAMSLIST comma PARAMVAR {
        $$ = $1;
        $$.push($3);
    }
    | PARAMVAR {
        $$ = [$1];
    };

PARAMVAR : TYPE id {
        $$ = { type: $1, id: $2 };
    };

FUNCTIONPARAMS : openParenthesis PARAMSLIST closeParenthesis {
        $$ = $2;
    }
    | openParenthesis closeParenthesis {
        $$ = [];
    }; 

FUNCTION : TYPE id FUNCTIONPARAMS BLOCKCONTENT {
        $$ = new FunctionBlock(getToken(@1), { 
            id: $2, type: $1, params: $3, content: $4 });
    }
    | voidType id FUNCTIONPARAMS BLOCKCONTENT {
        $$ = new FunctionBlock(getToken(@1), { 
            id: $2, type: 'void', params: $3, content: $4 });
    };

FUNCTIONCALL : id openParenthesis EXPLIST closeParenthesis {
        $$ = new FunctionCall(getToken(@1), { params: $3, id: $1 })
    } 
    | id openParenthesis closeParenthesis {
        $$ = new FunctionCall(getToken(@1), { params: [], id: $1 })
    };
