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
}

start with init();