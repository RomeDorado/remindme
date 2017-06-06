'use strict';

const moment = require('moment');
module.exports = (agenda, f) =>{
    return agenda.define('showReminders', job =>{
        let {fbid} = job.attrs.data;
        agenda.jobs({
            name: 'reminder',
            'data.fbid': fbid,
            'nextRunAt': {
                $exists: true,
                $ne: null
            }
        }, (error, data) =>{
            if(data.length === 0){
                f.txt(fbid, "You've got no reminders set :)");
            }else{
                data.forEach(item => {
                    //loop over and display each reminder
                    let {_id, nextRunAt} = item.attrs;
                    let {task} = item.attrs.data;
                    
                    let rightNowUTC = moment.utc();
                    let runDate = moment.utc(nextRunAt);
                    let timeToEvent = rightNowUTC.to(runDate);//to method computes the difference between the TWO and outputs into readable like, in 4 hours
                    
                    //f.txt(fbid, `${task.charAt(0).toUpperCase() + task.slice(1)} is due ${timeToEvent}`);
                    let data = {
                    text: `${task.charAt(0).toUpperCase() + task.slice(1)} is due ${timeToEvent}`,
                    buttons: [{
                        type: 'postback',
                        title: 'Cancel Reminder',
                        payload: `{
                            "schedule": "cancelReminder",
                            "fbid": "${fbid}",
                            "id": "${_id}"
                        }`
                    }]
                }
                
                f.btn(fbid, data);

                });
            }
        });
    });
}