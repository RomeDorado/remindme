'use strict';

const Agenda = require('agenda');
const {MONGO_URI} = require('../config');
const agenda = new Agenda({

    db: {
        address: MONGO_URI
    }   

});
const createReminder = require('./createReminder');
const showReminders = require('./showReminders');
const cancelReminder = require('./cancelReminder');
module.exports = (f) => {  
    //define agenda jobs
    agenda.define('reminder', job =>{
        const {fbid, first_name, task} = job.attrs.data;
        f.txt(fbid, `Hey, ${first_name}! Reminding you to ${task}!`)    
    });
    //create reminder    
    createReminder(agenda, f);
    
    //show reminders 
    showReminders(agenda, f);
    
    cancelReminder(agenda, f);
    return agenda;
}