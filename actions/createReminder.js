'use strict';
const {fetchEntity} = require('../utils');
const createReminder = (session, agenda) => {
    return ({sessionId, context, entities}) => {
        return new Promise((resolve, reject) => {
            //fetch and extract entities 
            //console.log(entities);
            //Update context with task and time 
            let task = fetchEntity(entities, 'task');
            let datetime = fetchEntity(entities, 'datetime');


            if(task){
                context.task = task;
                delete context.missingTask;
            }else{
                context.missingTask = true;
            }

            if(datetime){
                context.datetime = datetime;
                delete context.missingTime;                
            }else{
                context.missingTime = true; 
            }

            if(context.datetime && context.task){
                delete context.missingTask;
                delete context.missingTime;
                context.jobDone = true;
                //Fetch fbid of the user 
                let {fbid} = session.get(sessionId);
                //Call Agenda to set a reminder
                //console.log(`Reminding user to ${context.task} at ${context.datetime}`);
                agenda.now('createReminder', {
                    fbid, 
                    datetime: context.datetime,
                    task: context.task

                });
            }


            //Resolve with the updated context

            return resolve(context);
        });
    }

}

module.exports = createReminder;