const users = [];

const addUser = ({ id, name }) => {
  name = name
    // .toString()
    .trim();
  // .toLoweCase();
  room = 'defaultRoom';
  // .toString()
  // .trim();
  // .toLoweCase();

  // console.log(users);
  const existingUser = users.find(
    user => user.name === name && user.room === room
  );

  if (existingUser) {
    return { error: 'username is taken' };
  }

  const user = { id, name, room };
  users.push(user);
  console.log('*** user connected ***', user.room);
  console.log(users);
  return { user, users };
};

const removeUser = id => {
  const index = users.findIndex(user => user.id === id);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

const getUser = id => users.find(user => user.id === id);

const getUsersInRoom = room => users.filter(user => user.room === room);

module.exports = { addUser, removeUser, getUser, getUsersInRoom };
