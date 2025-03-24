import Countdown from './countdown'
import './style.css'

const testDiv = document.getElementById("testing")
const inputs = document.getElementById("inputs-container")
const play = document.getElementById("play-button")
const presets = document.getElementsByClassName("preset-button")
const countdown: Countdown = new Countdown();

const log = (text: string) => {
    if (testDiv) {
        testDiv.innerHTML += text;
    }
}

function rangeValue(value: number, min: number, max: number) {
    if (value < min || isNaN(value)) {
        return min
    } else if (value > max) {
        return max
    } else {
        return value
    }
}

function incrementRangeLoop(value: number, step: number, min: number, max: number) {
    const newValue = value + step
    if (newValue > max) {
        return min
    } else if (newValue < min) {
        return max
    } else {
        return newValue
    }
}

if (inputs) {
  const length = inputs.children.length
  for (let i = 0; i < length; i++) {
      const element = inputs.children.item(i)
      if (element instanceof HTMLDivElement) {
        const arrowUp = element.getElementsByClassName("number-input-arrow-up").item(0)
        const arrowDown = element.getElementsByClassName("number-input-arrow-down").item(0)
        const input = element.getElementsByClassName("number-input").item(0)
        if (input instanceof HTMLInputElement) {
          const min = parseInt(input.min)
          const max = parseInt(input.max)
      
          input.addEventListener("blur", () => {
              input.value = String(rangeValue(parseInt(input.value), min, max))
            })
            
            if (arrowUp && input) {
                arrowUp.addEventListener("click", () => {
                    input.value = String(incrementRangeLoop(parseInt(input.value), 1, min, max))
                })
            }
        
            if (arrowDown && input) {
                arrowDown.addEventListener("click", () => {
                    input.value = String(incrementRangeLoop(parseInt(input.value), -1, min, max))
                })
            }
        }
      }
  }
}

function changeButtonToPlay() {
    const img = document.getElementById("play-button-img");
    if (img instanceof HTMLImageElement) {
        img.src = "./play.svg";
    }
}

function changeButtonToPause() {
    const img = document.getElementById("play-button-img");
    if (img instanceof HTMLImageElement) {
        img.src = "./pause.svg";
    }
}

if (play instanceof HTMLButtonElement) {
  play.addEventListener("click", () => {
      const inputs = document.getElementById("inputs-container")
      if (inputs) {
        const length = inputs.children.length
        let durationArray: HTMLInputElement[] = Array<HTMLInputElement>(3)
        let count = 0
        for (let i = 0; i < length; i++) {
            let element = inputs.children.item(i).getElementsByClassName("number-input").item(0)
            if (element instanceof HTMLInputElement) {
                durationArray[count] = element;
                count += 1;
            }
        }

        const [hours, minutes, seconds] = durationArray.map( e => parseInt(e.value) )
        
        if (countdown.isRunning()) {
            countdown.stop();
            changeButtonToPlay();
        } else {
            
            const [hoursInput, minutesInput, secondsInput] = durationArray;

            [hoursInput, minutesInput, secondsInput].forEach((input) => {input.readOnly = true});

            countdown.setTiming({"seconds": seconds, "minutes": minutes, "hours": hours});

            countdown.setEverySeconds((cd) => {
                const {seconds, minutes, hours} = cd.getTiming();
                hoursInput.value = String(hours);
                minutesInput.value = String(minutes);
                secondsInput.value = String(seconds);
            });

            countdown.setAtTheEnd((cd) => {
                [hoursInput, minutesInput, secondsInput].forEach((input) => {input.readOnly = false});
                changeButtonToPlay();
            });

            changeButtonToPause();
            countdown.start();
        }

      }
  })
} 

// Use contextBridge
window.ipcRenderer.on('main-process-message', (_event, message) => {
  console.log(message)
})
