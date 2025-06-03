import { Mongo } from 'meteor/mongo';

// Main collection for Business Model Canvas documents
export const Canvases = new Mongo.Collection('canvases');

// Initial canvas schema will have fields for all 9 BMC components
// Each canvas belongs to a user and has a name/title