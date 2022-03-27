const routes = (handler) => [
  /* Routes For Collaborations */
  {
    method: 'POST',
    path: '/collaborations',
    handler: handler.postCollaborationHandler,
    options: {
      auth: 'openmusicapp_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/collaborations',
    handler: handler.deleteCollaborationHandler,
    options: {
      auth: 'openmusicapp_jwt',
    },
  },
];
module.exports = routes;
