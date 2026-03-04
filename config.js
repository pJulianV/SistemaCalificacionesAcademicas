function ejecutarPruebas() {
    const t = new TesterUniversal();

    // wrapper that sets the five notes and weights, fires the calculation
    window.__testMain = (...a) => {
        for (let i = 1; i <= 5; i++) {
            document.getElementById('nota' + i).value = a[(i - 1) * 2] || 0;
            document.getElementById('peso' + i).value = a[(i - 1) * 2 + 1] || 0;
        }
        document.getElementById('btnCalcular').click();
        return Number(document.getElementById('promedio').textContent) || NaN;
    };

    t.configurar({
        funcionPrincipal: '__testMain',
        parametros: ['nota1','peso1','nota2','peso2','nota3','peso3','nota4','peso4','nota5','peso5'],
        rangoValores: {
            nota1:{min:0,max:5}, peso1:{min:0,max:100},
            nota2:{min:0,max:5}, peso2:{min:0,max:100},
            nota3:{min:0,max:5}, peso3:{min:0,max:100},
            nota4:{min:0,max:5}, peso4:{min:0,max:100},
            nota5:{min:0,max:5}, peso5:{min:0,max:100}
        }
    });

    t.ejecutarAuditoria();
}

