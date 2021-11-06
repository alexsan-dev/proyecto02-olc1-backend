/*
    DECLARAMOS UN VECTOR DE 15 POSICIONES
    SE IMPRIMRÁ Y POSTERIORMENTE SE ORDENARÁ
*/
int vectorNumeros[] = new int[15];
vectorNumeros[0] = 200;
vectorNumeros[1] = 26;
vectorNumeros[2] = 1;
vectorNumeros[3] = 15;
vectorNumeros[4] = 167;
vectorNumeros[5] = 0;
vectorNumeros[6] = 76;
vectorNumeros[7] = 94;
vectorNumeros[8] = 25;
vectorNumeros[9] = 44;
vectorNumeros[10] = 5;
vectorNumeros[11] = 59;
vectorNumeros[12] = 95;
vectorNumeros[13] = 10;
vectorNumeros[14] = 23;

/*
    DECLARAMOS UNA LISTA
*/
DynamicList<string> frase = new DynamicList<string>;

void Hanoi(int discos, int origen, int auxiliar, int destino) {
    if (discos == 1) {
        writeLine("Mover disco de " + origen + " a " + destino);
    } else {
        Hanoi(discos - 1, origen, destino, auxiliar);
        writeLine("Mover disco de " + origen + " a " + destino);
        Hanoi(discos - 1, auxiliar, origen, destino);
    }
}

void imprimirVector(){
    for (int i = 0; i < length(vectorNumeros); i++) {
        writeLine("vectorNumeros[" + i + "] = " + vectorNumeros[i]);
    }
}

void BubbleSort(){
    for (int i = 0; i < length(vectorNumeros); i++)
    {
        for (int j = 0; j < length(vectorNumeros) - i - 1; j++)
        {
            if (vectorNumeros[j] > vectorNumeros[j + 1]) {
                int temp;
                temp = vectorNumeros[j];
                vectorNumeros[j] = vectorNumeros[j + 1];
                vectorNumeros[j + 1] = temp;
            }
        }
    }
}

void agregarValorLista(string letra){
    append(frase, letra);
}

void imprimirLista(){
    for (int i = 0; i < length(frase); i++) {
        writeLine("frase[[" + i + "]] = " + frase[i]);
    }
}

string mensajeVolteado(){
    string mensaje="";
    for(int i=length(frase)-1;i>=0;i--){
        mensaje=mensaje+frase[i];
    }
    return mensaje;
}

start with Archivo3();

void ParoImpar(int a) {
    if (par(a) == 1) { // El número es Par
        writeLine("El numero '" + a + "'" + " es Par");
    } else { // El número es impar
        writeLine("El numero '" + a + "'" + " es Impar");
    }
}

int par(int nump) {
    if (nump == 0) {
        return 1;
    }
    return impar(nump - 1);
}

int impar(int numi) {
    if (numi == 0) {
        return 0;
    }
    return par(numi - 1);
}

int ackermanPuntosMenos(int m, int n)
{
    if (m == 0) {
        return n + 1;
    } else if (m > 0 && n == 0) {
        return ackermanPuntosMenos(m - 1, 1);
    } else {
        return ackermanPuntosMenos(m - 1, ackermanPuntosMenos(m, n - 1));
    }
}

int ackerman(int m, int n)
{
    return (m == 0 ? n + 1 : (m > 0 && n == 0 ? ackerman(m - 1, 1) : ackerman(m - 1, ackerman(m, n - 1))));
}

void Archivo3(){
    writeLine("====================ARCHIVO 3====================");
    writeLine("**************SECCION DE VECTORES****************");
    writeLine("---Vector Desordenado---");
    imprimirVector();
    BubbleSort(vectorNumeros);
    writeLine("-----Vector Ordenado----");
    imprimirVector();
    writeLine("************FIN DE SECCION VECTORES***************");
    writeLine("****************SECCION DE LISTAS****************");
    //agregamos valores a la lista
    agregarValorLista(")");
    agregarValorLista(":");
    agregarValorLista(" ");
    agregarValorLista("1");
    agregarValorLista("I");
    agregarValorLista("P");
    agregarValorLista("M");
    agregarValorLista("O");
    agregarValorLista("C");
    agregarValorLista(" ");
    agregarValorLista("E");
    agregarValorLista("L");
    agregarValorLista("A");
    agregarValorLista("S");
    agregarValorLista(" ");
    agregarValorLista("I");
    agregarValorLista("S");
    imprimirLista(frase);
    writeLine("El mensaje es:");
    writeLine(mensajeVolteado(frase));
    writeLine("************FIN DE SECCION DE LISTAS**************");
    writeLine("**************SECCION DE CASTEOS***************");
    Casteos();
    writeLine("************FIN DE SECCION DE CASTEOS*************");
    writeLine("**************SECCION DE NATIVAS***************");
    FuncionesEspecialesNativas();
    writeLine("************FIN DE SECCION DE NATIVAS*************");
    writeLine("***********SECCION DE RECURSIVIDAD***************");
    writeLine("---------------FUNCION FIBONACCI-----------------");
    imprimir_fibonacci(10);
    writeLine("-------------------------------------------------");
    writeLine("---------------FUNCION PAR-IMPAR-----------------");
    ParoImpar(71);
    writeLine("-------------------------------------------------");
    writeLine("----------------TORRES DE HANOI------------------");
    int discos = 3;
    int origen = 1;
    int auxiliar = 2;
    int destino = 3;
    Hanoi(discos, origen, auxiliar, destino);
    writeLine("-------------------------------------------------");
    writeLine("---------------FUNCION ACKERMANN-----------------");
    int m = 3;
    int n = 4;
    writeLine("Funcion de Ackerman (" + m + ", " + n + ") = " + ackerman(m, n));
    //writeLine("Funcion de Ackerman Puntos Menos (" + m + ", " + n + ") = " + ackermanPuntosMenos(m, n));
    writeLine("-------------------------------------------------");
    writeLine("*************FIN DE RECURSIVIDAD*****************");
    writeLine("=================================================");
}

void Casteos(){
    writeLine("int a "+typeof((double) 1789));
    writeLine("double a "+ typeof((int) 258.2));
    writeLine("char  a "+ typeof((double) 'F'));
    writeLine("int a "+typeof((char) 98));
    writeLine("double a "+typeof(toString(2589.97)));
}

void FuncionesEspecialesNativas(){
    writeLine("------------------LENGTH-------------------");
    writeLine("vectorNumero es de "+length(vectorNumeros)+" elementos");
    writeLine("La lista frase tiene "+length(frase)+" elementos");
    int a = 15;
    writeLine("------------------TOLOWER-------------------");
    writeLine("SIN TOLOWER");
    writeLine(toLower("CON TOLOWER"));
    writeLine("------------------TOUPPER-------------------");
    writeLine("sin toupper");
    writeLine(toUpper("con toupper"));
    writeLine("------------------TRUNCATE------------------");
    double b=17.8;
    writeLine("sin truncate: "+b);
    b=truncate(b);
    writeLine("con truncate "+b);
    writeLine("------------------ROUND-------------------");
    double c=26.5;
    writeLine("sin round: "+c);
    c=round(c);
    writeLine("con round "+c);
    double cc=26.4;
    writeLine("sin round: "+cc);
    cc=round(cc);
    writeLine("con round "+cc);
    writeLine("-----------------TYPEOF--------------------");
    string x="soy una cadena";
    int y = 50;
    double z = 78.5;
    char xx = 'a';
    boolean yy = true;
    writeLine("tipo: "+typeof(x));
    writeLine("tipo: "+typeof(y));
    writeLine("tipo: "+typeof(z));
    writeLine("tipo: "+typeof(xx));
    writeLine("tipo: "+typeof(yy));
    writeLine("------------------LENGTH-------------------");
    string cadena="soy una cadena";
    writeLine("tamaño: "+length(cadena));
    writeLine("------------------TOSTRING-------------------");
    int numero=105;
    writeLine("tipo: "+typeof(numero));
    writeLine("tipo: "+typeof(toString(numero)));
    writeLine("----------------TOCHARARRAY------------------");
    DynamicList<char> listaChar = toCharArray("SOY UNA LISTA");
    writeLine("########imprimiendo lista de caracteres#######");
    imprimirListaChar(listaChar);
}

void imprimirListaChar(){
    for (int i = 0; i < length(frase); i++) {
        writeLine("listaChar[[" + i + "]] = " + frase[i]);
    }
}

void imprimir_fibonacci(int valor) {
    writeLine("Resultado de fibonacci(" + valor + ") = " + fibonacci(valor));
}

int fibonacci(int n) {
    if (n > 1) {
        return fibonacci(n - 1) + fibonacci(n - 2);
    } else if (n == 1) {
        return 1;
    } else if (n == 0) {
        return 0;
    } else {
        writeLine("error");
        return 0;
    }
}
