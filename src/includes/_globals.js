import _ from 'lodash';

export default {
  install(app) {
    const baseComponents = require.context('../components/base', false, /[A-Za-z0-9-_,\s]+\.vue$/i);
    baseComponents.keys().forEach((filename) => {
      const componentConfig = baseComponents(filename);
      const componentName = _.upperFirst(
        _.camelCase(filename.replace(/^\.\//, '').replace(/\.\w+$/, '')),
      );
      app.component(`Base${componentName}`, componentConfig.default || componentConfig); // case if the component is exported default webpack will put the config inside the property default
    });
  },
};
