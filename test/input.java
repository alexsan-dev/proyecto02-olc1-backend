String hello = "Hello world";
int c = 1;

int getSum(int a, int b) {
  return a + b + c;
}

void setHello() {
  hello = "New hello";
}


void init() {
  int num[] = { 1, getSum(1, 1), 3, 4 };
  num[0] = 7;
  boolean condition = getSum(num[0], 1) != 3;
  int newValue = !condition ? 90 : 7;
  num[getSum(1, 0)] = newValue;
  setHello();
  writeLine("Calculos: " + num);
  writeLine("Nuevo valor: " + hello);
 
  for(int count =0; count < 5; count++){
    if(count == 2) {
      continue;
    } 

    writeLine("Contador for: " + count);
  }

  int count = -1;
  while(count < 4) {
    count++;

    if(count == 2) {
      continue;
    }

    writeLine("Contador while: " + count);
  }

  String count2 = "Hola1";

  switch(count2){
    case "Hola1":
      writeLine("Case 1");
      count2 = "Hola2";
    case "Hola2":
      writeLine("Case 2");
      break;
    case "Hola3":
      writeLine("Case 3");
      break;
    case "Hola4":
      writeLine("Case 4");
      break;
    default:
      writeLine("Default");
      break;
  }

  DynamicList<DynamicList<int>> list = new DynamicList<DynamicList<int>>;
  DynamicList<int> subList = new DynamicList<int>;
  DynamicList<int> subList2 = new DynamicList<int>;
  DynamicList<int> subList3 = new DynamicList<int>;

  append(subList, 1);
  append(subList, 2);
  append(subList, 3);

  append(subList2, 4);
  append(subList2, 5);
  append(subList2, 6);

  append(subList3, 7);
  append(subList3, 8);
  append(subList3, 9);

  append(list, subList);
  append(list, subList2);
  append(list, subList3);

  setValue(list, 0, new DynamicList<int>);

  writeLine(list);
  writeLine(getValue(list, 0));

  // NATIVAS
  String text = "Alex";
  text = toLower(text);
  text = toUpper(text);
  writeLine(text);

  string cad_1 = toUpper("hOla MunDo"); // cad_1 = “HOLA MUNDO”
 string cad_2 = toUpper("resultado = " + 100); // cad_2 = “RESULTADO = 100”

 writeLine(cad_1);
 writeLine(cad_2);

  DynamicList<int> lista2 =new DynamicList <int>;
string vector2[] = {"hola", "Mundo"};
int tam_lista = length(lista2); // tam_lista = 0
int tam_vector = length(vector2); // tam_vector = 2
int tam_hola = length(vector2[0]); // tam_hola = 4


writeLine(tam_lista);
writeLine(tam_vector);
writeLine(tam_hola);

int nuevoValor = truncate(3.53); // nuevoValor = 3
int otroValor = truncate(10); // otroValor = 10
double decimal = 15.4654849;
int entero = truncate(decimal); // entero = 15


writeLine(nuevoValor);
writeLine(otroValor);
writeLine(entero);

Double valor = round(5.8); //valor = 6
Double valor2 = round(5.4); //valor2 = 5

writeLine(valor);
writeLine(valor2);

DynamicList<int> lista22 =new DynamicList <int>;
String tipo = typeof(15); // tipo = “int”
String tipo2 = typeof(15.25); // tipo = “double”
String tipo3 = typeof(lista22); // tipo3 = “lista”
writeLine(tipo);
writeLine(tipo2);
writeLine(tipo3);
writeLine(typeof(vector2));

String valorw2 = toString(14); // valor = “14”
String valorw3 = toString(true); // valor = “true” 

writeLine(valorw2);
writeLine(valorw3);

DynamicList<char> caracteres = toCharArray("Hola");
/*
caracteres [[0]] = “H”
caracteres [[1]] = “o”
caracteres [[2]] = “l”
caracteres [[3]] = “a”
*/

writeLine(caracteres);
writeLine(typeof(caracteres));
}


start with init();