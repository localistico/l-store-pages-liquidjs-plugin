// Usage: {{ items | group_by:"name" }}
const group_by = function(input, property) {
  let groups = [];
  input.forEach((item) => {
    let name = item[property];
    let group = groups.find(el => el.name === name);
    if (group) {
      group.items.push(item);
    } else {
      group = {
        name,
        items: [item]
      };
      groups.push(group);
    }
  });
  return groups;
};

module.exports = group_by;