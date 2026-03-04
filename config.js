function ejecutarPruebas() {
    const t = new TesterUniversal();
    const load = () => new Promise(r => {
        if (window._m) return r();
        const s = document.createElement('script');
        s.src = 'main.js'; s.onload = () => (window._m = 1, r());
        document.head.appendChild(s);
    });
    const e = (id,tag='input')=>document.getElementById(id)||document.body.appendChild(Object.assign(document.createElement(tag),{id}));

    load().then(()=>{
        ['btnCalcular','nombre','promedio','estado','cualitativa'].forEach(id=>e(id));
        for(let i=1;i<=5;i++){e('nota'+i);e('peso'+i);}        
        window.__testMain=(...a)=>{
            for(let i=1;i<=5;i++){
                e('nota'+i).value=a[(i-1)*2]||0;
                e('peso'+i).value=a[(i-1)*2+1]||0;
            }
            ['promedio','estado','cualitativa'].forEach(id=>e(id).textContent='');
            e('btnCalcular').dispatchEvent(new Event('click'));
            return Number(e('promedio').textContent)||NaN;
        };
        t.configurar({
            funcionPrincipal:'__testMain',
            parametros:['nota1','peso1','nota2','peso2','nota3','peso3','nota4','peso4','nota5','peso5'],
            rangoValores:Object.fromEntries(['1','2','3','4','5'].flatMap(i=>[[`nota${i}`,{min:0,max:5}],[`peso${i}`,{min:0,max:100}]]))
        });
        t.ejecutarAuditoria();
    });
}

