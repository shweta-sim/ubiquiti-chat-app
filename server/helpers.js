const users = [];

const addUser = ({ id, name }) => {
  name = name.trim();
  room = 'defaultRoom';

  const existingUser = users.find(
    user => user.name === name && user.room === room
  );

  if (existingUser) {
    return { error: 'Nickname is already taken' };
  }

  const user = { id, name, room };
  users.push(user);
  return { user, users };
};

const removeUser = id => {
  const index = users.findIndex(user => user.id === id);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

const getUser = id => users.find(user => user.id === id);

const getAllUsers = room => users.filter(user => user.room === room);

module.exports = { addUser, removeUser, getUser, getAllUsers };
