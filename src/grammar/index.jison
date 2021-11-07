%{
    const { DataType, getToken, Operator } = require('../compiler/utils')
    const errors = require('../compiler/error')
    const symbols = require('../compiler/symbols')
    const { addToAst } = require('../compiler/ast')
    const { 
        IncrementalAssignment,
        DynamicListValue,
        VectorAssignment,
        VectorPosition,
        FunctionBlock, 
        ExpAssignment,
        ContinueValue,
        FunctionCall, 
        CycleControl,
        Declaration, 
        VectorValue,
        ReturnValue,
        ToCharArray,
        Expression,
	    BreakValue,
        WriteLine, 
        Condition,
        ToString,
        GetValue,
        SetValue,
        Truncate,
        ToLower,
        ToUpper,
        ForLoop,
        TypeOf,
        Switch,
        Length,
        Append,
        Round,
        Value,
        Main } = require('../compiler/instruction')

        // AGREGAR TOKEN
        const addToken = (yylloc, name,) => {
            symbols.default.push({ ...getToken(yylloc), name })
            return name
        }
%}

%lex
%options case-insensitive

%%

\s+                                   /* IGNORE */
"//".*                                /* IGNORE */
[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/]   /* IGNORE */
		
/*. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .*/
/* TIPOS DE DATOS */
"char"                      return addToken(yylloc, 'charType')
"void"                      return addToken(yylloc, 'voidType')
"boolean"                   return addToken(yylloc, 'boolType')
"string"                    return addToken(yylloc, 'strType')
"double"                    return addToken(yylloc, 'dblType')
"int"                       return addToken(yylloc, 'intType')
"true"                      return addToken(yylloc, 'trBool')
"false"                     return addToken(yylloc, 'flBool')

/*. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .*/
/* OPERADORES */
"<="                        return addToken(yylloc, 'lessOrEquals')
">="                        return addToken(yylloc, 'moreOrEquals')
"=="                        return addToken(yylloc, 'equalsEquals')
"--"                        return addToken(yylloc, 'minusMinus')
"!="                        return addToken(yylloc, 'nonEquals')
"++"                        return addToken(yylloc, 'plusPlus')

"?"                         return addToken(yylloc, 'questionMark')
":"                         return addToken(yylloc, 'colom')

"/"                         return addToken(yylloc, 'division')
"%"                         return addToken(yylloc, 'module')
"*"                         return addToken(yylloc, 'times')
"^"                         return addToken(yylloc, 'power')

"="                         return addToken(yylloc, 'equals')
"<"                         return addToken(yylloc, 'minor')
">"                         return addToken(yylloc, 'major')

"-"                         return addToken(yylloc, 'minus')
"+"                         return addToken(yylloc, 'plus')

"&&"                        return addToken(yylloc, 'and')
"!"                         return addToken(yylloc, 'not')
"||"                        return addToken(yylloc, 'or')

/*. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .*/
/* SIMBOLOS */
","                         return addToken(yylloc, 'comma')
";"                         return addToken(yylloc, 'semicolom')
"{"                         return addToken(yylloc, 'openBracket')
"}"                         return addToken(yylloc, 'closeBracket')
"("                         return addToken(yylloc, 'openParenthesis')
")"                         return addToken(yylloc, 'closeParenthesis')
"["                         return addToken(yylloc, 'openSquareBracket')
"]"                         return addToken(yylloc, 'closeSquareBracket')

/*. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .*/
/* PALABRAS RESERVADAS */
'toCharArray'               return addToken(yylloc, 'toCharArrayRw')
"DynamicList"               return addToken(yylloc, 'dynamicListRw')
'writeLine'                 return addToken(yylloc, 'writeLineRw')
"setValue"                  return addToken(yylloc, 'setValueRw')
"getValue"                  return addToken(yylloc, 'getValueRw')
'truncate'                  return addToken(yylloc, 'truncateRw')
'toString'                  return addToken(yylloc, 'toStringRw')
'toLower'                   return addToken(yylloc, 'toLowerRw')
'toUpper'                   return addToken(yylloc, 'toUpperRw')
"append"                    return addToken(yylloc, 'appendRw')
'length'                    return addToken(yylloc, 'lengthRw')
'typeOf'                    return addToken(yylloc, 'typeOfRw')
'round'                     return addToken(yylloc, 'roundRw')
'start'                     return addToken(yylloc, 'startRw')
'with'                      return addToken(yylloc, 'withRw')
"new"                       return addToken(yylloc, 'newRw')

'else'                      return addToken(yylloc, 'elseRw')
'if'                        return addToken(yylloc, 'ifRw')

'default'                   return addToken(yylloc, 'defaultRw')
'switch'                    return addToken(yylloc, 'switchRw')
'break'                     return addToken(yylloc, 'breakRw')
'case'                      return addToken(yylloc, 'caseRw')

'while'                     return addToken(yylloc, 'whileRw')
'for'                       return addToken(yylloc, 'forRw')
'do'                        return addToken(yylloc, 'doRw')

'continue'                  return addToken(yylloc, 'continueRw')
'return'                    return addToken(yylloc, 'returnRw')

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
\"[^\"]*\"				    { yytext = yytext.substr(1,yyleng-2); return addToken(yylloc, 'text') }
\'[^\']?\'                  { yytext = yytext.substr(1,yyleng-2); return addToken(yylloc, 'text')}
[0-9]*"."[0-9]+\b           return addToken(yylloc, 'decimal')
[0-9]+\b				    return addToken(yylloc, 'integer')
([a-zA-Z])[a-zA-Z0-9_]*	    return addToken(yylloc, 'id')

<<EOF>>				        return 'EOF'
.					        { errors.default.push({
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
%left 'questionMark'
%left 'minor' 'lessOrEquals' 'major' 'moreOrEquals' 'equalsEquals' 'nonEquals'
%left 'plus' 'minus'
%left 'times' 'division' 'module'
%left 'and' 'or'
%right 'not'

%nonassoc 'comma' 'power' 'openParenthesis' 'closeParenthesis'

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
        $$ = DataType.DOUBLE; 
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
        $$ = `${DataType.DYNAMICLIST}<${$3}>`
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
    | ASSIGNMENT semicolom {
        $$ = $1;
    }
    | METHODS semicolom {
        $$ = $1;
    }
    | FUNCTION {
        $$ = $1;
    }
    | CONTROLSEQ {
        $$ = $1;
    }
    | LOOPSEQ {
        $$ = $1;    
    }
    | SWITCHSEQ {
        $$ = $1;
    }
    | LOOPESCAPE {
        $$ = $1;
    };

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
        $$ = new ExpAssignment(getToken(@1), { id: $1 });
    }
    | id equals EXPRESSIONS {
        $$ = new ExpAssignment(getToken(@1), { id: $1, exp: $3 });  
    }
    | id equals TERNARY {
        $$ = new ExpAssignment(getToken(@1), { id: $1, exp: $3 });
    }
    | INCREMENTALASSIGNMENT {
        $$ = $1;
    }
    | NEWVECTORASSIGNMENT {
        $$ = $1;
    }
    | VECTORASSIGNMENT {
        $$ = $1;
    };

INCREMENTALASSIGNMENT : id plusPlus {
        $$ = new IncrementalAssignment(getToken(@1), { 
            id: $1, operator: Operator.PLUSPLUS })
    }
    | id minusMinus {
        $$ = new IncrementalAssignment(getToken(@1), { 
            id: $1, operator: Operator.MINUSMINUS })
    };

VECTORASSIGNMENT : VECTORVALUE equals EXPRESSIONS {
        $$ = new VectorPosition(getToken(@1), { 
            value: $1, exp: $3 });
    } 
    | VECTORVALUE equals TERNARY {
        $$ = new VectorPosition(getToken(@1), { 
            value: $1, exp: $3 });
    };

NEWVECTORASSIGNMENT : id openSquareBracket closeSquareBracket 
    equals newRw TYPE openSquareBracket EXPRESSIONS closeSquareBracket {
        $$ = new VectorAssignment(getToken(@1), { type: $6, id: $1, size: $8 });
    }
    | id openSquareBracket closeSquareBracket
    equals openBracket EXPLIST closeBracket {
        $$ = new VectorAssignment(getToken(@1), { id: $1, defValues: $6 });
    };

/*. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .*/
/* VALORES DE VARIABLES */
VARVALUE : decimal {
        $$ = new Value(getToken(@1), { value: $1, type: DataType.DOUBLE })
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
    | TOLOWER {
        $$ = $1;   
    }
    | TOUPPER {
        $$ = $1;   
    }
    | LENGTHSEQ {
        $$ = $1;
    }
    | TYPEOFSEQ {
        $$ = $1;
    }
    | TOSTRINGSEQ {
        $$ = $1;
    }
    | TOCHARARRAY {
        $$ = $1;
    }
    | TRUNCATE {
        $$ = $1;
    }
    | ROUND {
        $$ = $1;
    }  
    | FUNCTIONCALL {
        $$ = $1;
    }
    | GETVALUE {
        $$ = $1;
    }  
    | VECTORVALUE {
        $$ = $1;
    }
    | DYNAMICLISTVALUE {
        $$ = $1;
    };

DYNAMICLISTVALUE : newRw dynamicListRw minor TYPE major {
        $$ = new DynamicListValue(getToken(@1), { type: $4 });
    };

VECTORVALUE : id openSquareBracket EXPRESSIONS closeSquareBracket {
        $$ = new VectorValue(getToken(@1), { 
            value: $1, index: $3, type: DataType.STRING });
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
/* TODO: Casteo explicito */
    | openParenthesis TYPE closeParenthesis EXPRESSIONS {
        $$ = new Expression(getToken(@1), { left: $4 } );
    }
    | VARVALUE {
        $$ = new Expression(getToken(@1), { value: $1 });
    }
    | openParenthesis TERNARY closeParenthesis {
        $$ = $2;
    };

TERNARY : EXPRESSIONS questionMark EXPRESSIONS colom EXPRESSIONS {
        $$ = new Expression(getToken(@1), { 
            left: $3, right: $5, condition: $1, operator: Operator.TERNARY })
    };

EXPLIST : EXPLIST comma EXPRESSIONS {
        $$ = $1;
        $$.push($3);
    }
    | EXPRESSIONS {
        $$ = [$1];
    };

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
    } | TYPE id openSquareBracket closeSquareBracket {
        $$ = { type: DataType.ARRAY, id: $2, generic: $1 };
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
    | TYPE id openSquareBracket closeSquareBracket FUNCTIONPARAMS BLOCKCONTENT {
        $$ = new FunctionBlock(getToken(@1), { 
            id: $2, type: DataType.ARRAY, generic: $1 , params: $5, content: $6 });
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

/*. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .*/
/* BUILT-IN FUNCTIONS */
METHODS : APPEND {
        $$ = $1;
    }
    | SETVALUE {
        $$ = $1;
    }
    | FUNCTIONCALL {
        $$ = $1;
    }
    | WRITELINE {
        $$ = $1;
    };

APPEND : appendRw openParenthesis id comma EXPRESSIONS closeParenthesis {   
        $$ = new Append(getToken(@1), { id: $3, params: [$5] });
    };

GETVALUE : getValueRw openParenthesis id comma EXPRESSIONS closeParenthesis {
        $$ = new GetValue(getToken(@1), { id: $3, params: [$5] });
    };

SETVALUE : setValueRw openParenthesis 
    id comma EXPRESSIONS comma EXPRESSIONS closeParenthesis {
        $$ = new SetValue(getToken(@1), { id: $3, params: [$5, $7] });
    };

WRITELINE : writeLineRw openParenthesis EXPRESSIONS closeParenthesis {
        $$ = new WriteLine(getToken(@1), { params: [$3] });
    };

TOLOWER : toLowerRw openParenthesis EXPRESSIONS closeParenthesis {
        $$ = new ToLower(getToken(@1), { params: [$3] })
    };

TOUPPER : toUpperRw openParenthesis EXPRESSIONS closeParenthesis {
        $$ = new ToUpper(getToken(@1), { params: [$3] })
    };

LENGTHSEQ : lengthRw openParenthesis EXPRESSIONS closeParenthesis {
        $$ = new Length(getToken(@1), { params: [$3] })
    };

TRUNCATE : truncateRw openParenthesis EXPRESSIONS closeParenthesis {
        $$ = new Truncate(getToken(@1), { params: [$3] })
    };

ROUND : roundRw openParenthesis EXPRESSIONS closeParenthesis {
        $$ = new Round(getToken(@1), { params: [$3] })
    };

TYPEOFSEQ : typeOfRw openParenthesis EXPRESSIONS closeParenthesis {
        $$ = new TypeOf(getToken(@1), { params: [$3] })
    };

TOSTRINGSEQ : toStringRw openParenthesis EXPRESSIONS closeParenthesis {
        $$ = new ToString(getToken(@1), { params: [$3] });
    };

TOCHARARRAY : toCharArrayRw openParenthesis EXPRESSIONS closeParenthesis {
        $$ = new ToCharArray(getToken(@1), { params: [$3] });
    };

/*. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .*/
/* SENTENCIAS DE CONTROL */
CONTROLSEQ : ifRw openParenthesis EXPRESSIONS closeParenthesis BLOCKCONTENT {
        $$ = new Condition(getToken(@1), { 
            valid: { exp: $3, body: $5 }
        })
    }
    | ifRw openParenthesis EXPRESSIONS closeParenthesis BLOCKCONTENT
    elseRw BLOCKCONTENT {
        $$ = new Condition(getToken(@1), { 
            valid: { exp: $3, body: $5 },
            inValid: { exp: $3, body: $7 }
        })
    }
    | ifRw openParenthesis EXPRESSIONS closeParenthesis BLOCKCONTENT
    CONTROLSEQELIFS {
        $$ = new Condition(getToken(@1), { 
            valid: { exp: $3, body: $5 },
            fallback: $6
        })
    }
    | ifRw openParenthesis EXPRESSIONS closeParenthesis BLOCKCONTENT
    CONTROLSEQELIFS elseRw BLOCKCONTENT {
        $$ = new Condition(getToken(@1), { 
            inValid: { exp: $3, body: $8 },
            valid: { exp: $3, body: $5 },
            fallback: $6
        })
    };

CONTROLSEQELIFS : CONTROLSEQELIFS CONTROLSEQELIF {
        $$ = $1;
        $$.push($2);
    }
    | CONTROLSEQELIF {
        $$ = [$1];
    };

CONTROLSEQELIF : elseRw ifRw 
    openParenthesis EXPRESSIONS closeParenthesis BLOCKCONTENT {
        $$ = { exp: $4, body: $6 };
    };

/*. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .*/
/* SWITCH */
SWITCHSEQ : switchRw openParenthesis EXPRESSIONS closeParenthesis
    openBracket SWITCHSEQCASES closeBracket {
        $$ = new Switch(getToken(@1), { value: $3, cases: $6 })
    }
    | switchRw openParenthesis EXPRESSIONS closeParenthesis
    openBracket SWITCHSEQCASES defaultRw colom INSTRUCTIONS closeBracket {
        $$ = new Switch(getToken(@1), { 
            value: $3, cases: $6, default: { body: $9 } })
    } 
    | switchRw openParenthesis EXPRESSIONS closeParenthesis
    openBracket defaultRw colom INSTRUCTIONS closeBracket {
        $$ = new Switch(getToken(@1), { 
            value: $3, default: { body: $8 } })
    };

SWITCHSEQCASES : SWITCHSEQCASES SWITCHSEQCONTENT {
        $$ = $1;
        $$.push($2);
    }
    | SWITCHSEQCONTENT {
        $$ = [$1];
    };

SWITCHSEQCONTENT : caseRw EXPRESSIONS colom INSTRUCTIONS {
        $$ = { case: $2, body: $4 };
    };

/*. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .*/
/* CICLOS */
LOOPSEQ : WHILESEQ | DOWHILESEQ | FORSEQ;

WHILESEQ : whileRw openParenthesis EXPRESSIONS closeParenthesis BLOCKCONTENT {
        $$ = new CycleControl(getToken(@1), { 
            condition: $3, body: $5 
         })
    };

DOWHILESEQ : doRw BLOCKCONTENT 
    whileRw openParenthesis EXPRESSIONS closeParenthesis semicolom {
        $$ = new CycleControl(getToken(@1), { 
            condition: $5, body: $2, isDoLoop: true
         })
    };

FORSEQ : forRw openParenthesis FORSEQPARAMS closeParenthesis BLOCKCONTENT {
        $$ = new ForLoop(getToken(@1), { ...$3, body: $5 })
    };

FORSEQPARAMS : DECLARATION semicolom EXPRESSIONS semicolom ASSIGNMENT {
        $$ = { withDeclarations: true, 
        assignments: [$1], condition: $3, modifiers: $5 }
    }
    | ASSIGNMENTS semicolom EXPRESSIONS semicolom ASSIGNMENT {
        $$ = { assignments: $1, condition: $3, modifiers: $5 }
    };

LOOPESCAPE : breakRw semicolom {
        $$ = new BreakValue(getToken(@1))
    }
    | continueRw semicolom {
        $$ = new ContinueValue(getToken(@1))
    }
    | returnRw EXPRESSIONS semicolom {
        $$ = new ReturnValue(getToken(@1), { content: $2 });
    };