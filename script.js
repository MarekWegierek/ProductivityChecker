const currentDay = document.querySelector(".currentDay")
const timeDisplay = document.querySelector(".time-display")
const playBtn = document.querySelector(".playBtn")
const pauseBtn = document.querySelector(".pauseBtn")
const taskInput = document.querySelector(".sendInput")
const sendInputValue = document.getElementById("sendInputValue")
const dayOnCard = document.querySelector(".card-0")
const todaysTasks = document.querySelector(".card0-list")

/*Date on a header */

const DaysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
]
const today = new Date()
const f = new Intl.DateTimeFormat("en-us", {
  dateStyle: "long",
  timeZone: "Poland",
})
const currDay = f.format(today)
const headerDate = `${currDay} ${DaysOfWeek[today.getDay()]}`
currentDay.innerHTML = headerDate

/*Date on a card */
const g = new Intl.DateTimeFormat("pl-pl", {
  timeZone: "Poland",
  dateStyle: "short",
})
const cardDay = g.format(today)

/* Variables for stopWatch */
let secs = 0
let mins = 0
let hours = 0
let paused = true
let startTime = 0
let intervalId
let elapsedTime = 0
let currentTime = 0

/* 'data' stores information about single event/time spent on task */

let data = {}

/*cardData stores information about all events from day, 
together with current date
*/

let lsCardData = JSON.parse(localStorage.getItem("tasklist_serialized"))
let cardData = {
  day: cardDay,
  taskList: [
    {
      time: "8:00",
      secs: 0,
      mins: 0,
      hours: 0,
      status: "nameOfTask",
    },
  ],
}

if (!lsCardData) {
  let x = JSON.stringify(cardData)
  localStorage.setItem("tasklist_serialized", x)
} else if (cardData.taskList != lsCardData) {
  cardData.taskList = lsCardData
}

let taskArray = cardData.taskList.map((taskInfo) => {
  let { time, secs, mins, hours, status } = taskInfo
  return `<li>
  <p class="card0-list-timeStamp">${time}</p>
  <p class="card0-list-job">${status}</p>
  <p class="card0-list-timeDone">${hours}:${mins}:${secs}</p>
  </li>`
})
let taskArrayHTML = taskArray.join("").toString()
todaysTasks.innerHTML = taskArrayHTML
dayOnCard.innerHTML = cardData.day

/*StopWatch Functionality */

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

function updateTime() {
  elapsedTime = Date.now() - startTime
  secs = Math.floor((elapsedTime / 1000) % 60)
  mins = Math.floor((elapsedTime / (1000 * 60)) % 60)
  hours = Math.floor((elapsedTime / (1000 * 60 * 60)) % 60)

  secs = pad(secs)
  mins = pad(mins)
  hours = pad(hours)

  timeDisplay.textContent = `${hours}:${mins}:${secs}`
}
function pad(unit) {
  return ("0" + unit).length > 2 ? unit : "0" + unit
}

/* Task and time submit Functionality */
taskInput.addEventListener("submit", (e) => {
  if (sendInputValue.value == "") {
    e.preventDefault()
    alert("You didn't provide title for your task!")
  } else if (secs == 0 && mins == 0 && hours == 0) {
    e.preventDefault()
    alert("No time spent on a task")
  } else {
    let hrs = today.getHours().toString()
    let minutes = today.getMinutes().toString()
    minutes = pad(minutes)
    let dateFormatted = hrs.concat(`:${minutes}`)

    data = {
      time: dateFormatted,
      secs: pad(secs),
      mins: pad(mins),
      hours: parseFloat(hours),
      status: sendInputValue.value,
    }

    /*Clearing Interface */
    paused = true
    clearInterval(intervalId)
    startTime = 0
    elapsedTime = 0
    currentTime = 0
    secs = 0
    mins = 0
    hours = 0
    timeDisplay.textContent = `00:00:00`

    /*Updating cardData*/
    let { day, taskList } = cardData
    taskList = [...taskList, data]
    let taskList_serialized = JSON.stringify(taskList)
    localStorage.setItem("tasklist_serialized", taskList_serialized)
  }
})
