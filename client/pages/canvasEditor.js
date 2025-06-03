import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { ReactiveVar } from 'meteor/reactive-var';
import { Canvases } from '/lib/collections';
import './canvasEditor.html';

Template.canvasEditor.onCreated(function() {
  this.isLoading = new ReactiveVar(true);
  this.canvasId = FlowRouter.getParam('id');
  
  // Subscribe to the specific canvas data
  this.autorun(() => {
    const subscription = this.subscribe('canvas', this.canvasId);
    if (subscription.ready()) {
      this.isLoading.set(false);
    }
  });
});

Template.canvasEditor.helpers({
  isLoading() {
    return Template.instance().isLoading.get();
  },
  
  canvas() {
    const canvasId = Template.instance().canvasId;
    return Canvases.findOne(canvasId);
  }
});

Template.canvasEditor.events({
  'click #rename-canvas'(event) {
    event.preventDefault();
    const canvas = Template.instance().canvas;
    
    if (canvas) {
      document.getElementById('canvas-title').value = this.title;
      
      // Show the modal using jQuery
      $('#renameCanvasModal').modal('show');
    }
  },
  
  'click #save-rename'(event) {
    event.preventDefault();
    const canvasId = Template.instance().canvasId;
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
  
  'click .add-item'(event) {
    event.preventDefault();
    const section = event.currentTarget.getAttribute('data-section');
    
    // Set the section name in the modal
    document.getElementById('section-name').value = section;
    document.getElementById('item-text').value = '';
    
    // Show the add item modal using jQuery instead of Bootstrap API
    $('#addItemModal').modal('show');
  },
  
  'click #save-item'(event) {
    event.preventDefault();
    const canvasId = Template.instance().canvasId;
    const section = document.getElementById('section-name').value;
    const text = document.getElementById('item-text').value.trim();
    
    if (text) {
      // Get the current items for this section
      const canvas = Canvases.findOne(canvasId);
      const items = [...(canvas[section] || []), text];
      
      // Update the canvas with the new item
      Meteor.call('canvases.update', { canvasId, field: section, items }, (error) => {
        if (error) {
          console.error('Error adding item:', error);
          alert('Failed to add item. Please try again.');
        } else {
          // Hide the modal using jQuery
          $('#addItemModal').modal('hide');
        }
      });
    }
  },
  
  'click .canvas-item'(event) {
    event.preventDefault();
    const section = event.currentTarget.getAttribute('data-section');
    const index = parseInt(event.currentTarget.getAttribute('data-index'));
    const canvas = Canvases.findOne(Template.instance().canvasId);
    
    if (canvas && canvas[section] && canvas[section][index] !== undefined) {
      // Set the values in the edit modal
      document.getElementById('edit-section-name').value = section;
      document.getElementById('edit-item-index').value = index;
      document.getElementById('edit-item-text').value = canvas[section][index];
      
      // Show the edit modal using jQuery
      $('#editItemModal').modal('show');
    }
  },
  
  'click #update-item'(event) {
    event.preventDefault();
    const canvasId = Template.instance().canvasId;
    const section = document.getElementById('edit-section-name').value;
    const index = parseInt(document.getElementById('edit-item-index').value);
    const text = document.getElementById('edit-item-text').value.trim();
    
    if (text) {
      // Get the current items for this section
      const canvas = Canvases.findOne(canvasId);
      const items = [...(canvas[section] || [])];
      
      // Update the specific item
      items[index] = text;
      
      // Update the canvas with the modified items
      Meteor.call('canvases.update', { canvasId, field: section, items }, (error) => {
        if (error) {
          console.error('Error updating item:', error);
          alert('Failed to update item. Please try again.');
        } else {
          // Hide the modal using jQuery
          $('#editItemModal').modal('hide');
        }
      });
    }
  },
  
  'click #delete-item'(event) {
    event.preventDefault();
    const canvasId = Template.instance().canvasId;
    const section = document.getElementById('edit-section-name').value;
    const index = parseInt(document.getElementById('edit-item-index').value);
    
    if (confirm('Are you sure you want to delete this item?')) {
      // Get the current items for this section
      const canvas = Canvases.findOne(canvasId);
      let items = [...(canvas[section] || [])];
      
      // Remove the specific item
      items.splice(index, 1);
      
      // Update the canvas with the modified items
      Meteor.call('canvases.update', { canvasId, field: section, items }, (error) => {
        if (error) {
          console.error('Error deleting item:', error);
          alert('Failed to delete item. Please try again.');
        } else {
          // Hide the modal using jQuery
          $('#editItemModal').modal('hide');
        }
      });
    }
  }
});

// Template events for the canvasSectionItems sub-template
Template.canvasSectionItems.events({});