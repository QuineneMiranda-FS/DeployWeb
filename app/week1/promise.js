function getUserData(userId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!userId) {
        reject("Provide a User Id");
      } else {
        const user = { id: userId, name: "User" + userId };
        resolve(user);
      }
    }, 1000);
  });
}

function getUserPosts(userId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (userId > 100) {
        reject("User was not found");
      } else {
        resolve(["Post 1", "Post 2"]);
      }
    }, 1000);
  });
}

function getUserComments(userId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const comments = ["Comment 1", "Comment 2"];
      resolve(comments);
    }, 1000);
  });
}
function userData(id) {
  getUserData(id)
    .then((user) => {
      console.log("User:", user);
      return Promise.all([getUserPosts(user.id), getUserComments(user.id)]);
    })
    .then(([posts, comments]) => {
      console.log("Posts:", posts);
      console.log("Comments:", comments);
    })
    .catch((err) => {
      console.error("Error:", err);
    });
}

userData(1);
