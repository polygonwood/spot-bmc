import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { ReactiveVar } from 'meteor/reactive-var';
import { Canvases } from '/lib/collections';
import './canvasList.html';

Template.canvasList.onCreated(function() {
  this.isLoading = new ReactiveVar(true);
  
  // Subscribe to the canvases collection
  this.autorun(() => {
    const subscription = this.subscribe('canvases');
    if (subscription.ready()) {
      this.isLoading.set(false);
    }
  });
});

Template.canvasList.helpers({
  isLoading() {
    return Template.instance().isLoading.get();
  },
  
  canvases() {
    return Canvases.find({}, { sort: { createdAt: -1 } });
  },
  
  formatDate(date) {
    return date.toLocaleDateString();
  }
});

Template.canvasList.events({
  'click #create-canvas, click #create-first-canvas'(event) {
    event.preventDefault();
    
    Meteor.call('canvases.create', { title: 'New Canvas' }, (error, canvasId) => {
      if (error) {
        console.error('Error creating canvas:', error);
        alert('Failed to create canvas. Please try again.');
      } else {
        FlowRouter.go(`/canvas/${canvasId}`);
      }
    });
  },
  
  'click .rename-canvas'(event) {
    event.preventDefault();
    const canvasId = event.currentTarget.getAttribute('data-id');
    const canvas = Canvases.findOne(canvasId);
    
    if (canvas) {
      document.getElementById('canvas-id').value = canvasId;
      document.getElementById('canvas-title').value = canvas.title;
      
      // Show the modal using jQuery
      $('#renameCanvasModal').modal('show');
    }
  },
  
  'click #save-rename'(event) {
    event.preventDefault();
    
    const canvasId = document.getElementById('canvas-id').value;
    const title = document.getElementById('canvas-title').value.trim();
    
    if (title) {
      Meteor.call('canvases.rename', { canvasId, title }, (error) => {
        if (error) {
          console.error('Error renaming canvas:', error);
          alert('Failed to rename canvas. Please try again.');
        } else {
          // Hide the modal using jQuery
          $('#renameCanvasModal').modal('hide');
        }
      });
    }
  },
  
  'click .delete-canvas'(event) {
    event.preventDefault();
    const canvasId = event.currentTarget.getAttribute('data-id');
    
    if (confirm('Are you sure you want to delete this canvas? This action cannot be undone.')) {
      Meteor.call('canvases.remove', { canvasId }, (error) => {
        if (error) {
          console.error('Error deleting canvas:', error);
          alert('Failed to delete canvas. Please try again.');
        }
      });
    }
  }
});