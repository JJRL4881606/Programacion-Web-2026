// a calculadora de imc
function calcularIMC(peso, altura) {
  if (typeof peso !== "number" || typeof altura !== "number" ||
      isNaN(peso) || isNaN(altura) || peso <= 0 || altura <= 0) {
    return "error, peso y altura deben ser numeros mayores que 0";
  }
  return peso / (altura * altura);
}

function clasificarIMC(imc) {
  if (imc < 18.5) return "bajo peso";
  if (imc < 25) return "normal";
  if (imc < 30) return "sobrepeso";
  return "obesidad";
}

const imc = calcularIMC(70, 1.75);
if (typeof imc === "string") {
  console.log(imc);
} else {
  console.log(`IMC: ${imc.toFixed(2)} - ${clasificarIMC(imc)}`);
}