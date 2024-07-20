import './style.css'
import dayjs from "dayjs";
import 'dayjs/locale/es'

const verFecha = document.querySelector('#fecha')
const verHora = document.querySelector('#hora')

const verCiudad = document.querySelector('#ciudad')
const verTemp = document.querySelector('#temp')
const verIcono = document.querySelector('#icono-clima')
const verDescripcion = document.querySelector('#descripcion')
const verViento = document.querySelector('#viento')
const verPresion = document.querySelector('#presion')
const verHumedad = document.querySelector('#humedad')

const verBolivares = document.querySelector('#bolivares')
const verPesos = document.querySelector('#pesos-col')
const verReales = document.querySelector('#real-bra')
const verSoles = document.querySelector('#sol-peru')

const verSemPrev = document.querySelector('#sem-prev')
const verMesPrev = document.querySelector('#mes-prev')
const verAnioPrev = document.querySelector('#anio-prev')

function main() {
  const actual = dayjs()

  manejoFecha()
  manejoHora()

  /* Consumir API del Clima */
  fetch('https://api.openweathermap.org/data/2.5/weather?q=valencia,ve&appid=617c3bdaf35b410cdf061a3ce5032635&units=metric&lang=es')
  .then((response) => response.json())
  .then((data) => {
    rendererClima(data)
  })

  /* Consumir API Tasa de cambio */
  fetch('https://openexchangerates.org/api/latest.json?app_id=86b17c780c22441f8b5f3f89c2c874f9&symbols=BRL,COP,PEN,VES')
  .then((response) => response.json())
  .then((data) => {
    rendererMonedas(data)
  })

  /* Consumir API de historico por semana */
  fetch(`https://openexchangerates.org/api/historical/${fechaSemana(actual)}.json?app_id=86b17c780c22441f8b5f3f89c2c874f9&symbols=BRL,COP,PEN,VES`)
  .then((response) => response.json())
  .then((data) => {
    verSemPrev.innerHTML = Number(data.rates.VES).toFixed(2)
  })

  /* Consumir API de historico por mes */
  fetch(`https://openexchangerates.org/api/historical/${fechaMes(actual)}.json?app_id=86b17c780c22441f8b5f3f89c2c874f9&symbols=BRL,COP,PEN,VES`)
  .then((response) => response.json())
  .then((data) => {
    verMesPrev.innerHTML = Number(data.rates.VES).toFixed(2)
  })

  /* Consumir API de historico por año */
  fetch(`https://openexchangerates.org/api/historical/${fechaAnio(actual)}.json?app_id=86b17c780c22441f8b5f3f89c2c874f9&symbols=BRL,COP,PEN,VES`)
  .then((response) => response.json())
  .then((data) => {
    verAnioPrev.innerHTML = Number(data.rates.VES).toFixed(2)
  })
}

function manejoFecha() {
  const ahora = dayjs().locale('es')

  const formato = 'DD-MMMM-YYYY'

  const ahoraFormato = ahora.format(formato)

  verFecha.innerHTML = ahoraFormato
}

function manejoHora() {
  const hora = dayjs()

  const formato = 'hh:mm:ss A'

  const horaFormato = hora.format(formato)

  verHora.innerHTML = horaFormato

  setTimeout(manejoHora, 1000)
}

function rendererClima(data) {
  //console.log(data)
  const ciudadPais = data.name + ', ' + data.sys.country

  verCiudad.innerHTML = ciudadPais
  verTemp.innerHTML = data.main.temp
  verIcono.setAttribute('src', `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`)
  verDescripcion.innerHTML = data.weather[0].description.toUpperCase()
  verViento.innerHTML = `${data.wind.speed} Km/h`
  verPresion.innerHTML = `${data.main.pressure} hPa`
  verHumedad.innerHTML = `${data.main.humidity} %`
}

function rendererMonedas(data) {
  //console.log(data)
  verBolivares.innerHTML = `${Number(data.rates.VES).toFixed(2)} VES`
  verPesos.innerHTML = `${Number(data.rates.COP).toFixed(2)} COP`
  verReales.innerHTML = `${Number(data.rates.BRL).toFixed(2)} BRL`
  verSoles.innerHTML = `${Number(data.rates.PEN).toFixed(2)} PEN`

}

function fechaSemana(actual) {
  return actual.subtract(1, 'week').format('YYYY-MM-DD')
}

function fechaMes(actual) {
  return actual.subtract(1, 'month').format('YYYY-MM-DD')
}

function fechaAnio(actual) {
  return actual.subtract(1, 'year').format('YYYY-MM-DD')
}

document.addEventListener('DOMContentLoaded', main)