import moment from 'moment-timezone';


export const moment_tz = (dt) => {
    return moment.tz(
        dt, moment.tz.guess()
    )
}

export const format_datetime = (dt, format='LLL') => {
    return moment_tz(dt).format(format);
}