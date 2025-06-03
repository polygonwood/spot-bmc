import { Meteor } from 'meteor/meteor';
import { Canvases } from '/lib/collections';

// Publish all canvases (in a real app, you'd limit to user's own canvases)
Meteor.publish('canvases', function() {
  return Canvases.find({});
});

// Publish a specific canvas by ID
Meteor.publish('canvas', function(canvasId) {
  return Canvases.find({ _id: canvasId });
});