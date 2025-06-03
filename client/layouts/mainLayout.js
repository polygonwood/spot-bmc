import { Template } from 'meteor/templating';
import './mainLayout.html';

Template.mainLayout.helpers({
  currentYear() {
    return new Date().getFullYear();
  }
});