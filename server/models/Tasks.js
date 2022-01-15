/**
 * Modelling a Schema for Tasks collection.
 */
 const mongoose = require('mongoose');

 const tasksSchema = mongoose.Schema({
     _id: {
         type: String,
         required: true
     },
     current: {
         type: Array,
         default: []
     },
     completed: {
         type: Array,
         default: []
     },
     starred: {
        type: Array,
        default: []
     },
     currentCount: {
         type: Number,
         default: 0
     },
     completedCount: {
         type: Number,
         default: 0
     },
     starredCount: {
         type: Number,
         default: 0
     }
 });

module.exports = mongoose.model('Tasks', tasksSchema);
