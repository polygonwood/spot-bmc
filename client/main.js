import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { $ } from 'meteor/jquery';

// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

// Ensure jQuery is available globally for Bootstrap
window.jQuery = window.$ = $;

// Import Bootstrap JS (after jQuery is set up)
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Import Font Awesome for icons
import '@fortawesome/fontawesome-free/js/all.js';

// Import main HTML template
import './main.html';

// Import client-side routes
import './routes';
