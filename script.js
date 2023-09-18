const currentDay = document.querySelector(".currentDay")
const timeDisplay = document.querySelector(".time-display")
const playBtn = document.querySelector(".playBtn")
const pauseBtn = document.querySelector(".pauseBtn")
const stopBtn = document.querySelector(".stopBtn")

const today = new Date()

const f = new Intl.DateTimeFormat("pl-pl", {
  dateStyle: "long",
  timeZone: "Poland",
})
const currDay = f.format(today)

currentDay.innerHTML = currDay

let secs = 0
let mins = 0
let hours = 0
let paused = true
let startTime = 0
let intervalId
let elapsedTime = 0
let currentTime = 0

let data = {}

playBtn.addEventListener("click", () => {
  playBtn.children[0].classList.toggle("invisible")
  playBtn.children[1].classList.toggle("invisible")

  if (paused) {
    paused = false
    startTime = Date.now() - elapsedTime
    intervalId = setInterval(updateTime, 75)
  } else {
    paused = true
    elapsedTime = Date.now() - startTime
    clearInterval(intervalId)
  }
})

stopBtn.addEventListener("click", () => {
  let now = new Date()
  let hours = now.getHours().toString()
  let minutes = now.getMinutes().toString()
  let dateFormated = hours.concat(`:${minutes}`)

  data = {
    date: dateFormated,
    secs: parseFloat(secs),
    mins: parseFloat(mins),
    hours: parseFloat(hours),
  }
  console.log(data)

  paused = true
  clearInterval(intervalId)
  startTime = 0
  elapsedTime = 0
  currentTime = 0
  secs = 0
  mins = 0
  hours = 0

  timeDisplay.textContent = `00:00:00`
})

function updateTime() {
  elapsedTime = Date.now() - startTime
  secs = Math.floor((elapsedTime / 1000) % 60)
  mins = Math.floor((elapsedTime / (1000 * 60)) % 60)
  hours = Math.floor((elapsedTime / (1000 * 60 * 60)) % 60)

  secs = pad(secs)
  mins = pad(mins)
  hours = pad(hours)

  function pad(unit) {
    return ("0" + unit).length > 2 ? unit : "0" + unit
  }
  timeDisplay.textContent = `${hours}:${mins}:${secs}`
}
