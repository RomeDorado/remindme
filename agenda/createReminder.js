'use strict';

const moment = require('moment');
module.exports = (agenda, f) => {
    return agenda.define('createReminder', job => {
        //Extract fbid, datetime and task from job
        const {fbid, datetime, task} = job.attrs.data;
        //Get the FB user's timezone
    f.getProfile(fbid)
    .then(profile => {
        const {first_name, timezone} = profile;
        const UTC_Offset = moment.utc(datetime).subtract(timezone, 'hours');
        const timeDiff = UTC_Offset.diff(moment.utc());
        const scheduleTime = (timeDiff <= 0 ? moment.utc(datetime) : UTC_Offset).toDate();
        agenda.schedule(scheduleTime, 'reminder', {
            fbid,
            first_name,
            task
        });
    })
    .catch(err => console.log(error));
    //compute at offset from UTC before sheduling the task 
    });
}
        