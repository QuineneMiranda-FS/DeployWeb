// Task: Refactor the following code to use a promise chain instead of nested callbacks.
// The function should fetch a user, then their posts, and finally their comments.

function fetchUserData(userId, callback) {
  setTimeout(() => {
    const user = { id: userId, name: "User " + userId };
    callback(user);
  }, 1000);
}

function fetchUserPosts(userId, callback) {
  setTimeout(() => {
    const posts = ["Post 1", "Post 2", "Post 3"];
    callback(posts);
  }, 1000);
}

function fetchPostComments(postId, callback) {
  setTimeout(() => {
    const comments = ["Comment 1", "Comment 2"];
    callback(comments);
  }, 1000);
}

// Example usage (to be refactored):
fetchUserData(1, (user) => {
  console.log("User:", user);
  fetchUserPosts(user.id, (posts) => {
    console.log("Posts:", posts);
    fetchPostComments(posts[0], (comments) => {
      console.log("Comments:", comments);
    });
  });
});

// Your task: Rewrite the above code using Promises and .then() chain.
// Bonus: Implement error handling in your promise chain.
