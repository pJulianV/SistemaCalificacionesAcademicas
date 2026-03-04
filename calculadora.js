/**
 * CALCULADORA DE PRÉSTAMOS
 * Esta versión contiene 8 BUGS INTENCIONALES para demostrar el testing
 * 
 * BUGS INCLUIDOS:
 * BUG 1: No convierte tasa anual a mensual correctamente
 * BUG 2: No valida monto mínimo/máximo
 * BUG 3: Permite plazo no estándar
 * BUG 4: Fórmula de cuota incorrecta
 * BUG 5: No valida tasa negativa
 * BUG 6: División por cero cuando tasa = 0
 * BUG 7: No valida que campos estén completos
 * BUG 8: Redondeo incorrecto en cuotas
 */

function calcularPrestamo() {
    // Obtener valores del formulario
    const monto = parseFloat(document.getElementById('monto').value);
    const tasaAnual = parseFloat(document.getElementById('tasaAnual').value);
    const plazo = parseInt(document.getElementById('plazo').value);
    
    // BUG 7: No valida si los campos están vacíos o inválidos
    // DEBERÍA TENER: if (isNaN(monto) || isNaN(tasaAnual) || isNaN(plazo)) { return alert('Complete todos los campos'); }
    
    // BUG 1: Conversión incorrecta de tasa anual a mensual
    // CORRECTO sería: tasaMensual = (tasaAnual / 12) / 100
    const tasaMensual = tasaAnual / 12; // INCORRECTO: Falta dividir entre 100
    
    // BUG 2: No valida rangos de monto
    // DEBERÍA TENER: if (monto < 1000000 || monto > 50000000) { return alert('Monto debe estar entre $1M y $50M'); }
    
    // BUG 3: No valida que plazo sea uno de los permitidos (12,24,36,48,60)
    // DEBERÍA TENER: if (![12,24,36,48,60].includes(plazo)) { return alert('Plazo inválido'); }
    
    // BUG 5: No valida tasa negativa
    // DEBERÍA TENER: if (tasaAnual < 0) { return alert('Tasa no puede ser negativa'); }
    
    // BUG 6: Si tasaMensual = 0, habrá división por cero más adelante
    // DEBERÍA MANEJAR: if (tasaMensual === 0) { ... }
    
    // BUG 4: Fórmula de cuota INCORRECTA
    // FÓRMULA CORRECTA: cuota = [P * r * (1+r)^n] / [(1+r)^n - 1]
    // donde P = monto, r = tasaMensual, n = plazo
    
    // Esta fórmula está SIMPLIFICADA y es INCORRECTA (usa interés simple):
    const cuotaMensual = (monto + (monto * tasaMensual * plazo)) / plazo;
    
    // BUG 8: Redondeo incorrecto - usa Math.floor en vez de Math.round
    const cuotaRedondeada = Math.floor(cuotaMensual); // INCORRECTO: debería ser Math.round()
    
    const totalIntereses = (cuotaRedondeada * plazo) - monto;
    const totalPagar = monto + totalIntereses;
    
    // Mostrar resultados
    mostrarResultado(cuotaRedondeada, totalIntereses, totalPagar, tasaMensual);
}

function mostrarResultado(cuota, intereses, total, tasaMensual) {
    const divResultado = document.getElementById('resultado');
    
    divResultado.innerHTML = `
        <h3>📊 Resultado del Préstamo</h3>
        <div class="resultado-item">
            <span class="resultado-label">Cuota Mensual:</span>
            <span class="resultado-valor">$${cuota.toLocaleString('es-CO')}</span>
        </div>
        <div class="resultado-item">
            <span class="resultado-label">Total Intereses:</span>
            <span class="resultado-valor">$${intereses.toLocaleString('es-CO')}</span>
        </div>
        <div class="resultado-item">
            <span class="resultado-label">Total a Pagar:</span>
            <span class="resultado-valor">$${total.toLocaleString('es-CO')}</span>
        </div>
        <div class="resultado-item">
            <span class="resultado-label">Tasa Mensual:</span>
            <span class="resultado-valor">${(tasaMensual * 100).toFixed(2)}%</span>
        </div>
    `;
    
    divResultado.classList.remove('oculto');
}

// Función interna para calcular (usada por el tester)
function calcularCuotaInterna(monto, tasaAnual, plazo) {
    const tasaMensual = tasaAnual / 12; // BUG 1
    const cuotaMensual = (monto + (monto * tasaMensual * plazo)) / plazo; // BUG 4
    return Math.floor(cuotaMensual); // BUG 8
}