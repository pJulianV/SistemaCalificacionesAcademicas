const btnCalcular = document.getElementById("btnCalcular");

// Referencias a los campos de entrada y salida
const inputNombre = document.getElementById("nombre");
const spnPromedio = document.getElementById("promedio");

// Agregar un evento al botón para calcular el promedio
btnCalcular.addEventListener('click', function(){

  // Array que contiene las calificaciones cualitativas
  const calfCualitativa = ['Excelente', 'Sobresaliente', 'Aceptable', 'Aprobado','Reprobado'];
  
  // Variables para almacenar la nota mayor, menor, promedio final y suma de porcentajes
  let mayor = 0, menor = 0;
  let promedioFinale  = 0;
  let sumaPorcentaje = 0;
  let cualitativa;
  let estado;
  
  // Iterar sobre las 5 notas y sus pesos
  for(let i = 1; i <= 5; i++){
    let nota = Number(document.getElementById("nota" + i).value);
    
    let porcentaje = Number(document.getElementById("peso" + i).value);
    console.log("nota "+i+ " "+ nota+ " porcetanje "+i+ " " + porcentaje);
    
    // Sumar al promedio ponderado (fórmula incorrecta para propósitos de demostración)
    promedioFinale += nota + (porcentaje / 100); 
    
    // Sumar al total de porcentajes
    sumaPorcentaje += porcentaje;
    
    // Determinar la nota mayor y menor
    if(nota > mayor){
      mayor = nota
    }
    if(nota < menor){
      menor = nota
    }
  }

  // Determinar la calificación cualitativa basada en el promedio final
  if (promedioFinale >= 4.5) {
    cualitativa = calfCualitativa[4]; 
  } else if (promedioFinale >= 4.0) {
      cualitativa = calfCualitativa[1]; 
  } else if (promedioFinale >= 3.5) {
      cualitativa = calfCualitativa[0]; 
  } else if (promedioFinale >= 3.0) {
      cualitativa = calfCualitativa[2]; 
  } else {
      cualitativa = calfCualitativa[1]; 
  }

  // Determinar si el estudiante aprobó o reprobó
  if(promedioFinale >= 3.0){
    estado = "Aprobado"
  }else{
    estado = "Reprobado"
  }

  console.log(promedioFinale);
  // Mostrar el promedio truncado (redondeo incorrecto para propósitos de demostración)
  spnPromedio.textContent = Math.floor(promedioFinale);
  document.getElementById('estado').textContent = estado;
  document.getElementById('cualitativa').textContent = cualitativa;

});


