import { Meteor } from 'meteor/meteor';
import { Canvases } from '/lib/collections';

// Import publications
import './publications';

// Define server-side methods for CRUD operations on canvases
Meteor.methods({
  async 'canvases.create'({ title }) {
    // Create a new empty canvas with default title
    return await Canvases.insertAsync({
      title: title || 'New Business Model Canvas',
      createdAt: new Date(),
      customerSegments: [],
      valuePropositions: [],
      channels: [],
      customerRelationships: [],
      revenueStreams: [],
      keyResources: [],
      keyActivities: [],
      keyPartnerships: [],
      costStructure: []
    });
  },
  
  async 'canvases.update'({ canvasId, field, items }) {
    // Update a specific field in the canvas
    const updateObj = {};
    updateObj[field] = items;
    
    return await Canvases.updateAsync(canvasId, { $set: updateObj });
  },
  
  async 'canvases.rename'({ canvasId, title }) {
    return await Canvases.updateAsync(canvasId, { $set: { title } });
  },
  
  async 'canvases.remove'({ canvasId }) {
    return await Canvases.removeAsync(canvasId);
  }
});

Meteor.startup(async () => {
  // Create a sample canvas if the collection is empty
  if (await Canvases.find().countAsync() === 0) {
    Meteor.call('canvases.create', { title: 'Sample Canvas' });
  }
});
