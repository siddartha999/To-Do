/**
 * Modelling a Schema for Tasks collection.
 */
 const mongoose = require('mongoose');

 const tasksSchema = mongoose.Schema({
     userId: {
         type: String,
         required: true
     },
     inProgress: {
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
     inProgressCount: {
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

tasksSchema.index({
    userId: 'text'
});

module.exports = mongoose.model('Tasks', tasksSchema);
