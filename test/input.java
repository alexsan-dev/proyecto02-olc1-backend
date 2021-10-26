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
}


start with init();