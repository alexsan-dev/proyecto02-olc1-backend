void Principal() {
    WriteLine("-----------Factorial Recursivo---------");
    WriteLine("8! = " + factorialRecursivo(2));
}


int factorialRecursivo(int n) {
    if (n == 0) {
        return 1;
    }
    return (n * factorialRecursivo(n - 1));
}

start With Principal();