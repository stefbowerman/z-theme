// Styles Warning
// ------------
// Returns a message about compiled SCSS files and how to edit them

module.exports = () => {
  let message = '/*';
  message += `
      __  __________    __    ____  __
     / / / / ____/ /   / /   / __ \/ /
    / /_/ / __/ / /   / /   / / / / / 
   / __  / /___/ /___/ /___/ /_/ /_/  
  /_/ /_/_____/_____/_____/\____(_)

  - This is a CSS file compiled from source SCSS files found in the 'src/_styles' directory.
  - Any changes made to this file will be overwritten when the styles task runs.

`;

  message += '*/\n\n';

  return message;
};
