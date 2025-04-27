module.exports = {
    async beforeCreate(event) {
      const { data } = event.params;
      
      // If a user is associated, fetch the username
      if (data.user) {
        const user = await strapi.entityService.findOne('plugin::users-permissions.user', data.user, {
          fields: ['username']
        });
        
        if (user) {
          // You could add a display field here if needed
          // data.displayName = user.username;
        }
      }
    },
    
    async beforeUpdate(event) {
      const { data } = event.params;
      
      // If user relationship is being updated
      if (data.user) {
        const user = await strapi.entityService.findOne('plugin::users-permissions.user', data.user, {
          fields: ['username']
        });
        
        if (user) {
          // Update display name if needed
          // data.displayName = user.username;
        }
      }
    }
  };