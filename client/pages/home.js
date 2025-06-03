import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { Template } from 'meteor/templating';
import './home.html';

Template.home.events({
  'click #create-canvas'(event) {
    event.preventDefault();
    
    // Call the server method to create a new canvas
    Meteor.call('canvases.create', { title: 'New Canvas' }, (error, canvasId) => {
      if (error) {
        console.error('Error creating canvas:', error);
        alert('Failed to create canvas. Please try again.');
      } else {
        // Navigate to the newly created canvas
        FlowRouter.go(`/canvas/${canvasId}`);
      }
    });
  }
});