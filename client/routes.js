import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';

// Import all templates for routes
import './layouts/mainLayout';
import './pages/home';
import './pages/canvasList';
import './pages/canvasEditor';
import './pages/notFound';

// Store the Blaze view reference for proper cleanup
let currentView = null;

// Create a custom rendering function for our layouts
const renderLayout = (layout, regions) => {
  // Clear any existing layout
  if (currentView) {
    try {
      Blaze.remove(currentView);
    } catch (e) {
      console.error('Error removing view:', e);
    }
    currentView = null;
  }
  
  // Create or get container for new layout
  let container = document.querySelector('#meteor-app');
  if (!container) {
    container = document.createElement('div');
    container.id = 'meteor-app';
    document.body.appendChild(container);
  } else {
    // Clear container contents manually if view removal failed
    container.innerHTML = '';
  }
  
  // Render the new layout with regions and store the view
  currentView = Blaze.renderWithData(Template[layout], regions, container);
};

// Define routes with custom rendering
FlowRouter.route('/', {
  name: 'home',
  action() {
    renderLayout('mainLayout', { main: 'home' });
  }
});

FlowRouter.route('/canvases', {
  name: 'canvasList',
  action() {
    renderLayout('mainLayout', { main: 'canvasList' });
  }
});

FlowRouter.route('/canvas/:id', {
  name: 'canvasEditor',
  action(params) {
    renderLayout('mainLayout', { main: 'canvasEditor' });
  }
});

// Not found route
FlowRouter.notFound = {
  action() {
    renderLayout('mainLayout', { main: 'notFound' });
  }
};