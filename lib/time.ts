
const JSTOffset = 9

export type Time = { hours: number, minutes: number }
export type TimeWithWeekday = Time & { weekday: number }
export type TimeBetween = { start: Time, end: Time }

export function getNowJSTTime(): Time {
    const nowJSTTime = new Date(new Date().getTime() + (JSTOffset * 3600 * 1000))
    return { hours: nowJSTTime.getUTCHours(), minutes: nowJSTTime.getUTCMinutes() }
}

export function getNowJSTTimeWithWeekday(): TimeWithWeekday {
    const nowJSTTime = new Date(new Date().getTime() + (JSTOffset * 3600 * 1000))
    return { weekday: nowJSTTime.getUTCDay(), hours: nowJSTTime.getUTCHours(), minutes: nowJSTTime.getUTCMinutes() }
}

export function isTimeInRange(time: Time, timeRange: TimeBetween) {
    const totalMinutes = time.hours * 60 + time.minutes;
    const startMinutes = timeRange.start.hours * 60 + timeRange.start.minutes;
    const tmpEndMinutes = timeRange.end.hours * 60 + timeRange.end.minutes;
    const endMinutes = startMinutes <= tmpEndMinutes ? tmpEndMinutes : tmpEndMinutes + 60 * 24
    return startMinutes <= totalMinutes && totalMinutes <= endMinutes;
}
