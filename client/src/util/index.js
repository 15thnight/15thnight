import axios from 'axios';
import moment from 'moment-timezone';


export const moment_tz = (dt) => {
    return moment.tz(
        dt, moment.tz.guess()
    )
}

export const format_datetime = (dt, format='LLL') => {
    return moment_tz(dt).format(format);
}

const request_factory = csrfToken => {
    return axios.create({
        headers: { 'X-CSRFToken': csrfToken }
    });
}

export const request = request_factory(document.getElementById('csrf').content);