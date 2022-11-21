export default {
  beforeMount(el, { value, arg }) {
    let iconClass = `fa fa-${value.icon} text-xl`;

    if (arg) {
      iconClass = value;
    }

    if (value.right) {
      iconClass += ' float-right';
    }
    iconClass += ` text-${value.color || 'black'}-400`;
    // eslint-disable-next-line no-param-reassign
    el.innerHTML += `<i class='${iconClass}'></i>`;
  },
};
