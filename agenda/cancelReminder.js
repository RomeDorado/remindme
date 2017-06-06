'use strict';


const ObjectID = require('mongodb').ObjectID;

module.exports = (agenda, f) => {
    return agenda.define('cancelReminder', job => {
        const {fbid, id} = job.attrs.data;
        agenda.cancel({
            name: 'reminder',
            _id: new ObjectID(id)
        }, (error, numRemoved) => {
            if(!error){
                f.txt(fbid, (numRemoved > 0 ? "Alright. I've cancelled the reminder" : "I've already cancelled this reminder. Don't worry"));

            }else{
                f.txt(fbid, "Oh no! something went wrong with our servers :( Try again in a little while");
                console.log(error);
            }
        });
    });
}