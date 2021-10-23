String hello = "Hello world";
int c = 1;

int getSum(int a, int b) {
  return a + b + c;
}

void setHello() {
  String hello = "Hello local";
  hello = "New hello";
}

void init() {
  int num[] = { 1, getSum(1, 1), 3, 4 };
  num[0] = 7;
  boolean condition = getSum(num[0], 1) != 3;
  int newValue = condition ? 90 : 7;
  num[getSum(1, 0)] = newValue;
  setHello();
  writeLine("Calculos: " + num);
  writeLine("Nuevo valor: " + hello);
  int count = 5;

  if(count == 0){
    writeLine("en if");
  } 
  else if (count == 1){
    writeLine("en else if 1");
  }
   else if(count == 2) {
    writeLine("en else if 2");
  }
  else {
    if( count == 3) {
    writeLine("en else - if");
    } else if (count == 4 ){
      writeLine("en else - else if 1");
    } else {
      writeLine("en else - else ");
    }
  }
}

start with init();