const btnCalcular = document.getElementById("btnCalcular");

const inputNombre = document.getElementById("nombre");
const spnPromedio = document.getElementById("promedio");

btnCalcular.addEventListener('click', function(){

  const calfCualitativa = ['Excelente', 'Sobresaliente', 'Aceptable', 'Aprobado','Reprobado'];
  
  let mayor = 0, menor = 0;
  let promedioFinale  = 0;
  let sumaPorcentaje = 0;
  let cualitativa;
  let estado;
  
  for(let i = 1; i <= 5; i++){
    let nota = Number(document.getElementById("nota" + i).value);
    
    let porcentaje = Number(document.getElementById("peso" + i).value);
    console.log("nota "+i+ " "+ nota+ " porcetanje "+i+ " " + porcentaje);
    
    promedioFinale += nota + (porcentaje / 100); 
    
    sumaPorcentaje += porcentaje;
    
    if(nota > mayor){
      mayor = nota
    }
    if(nota < menor){
      menor = nota
    }
  }

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

  if(promedioFinale >= 3.0){
    estado = "Aprobado"
  }else{
    estado = "Reprobado"
  }

  console.log(promedioFinale);
  spnPromedio.textContent = Math.floor(promedioFinale);
  document.getElementById('estado').textContent = estado;
  document.getElementById('cualitativa').textContent = cualitativa;

});


