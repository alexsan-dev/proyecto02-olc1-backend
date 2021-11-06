int burbuja[] ( int num[] ){
  int i;
  boolean flag = true;
  int temp;
  while ( flag ){
    flag = false;  

    for( i=0;  i < length(num);  i++ ){
    WriteLine( num[ i ] > num[i+1] );
      if ( num[ i ] > num[i+1] ){
        temp = num[ i ]; 
        num[ i ] = num[ i+1 ];
        num[ i+1 ] = temp;
        flag = true; 
      } 
    } 
  } 
  return num;
}

void main() {

  int arreglo[] = {8,6,7,2,1,8,6,8,7,1,9,7,7,10};
  int arregloOrdenado[] = new int[length(arreglo)]; 
  arregloOrdenado = burbuja(arreglo);
  WriteLine(arregloOrdenado);
}

start with main();