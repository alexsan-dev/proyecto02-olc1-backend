void Principal(){
    WriteLine("-----------Factorial Recursivo---------");
    WriteLine("8! = " + factorialRecursivo(8));
}


int factorialRecursivo(int n) {
    if (n == 0) {
        return 1;
    }
    return (n * factorialRecursivo(n - 1));
}

start With Principal();

/*
--------------------SALIDA ESPERADA-----------------
-----------Factorial Iterativo---------
8! = 40320
-----------Factorial Recursivo---------
8! = 40320
*/