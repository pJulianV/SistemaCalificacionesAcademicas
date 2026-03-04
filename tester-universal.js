/**
 * SISTEMA DE TESTING AUTOMATIZADO UNIVERSAL
 * 
 * Funciona para CUALQUIER función JavaScript sin conocer su dominio
 * Detecta problemas mediante análisis genérico de:
 * 1. Patrones de código problemáticos
 * 2. Validaciones faltantes
 * 3. Comportamiento con inputs variados
 * 4. Consistencia y estabilidad
 */

class TesterUniversal {
    constructor() {
        this.problemas = [];
        this.advertencias = [];
        this.metricas = {};
        this.comportamientos = [];
    }
    
    // ==========================================
    // CONFIGURACIÓN INICIAL
    // ==========================================
    
    configurar(config) {
        this.config = {
            funcionPrincipal: config.funcionPrincipal || null,
            parametros: config.parametros || [],
            rangoValores: config.rangoValores || {},
            ...config
        };
    }
    
    // ==========================================
    // FASE 1: ANÁLISIS ESTÁTICO GENÉRICO
    // ==========================================
    
    analizarEstructura() {
        console.log("🔍 FASE 1: Análisis estático del código...");
        
        if (!this.config.funcionPrincipal) {
            this.problemas.push({
                severidad: 'CRÍTICO',
                categoria: 'Configuración',
                descripcion: 'No se especificó función a analizar'
            });
            return;
        }
        
        const funcion = window[this.config.funcionPrincipal];
        
        if (typeof funcion !== 'function') {
            this.problemas.push({
                severidad: 'CRÍTICO',
                categoria: 'Estructura',
                descripcion: `"${this.config.funcionPrincipal}" no existe o no es una función`
            });
            return;
        }
        
        const codigo = funcion.toString();
        
        // Análisis genérico
        this.calcularMetricas(codigo);
        this.detectarPatronesProblematicos(codigo);
        this.analizarValidaciones(codigo);
        this.analizarOperacionesMatematicas(codigo);
    }
    
    calcularMetricas(codigo) {
        console.log("  → Calculando métricas de código...");
        
        // Líneas de código
        this.metricas.lineas = codigo.split('\n').length;
        
        const complejidad = ['if', 'else', 'for', 'while', 'case'];
        this.metricas.complejidad = 1;
        complejidad.forEach(palabra => {
            const matches = codigo.match(new RegExp(`\\b${palabra}\\b`, 'g'));
            if (matches) this.metricas.complejidad += matches.length;
        });

        // Contar operadores por separado
        const operadores = ['&&', '\\|\\|', '\\?'];
        operadores.forEach(op => {
            const matches = codigo.match(new RegExp(op, 'g'));
            if (matches) this.metricas.complejidad += matches.length;
        });
        
        // Número de parámetros
        const matchParams = codigo.match(/function\s*\w*\s*\(([^)]*)\)/);
        this.metricas.parametros = matchParams ? 
            matchParams[1].split(',').filter(p => p.trim()).length : 0;
        
        // Comentarios
        const comentarios = codigo.match(/\/\/.*|\/\*[\s\S]*?\*\//g);
        this.metricas.comentarios = comentarios ? comentarios.length : 0;
        
        // Evaluación
        if (this.metricas.complejidad > 15) {
            this.advertencias.push({
                severidad: 'ALTO',
                categoria: 'Mantenibilidad',
                descripcion: `Complejidad ciclomática muy alta: ${this.metricas.complejidad}`,
                recomendacion: 'Refactorizar en funciones más pequeñas'
            });
        }
        
        if (this.metricas.lineas > 100) {
            this.advertencias.push({
                severidad: 'MEDIO',
                categoria: 'Mantenibilidad',
                descripcion: `Función muy extensa: ${this.metricas.lineas} líneas`,
                recomendacion: 'Considerar dividir responsabilidades'
            });
        }
        
        if (this.metricas.parametros > 5) {
            this.advertencias.push({
                severidad: 'MEDIO',
                categoria: 'Diseño',
                descripcion: `Muchos parámetros: ${this.metricas.parametros}`,
                recomendacion: 'Considerar usar un objeto de configuración'
            });
        }
    }
    
    detectarPatronesProblematicos(codigo) {
        console.log("  → Detectando patrones problemáticos...");
        
        // 1. Conversiones numéricas sin validación
        const tieneConversion = /parse(Int|Float)/i.test(codigo);
        const tieneValidacionNaN = /isNaN|Number\.isNaN/i.test(codigo);
        
        if (tieneConversion && !tieneValidacionNaN) {
            this.problemas.push({
                severidad: 'ALTO',
                categoria: 'Validación',
                descripcion: 'Conversión numérica sin validación de NaN',
                detalle: 'Se detecta parseFloat/parseInt sin verificar isNaN',
                impacto: 'Puede procesar valores inválidos como NaN',
                solucion: 'Agregar validación: if (isNaN(valor)) { ... }'
            });
        }
        
        // 2. Divisiones potencialmente peligrosas
        const divisiones = [...codigo.matchAll(/\/\s*([a-zA-Z_$][\w$]*)/g)];
        divisiones.forEach(match => {
            const divisor = match[1];
            // Verificar si hay validación de cero
            const regexCero = new RegExp(`${divisor}\\s*[!=]==?\\s*0`, 'g');
            
            if (!regexCero.test(codigo)) {
                this.problemas.push({
                    severidad: 'ALTO',
                    categoria: 'División por Cero',
                    descripcion: `División sin validar que "${divisor}" sea diferente de cero`,
                    detalle: `Expresión encontrada: ".../${divisor}"`,
                    impacto: 'Puede causar resultado Infinity o NaN',
                    solucion: `Validar: if (${divisor} === 0) { ... }`
                });
            }
        });
        
        // 3. Comparaciones con == en lugar de ===
        const comparacionesDebiles = codigo.match(/[^=!><]={2}[^=]/g);
        if (comparacionesDebiles && comparacionesDebiles.length > 0) {
            this.advertencias.push({
                severidad: 'BAJO',
                categoria: 'Buenas Prácticas',
                descripcion: 'Uso de == en lugar de ===',
                recomendacion: 'Usar === para comparación estricta'
            });
        }
        
        // 4. Variables no declaradas (var en lugar de let/const)
        const usaVar = /\bvar\b/g.test(codigo);
        if (usaVar) {
            this.advertencias.push({
                severidad: 'BAJO',
                categoria: 'Buenas Prácticas',
                descripcion: 'Uso de "var" (ES5) en lugar de let/const (ES6+)',
                recomendacion: 'Usar let o const para mejor scope'
            });
        }
        
        // 5. Falta de return explícito
        const tieneReturn = /\breturn\b/g.test(codigo);
        if (!tieneReturn) {
            this.advertencias.push({
                severidad: 'MEDIO',
                categoria: 'Lógica',
                descripcion: 'Función sin return explícito',
                recomendacion: 'Verificar si debe retornar un valor'
            });
        }
        
        // 6. Console.log en código (probablemente debugging)
        const tieneConsoleLog = /console\.log/g.test(codigo);
        if (tieneConsoleLog) {
            this.advertencias.push({
                severidad: 'BAJO',
                categoria: 'Limpieza',
                descripcion: 'Contiene console.log (posible código de debug)',
                recomendacion: 'Remover console.log antes de producción'
            });
        }
    }
    
    analizarValidaciones(codigo) {
        console.log("  → Analizando validaciones...");
        
        // Buscar parámetros de la función
        const matchParams = codigo.match(/function\s*\w*\s*\(([^)]*)\)/);
        if (!matchParams) return;
        
        const parametros = matchParams[1].split(',').map(p => p.trim()).filter(Boolean);
        
        parametros.forEach(param => {
            // Verificar validaciones básicas para cada parámetro
            const tieneValidacionTipo = new RegExp(`typeof\\s+${param}|isNaN\\(${param}\\)`).test(codigo);
            const tieneValidacionNull = new RegExp(`${param}\\s*[!=]==?\\s*null|!${param}\\b`).test(codigo);
            const tieneValidacionRango = new RegExp(`${param}\\s*[<>]=?`).test(codigo);
            
            if (!tieneValidacionTipo && !tieneValidacionNull) {
                this.advertencias.push({
                    severidad: 'MEDIO',
                    categoria: 'Validación',
                    descripcion: `Parámetro "${param}" sin validación de tipo o existencia`,
                    recomendacion: 'Agregar validación de tipo y valores nulos'
                });
            }
            
            if (!tieneValidacionRango && this.config.rangoValores && this.config.rangoValores[param]) {
                this.advertencias.push({
                    severidad: 'MEDIO',
                    categoria: 'Validación',
                    descripcion: `Parámetro "${param}" sin validación de rango`,
                    recomendacion: `Validar rango según especificación: ${JSON.stringify(this.config.rangoValores[param])}`
                });
            }
        });
        
        // Validación de negativos (genérico para valores numéricos)
        const validaNegativo = /<\s*0|<=\s*0/g.test(codigo);
        if (!validaNegativo) {
            this.advertencias.push({
                severidad: 'BAJO',
                categoria: 'Validación',
                descripcion: 'No se detecta validación de valores negativos',
                recomendacion: 'Verificar si los valores pueden ser negativos según lógica de negocio'
            });
        }
    }
    
    analizarOperacionesMatematicas(codigo) {
        console.log("  → Analizando operaciones matemáticas...");
        
        // Detectar tipo de redondeo
        const tieneFloor = /Math\.floor/g.test(codigo);
        const tieneCeil = /Math\.ceil/g.test(codigo);
        const tieneRound = /Math\.round/g.test(codigo);
        const tieneToFixed = /\.toFixed/g.test(codigo);
        
        if (tieneFloor) {
            this.advertencias.push({
                severidad: 'BAJO',
                categoria: 'Precisión',
                descripcion: 'Uso de Math.floor (redondea hacia abajo)',
                recomendacion: 'Verificar si truncar es intencional o debería usar Math.round()'
            });
        }
        
        if (tieneCeil) {
            this.advertencias.push({
                severidad: 'BAJO',
                categoria: 'Precisión',
                descripcion: 'Uso de Math.ceil (redondea hacia arriba)',
                recomendacion: 'Verificar si redondear hacia arriba es intencional'
            });
        }
        
        if (!tieneFloor && !tieneCeil && !tieneRound && !tieneToFixed) {
            this.advertencias.push({
                severidad: 'BAJO',
                categoria: 'Precisión',
                descripcion: 'No se detecta redondeo explícito de decimales',
                recomendacion: 'Considerar usar Math.round() o toFixed() para consistencia'
            });
        }
        
        // Detectar operaciones con porcentajes
        const divideEntre100 = /\/\s*100/g.test(codigo);
        const multiplicaPor100 = /\*\s*100/g.test(codigo);
        
        if (!divideEntre100 && !multiplicaPor100) {
            this.advertencias.push({
                severidad: 'BAJO',
                categoria: 'Lógica',
                descripcion: 'No se detecta conversión de porcentajes (/ 100 o * 100)',
                recomendacion: 'Si maneja porcentajes, verificar conversión correcta'
            });
        }
    }
    
    // ==========================================
    // FASE 2: PRUEBAS FUNCIONALES GENÉRICAS
    // ==========================================
    
    ejecutarPruebasFuncionales() {
        console.log("\n🧪 FASE 2: Pruebas funcionales genéricas...");
        
        const funcion = window[this.config.funcionPrincipal];
        
        // Generar casos de prueba automáticamente
        const casos = this.generarCasosGenericos();
        
        casos.forEach(caso => {
            this.ejecutarCaso(funcion, caso);
        });
    }
    
    generarCasosGenericos() {
        const casos = [];
        const params = this.config.parametros;
        
        if (params.length === 0) {
            console.warn("⚠️ No se especificaron parámetros, pruebas limitadas");
            return casos;
        }
        
        // CASO 1: Valores normales (medios del rango)
        const valoresNormales = {};
        params.forEach(param => {
            const rango = this.config.rangoValores && this.config.rangoValores[param];
            if (rango) {
                valoresNormales[param] = (rango.min + rango.max) / 2;
            } else {
                valoresNormales[param] = 100; // Valor por defecto
            }
        });
        casos.push({ nombre: 'Valores Normales', valores: valoresNormales, tipo: 'normal' });
        
        // CASO 2: Valores mínimos
        const valoresMinimos = {};
        params.forEach(param => {
            const rango = this.config.rangoValores && this.config.rangoValores[param];
            valoresMinimos[param] = rango ? rango.min : 1;
        });
        casos.push({ nombre: 'Valores Mínimos', valores: valoresMinimos, tipo: 'limite' });
        
        // CASO 3: Valores máximos
        const valoresMaximos = {};
        params.forEach(param => {
            const rango = this.config.rangoValores && this.config.rangoValores[param];
            valoresMaximos[param] = rango ? rango.max : 1000;
        });
        casos.push({ nombre: 'Valores Máximos', valores: valoresMaximos, tipo: 'limite' });
        
        // CASO 4: Todos cero
        const valoresCero = {};
        params.forEach(param => {
            valoresCero[param] = 0;
        });
        casos.push({ nombre: 'Todos Cero', valores: valoresCero, tipo: 'extremo', debeRechazar: true });
        
        // CASO 5: Valores negativos
        const valoresNegativos = {};
        params.forEach(param => {
            valoresNegativos[param] = -100;
        });
        casos.push({ nombre: 'Valores Negativos', valores: valoresNegativos, tipo: 'extremo', debeRechazar: true });
        
        // CASO 6: Valores muy grandes
        const valoresGrandes = {};
        params.forEach(param => {
            valoresGrandes[param] = 999999999;
        });
        casos.push({ nombre: 'Valores Muy Grandes', valores: valoresGrandes, tipo: 'extremo' });
        
        // CASO 7: Valores NaN
        const valoresNaN = {};
        params.forEach(param => {
            valoresNaN[param] = NaN;
        });
        casos.push({ nombre: 'Valores NaN', valores: valoresNaN, tipo: 'invalido', debeRechazar: true });
        
        // CASO 8: Valores null
        const valoresNull = {};
        params.forEach(param => {
            valoresNull[param] = null;
        });
        casos.push({ nombre: 'Valores Null', valores: valoresNull, tipo: 'invalido', debeRechazar: true });
        
        // CASO 9: Valores undefined
        const valoresUndefined = {};
        params.forEach(param => {
            valoresUndefined[param] = undefined;
        });
        casos.push({ nombre: 'Valores Undefined', valores: valoresUndefined, tipo: 'invalido', debeRechazar: true });
        
        // CASO 10: Valores string
        const valoresString = {};
        params.forEach(param => {
            valoresString[param] = "abc123";
        });
        casos.push({ nombre: 'Valores String', valores: valoresString, tipo: 'invalido', debeRechazar: true });
        
        // CASOS ALEATORIOS (Fuzzing)
        for (let i = 0; i < 10; i++) {
            const valoresAleatorios = {};
            params.forEach(param => {
                const rango = this.config.rangoValores && this.config.rangoValores[param];
                if (rango) {
                    valoresAleatorios[param] = Math.random() * (rango.max - rango.min) + rango.min;
                } else {
                    valoresAleatorios[param] = Math.random() * 1000;
                }
            });
            casos.push({ nombre: `Aleatorio ${i+1}`, valores: valoresAleatorios, tipo: 'fuzzing' });
        }
        
        return casos;
    }
    
    ejecutarCaso(funcion, caso) {
        try {
            // Convertir objeto de valores a array en orden
            const args = this.config.parametros.map(param => caso.valores[param]);
            
            const resultado = funcion(...args);
            
            // Registrar comportamiento
            this.comportamientos.push({
                caso: caso.nombre,
                entrada: args,
                salida: resultado,
                tipo: caso.tipo
            });
            
            // Validar resultado
            this.validarResultado(caso, resultado, args);
            
        } catch (error) {
            this.comportamientos.push({
                caso: caso.nombre,
                entrada: Object.values(caso.valores),
                error: error.message,
                tipo: caso.tipo
            });
            
            if (!caso.debeRechazar) {
                this.problemas.push({
                    severidad: 'ALTO',
                    categoria: 'Excepción',
                    descripcion: `Caso "${caso.nombre}" lanzó excepción`,
                    detalle: error.message,
                    impacto: 'La función falla con ciertos inputs',
                    entrada: JSON.stringify(caso.valores)
                });
            }
        }
    }
    
    validarResultado(caso, resultado, entrada) {
        // 1. Validar que sea un valor válido
        if (resultado === undefined && !caso.debeRechazar) {
            this.problemas.push({
                severidad: 'ALTO',
                categoria: 'Lógica',
                descripcion: `Caso "${caso.nombre}" devolvió undefined`,
                detalle: 'La función no retorna valor',
                entrada: JSON.stringify(entrada)
            });
        }
        
        if (typeof resultado === 'number') {
            // 2. Validar NaN
            if (isNaN(resultado) && !caso.debeRechazar) {
                this.problemas.push({
                    severidad: 'CRÍTICO',
                    categoria: 'Cálculo',
                    descripcion: `Caso "${caso.nombre}" devolvió NaN`,
                    detalle: 'El cálculo produjo Not-a-Number',
                    impacto: 'Resultado inválido para operaciones numéricas',
                    entrada: JSON.stringify(entrada)
                });
            }
            
            // 3. Validar Infinity
            if (!isFinite(resultado) && !caso.debeRechazar) {
                this.problemas.push({
                    severidad: 'CRÍTICO',
                    categoria: 'Cálculo',
                    descripcion: `Caso "${caso.nombre}" devolvió Infinity`,
                    detalle: 'Probablemente división por cero',
                    impacto: 'Resultado inválido',
                    entrada: JSON.stringify(entrada)
                });
            }
            
            // 4. Validar negativos cuando no tienen sentido
            if (resultado < 0 && caso.tipo === 'normal') {
                this.advertencias.push({
                    severidad: 'MEDIO',
                    categoria: 'Lógica',
                    descripcion: `Caso "${caso.nombre}" devolvió valor negativo`,
                    detalle: `Resultado: ${resultado}`,
                    recomendacion: 'Verificar si valores negativos tienen sentido en este contexto'
                });
            }
        }
        
        // 5. Validar casos que deberían rechazarse
        if (caso.debeRechazar && resultado !== null && resultado !== undefined && !isNaN(resultado)) {
            this.problemas.push({
                severidad: 'ALTO',
                categoria: 'Validación',
                descripcion: `Caso "${caso.nombre}" NO rechazó input inválido`,
                detalle: `Aceptó: ${JSON.stringify(entrada)} y devolvió: ${resultado}`,
                impacto: 'La función acepta valores que debería rechazar',
                solucion: 'Agregar validaciones de entrada apropiadas'
            });
        }
    }
    
    // ==========================================
    // FASE 3: ANÁLISIS DE CONSISTENCIA
    // ==========================================
    
    analizarConsistencia() {
        console.log("\n📊 FASE 3: Análisis de consistencia...");
        
        // Verificar consistencia en comportamientos
        const comportamientosSimilares = this.agruparComportamientosSimilares();
        
        comportamientosSimilares.forEach(grupo => {
            if (grupo.length > 1) {
                const salidas = grupo.map(c => c.salida);
                const salidasUnicas = [...new Set(salidas)];
                
                if (salidasUnicas.length > 1) {
                    this.advertencias.push({
                        severidad: 'MEDIO',
                        categoria: 'Consistencia',
                        descripcion: 'Entradas similares producen salidas diferentes',
                        detalle: `Casos: ${grupo.map(c => c.caso).join(', ')}`,
                        recomendacion: 'Verificar si la variabilidad es esperada'
                    });
                }
            }
        });
    }
    
    agruparComportamientosSimilares() {
        // Agrupar comportamientos por tipo
        const grupos = {};
        
        this.comportamientos.forEach(comp => {
            if (!grupos[comp.tipo]) {
                grupos[comp.tipo] = [];
            }
            grupos[comp.tipo].push(comp);
        });
        
        return Object.values(grupos);
    }
    
    // ==========================================
    // FASE 4: GENERAR REPORTE
    // ==========================================
    
    generarReporte() {
        console.log("\n📋 FASE 4: Generando reporte...");
        
        const divReporte = document.getElementById('reporteTest');
        
        const totalTests = this.comportamientos.length;
        const testsExitosos = this.comportamientos.filter(c => !c.error && c.salida !== undefined).length;
        const testsConError = this.comportamientos.filter(c => c.error).length;
        const porcentajeExito = totalTests > 0 ? ((testsExitosos / totalTests) * 100).toFixed(1) : 0;
        
        let html = `
            <h3>🔍 Reporte de Auditoría Automática</h3>
            <p style="color: #666; margin-bottom: 20px;">
                Función analizada: <strong>${this.config.funcionPrincipal}</strong>
            </p>
            
            <div class="stats">
                <div class="stat-box">
                    <div class="stat-numero">${this.problemas.length}</div>
                    <div class="stat-label">Problemas</div>
                </div>
                <div class="stat-box">
                    <div class="stat-numero">${this.advertencias.length}</div>
                    <div class="stat-label">Advertencias</div>
                </div>
                <div class="stat-box">
                    <div class="stat-numero">${totalTests}</div>
                    <div class="stat-label">Tests Ejecutados</div>
                </div>
                <div class="stat-box">
                    <div class="stat-numero">${porcentajeExito}%</div>
                    <div class="stat-label">Tasa Éxito</div>
                </div>
            </div>
            
            <h4 style="margin-top: 20px; color: #856404;">📐 Métricas de Calidad:</h4>
            <div class="bug bug-bajo">
                <strong>Complejidad Ciclomática:</strong> ${this.metricas.complejidad || 'N/A'} 
                ${this.metricas.complejidad > 10 ? '⚠️ (Alta)' : '✓ (Aceptable)'}<br>
                <strong>Líneas de Código:</strong> ${this.metricas.lineas || 'N/A'}<br>
                <strong>Parámetros:</strong> ${this.metricas.parametros || 'N/A'}<br>
                <strong>Tests Exitosos:</strong> ${testsExitosos}/${totalTests}
            </div>
        `;
        
        // Agrupar problemas por severidad
        const criticos = this.problemas.filter(p => p.severidad === 'CRÍTICO');
        const altos = this.problemas.filter(p => p.severidad === 'ALTO');
        const medios = this.problemas.filter(p => p.severidad === 'MEDIO');
        const bajos = this.problemas.filter(p => p.severidad === 'BAJO');
        
        if (criticos.length > 0) {
            html += '<h4 style="margin-top: 20px; color: #dc3545;">🔴 PROBLEMAS CRÍTICOS:</h4>';
            criticos.forEach((p, i) => html += this.formatearProblema(p, i + 1));
        }
        
        if (altos.length > 0) {
            html += '<h4 style="margin-top: 20px; color: #fd7e14;">🟠 PROBLEMAS ALTOS:</h4>';
            altos.forEach((p, i) => html += this.formatearProblema(p, i + 1));
        }
        
        if (medios.length > 0) {
            html += '<h4 style="margin-top: 20px; color: #ffc107;">🟡 PROBLEMAS MEDIOS:</h4>';
            medios.forEach((p, i) => html += this.formatearProblema(p, i + 1));
        }
        
        if (bajos.length > 0) {
            html += '<h4 style="margin-top: 20px; color: #28a745;">🟢 PROBLEMAS BAJOS:</h4>';
            bajos.forEach((p, i) => html += this.formatearProblema(p, i + 1));
        }
        
        if (this.advertencias.length > 0) {
            html += '<h4 style="margin-top: 20px; color: #856404;">⚠️ Advertencias y Recomendaciones:</h4>';
            this.advertencias.forEach((adv, i) => {
                html += `
                    <div class="bug bug-medio">
                        <div class="bug-header">${i + 1}. [${adv.severidad}] ${adv.categoria}: ${adv.descripcion}</div>
                        ${adv.recomendacion ? `<div class="bug-detalle"><strong>Recomendación:</strong> ${adv.recomendacion}</div>` : ''}
                    </div>
                `;
            });
        }
        
        if (this.problemas.length === 0 && this.advertencias.length === 0) {
            html += `
                <div class="bug bug-bajo" style="border-left-color: #28a745; margin-top: 20px;">
                    <div class="bug-header" style="color: #28a745;">✅ ¡Excelente Calidad!</div>
                    <div class="bug-detalle">
                        No se detectaron problemas significativos en el análisis automático.<br>
                        El código cumple con buenas prácticas básicas de programación.
                    </div>
                </div>
            `;
        }
        
        divReporte.innerHTML = html;
        divReporte.classList.remove('oculto');
        divReporte.scrollIntoView({ behavior: 'smooth' });
    }
    
    formatearProblema(problema, numero) {
        const clase = `bug-${problema.severidad.toLowerCase()}`;
        return `
            <div class="bug ${clase}">
                <div class="bug-header">
                    ${numero}. [${problema.severidad}] ${problema.categoria}: ${problema.descripcion}
                </div>
                <div class="bug-detalle">
                    ${problema.detalle ? `<strong>Detalle:</strong> ${problema.detalle}<br>` : ''}
                    ${problema.entrada ? `<strong>Entrada:</strong> ${problema.entrada}<br>` : ''}
                    ${problema.impacto ? `<strong>Impacto:</strong> ${problema.impacto}<br>` : ''}
                    ${problema.solucion ? `<strong>Solución:</strong> ${problema.solucion}` : ''}
                </div>
            </div>
        `;
    }
    
    // ==========================================
    // EJECUTAR TODO EL PROCESO
    // ==========================================
    
    ejecutarAuditoria() {
        this.analizarEstructura();
        this.ejecutarPruebasFuncionales();
        this.analizarConsistencia();
        this.generarReporte();
    }
}

// ==========================================
// FUNCIÓN PRINCIPAL CON CONFIGURACIÓN
// ==========================================

function ejecutarPruebas() {
    console.log("🚀 Iniciando auditoría de código universal...");
    console.log("=".repeat(60));
    
    const tester = new TesterUniversal();
    
    // CONFIGURACIÓN: Aquí se especifica qué función probar
    tester.configurar({
        funcionPrincipal: 'calcularCuotaInterna',  // Nombre de la función a probar
        parametros: ['monto', 'tasaAnual', 'plazo'],  // Nombres de parámetros
        rangoValores: {  // Rangos esperados (opcional pero recomendado)
            monto: { min: 1000000, max: 50000000 },
            tasaAnual: { min: 0.5, max: 30 },
            plazo: { min: 12, max: 60 }
        }
    });
    
    tester.ejecutarAuditoria();
    
    console.log("=".repeat(60));
    console.log("✅ Auditoría completada");
}