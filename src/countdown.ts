export type timing = {
    "seconds": number,
    "minutes": number,
    "hours": number
}

export default class Countdown {
    hours: number
    minutes: number
    seconds: number
    interval: NodeJS.Timeout | undefined
    everySeconds: (countdown: Countdown) => void
    atTheEnd: (countdown: Countdown) => void

    constructor() {
        this.hours = 0;
        this.minutes = 0;
        this.seconds = 0;
        this.everySeconds = (_) => {};
        this.atTheEnd = (_) => {};
    }

    setEverySeconds(callback: (countdown: Countdown) => void) {
        this.everySeconds = callback;
    }

    setAtTheEnd(callback: (countdown: Countdown) => void) {
        this.atTheEnd = callback;
    }

    setTiming(timing: timing) {
        this.seconds = timing.seconds;
        this.hours = timing.hours;
        this.minutes = timing.minutes;
    }

    getTiming(): timing {
        const timing: timing = {
            "seconds": this.seconds,
            "minutes": this.minutes,
            "hours": this.hours
        };
        return timing;
    }

    decrementOneSecond(): boolean {
        if (this.seconds > 0) {
            this.seconds -= 1;
        } else if (this.minutes > 0) {
            this.minutes -= 1;
            this.seconds = 59;
        } else if (this.hours > 0) {
            this.hours -= 1;
            this.minutes = 59
            this.seconds = 59;
        } else {
            return false
        }

        return true
    }

    everySecondsWrapper() {
        this.everySeconds(this);
        const canDecrement = this.decrementOneSecond();
        if (!canDecrement) {
            this.atTheEnd(this);
            this.stop();
        }
    }

    start() {
        if (this.interval) return undefined;
        this.interval = setInterval(() => {
            this.everySecondsWrapper();
        }, 1000);
    }

    stop() {
        clearInterval(this.interval);
        this.interval = undefined;
    }

    isRunning() {
        if (this.interval) return true
        return false
    }
}