import readline from "readline";
import fs from "fs";

const myBlogFile = "myBlogPosts.json";

const saveMyPosts = (posts) => {
  fs.writeFileSync(myBlogFile, JSON.stringify(posts, null, 2), "utf8");
};

const getMyPosts = () => {
  if (fs.existsSync(myBlogFile)) {
    const data = fs.readFileSync(myBlogFile, "utf8");
    return JSON.parse(data || "[]");
  }
  return [];
};

let blogPosts = getMyPosts();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const blogMenu = () => {
  console.log(`
        My Blog CLI 
        1. Create a new Blog Post 
        2. View all Blog Posts 
        3. Edit a Blog Post 
        4. Delete a Blog Post 
        5. Exit
        `);
  rl.question(
    "Choose an option from the list of options (1 - 5): ",
    (option) => {
      userOptions(option);
    }
  );
};

const userOptions = (option) => {
  switch (option) {
    case "1":
      createBlogPost();
      break;
    case "2":
      viewBlogPost();
      break;
    case "3":
      editBlogPost();
      break;
    case "4":
      deleteBlogPost();
      break;
    case "5":
      console.log("\nExiting Blog Menu now...");
      rl.close();
      break;
    default:
      console.log("\nUnknown option. You may try again or exit");
      blogMenu();
  }
};

const createBlogPost = () => {
  rl.question("Enter a title for your Post: ", (title) => {
    rl.question("Enter the content of your Post: ", (content) => {
      blogPosts.push({ title, content });
      saveMyPosts(blogPosts);
      console.log("\nAlert: New post added!");
      blogMenu();
    });
  });
};

const viewBlogPost = () => {
  // FIND OUT WHY THIS FUNCTION IS NOT WORKING
  // IT IS WORKING. BUT THE PROGRAM HAS TO BE CLOSED AFTER THE FIRST POST AND OPENED AGAIN FOR IT TO WORK. YET TO BE FIXED
  console.log("\nMY BLOG POSTS");
  if (blogPosts.length === 0) {
    console.log(
      "Ooops! Seems like there is no Blog Post at the moment. Please create a Post."
    );
  } else {
    blogPosts.forEach(({ title, content }, index) => {
      console.log(`\nPost #${index + 1}`);
      console.log(`Title: ${title}`);
      console.log(`Content: ${content}`);
    });
  }
  blogMenu();
};

const editBlogPost = () => {
  if (blogPosts.length === 0) {
    console.log("Sorry, there's no Post to edit. Kindly select a Post.");
    return blogMenu();
  }

  rl.question(
    "Please enter the Post number you would like to edit: ",
    (number) => {
      const index = parseInt(number, 10) - 1;

      if (index >= 0 && index < blogPosts.length) {
        const post = blogPosts[index];
        console.log(`\nEditing Post #${index + 1}`);
        console.log(`Current Tittle: ${post.title}`);
        console.log(`Current content: ${post.content}`);

        rl.question(
          "Please enter new title (leave blank if you want to keep the current title): ",
          (newTitle) => {
            rl.question(
              "Please enter new content(leave blank if you want to keep current content): ",
              (newContent) => {
                blogPosts[index] = {
                  title: newTitle || post.title,
                  content: newContent || post.content,
                };
                saveMyPosts(blogPosts);
                console.log("\nNew Post updated successfully");
                blogMenu();
              }
            );
          }
        );
      } else {
        console.log("\nInvalid Blog Post number.");
        blogMenu();
      }
    }
  );
};

const deleteBlogPost = () => {
  if (blogPosts.length === 0) {
    console.log(
      "\nOoops! There's no Blog Post to delete. Please enter a Blog Post number to delete."
    );
    return blogMenu();
  }
  rl.question(
    "Are you sure you want to delete? If yes, enter the Post number you want to delete.: ",
    (number) => {
      const index = parseInt(number, 10) - 1;
      if (index >= 0 && index < blogPosts.length) {
        blogPosts.splice(index, 1);
        saveMyPosts(blogPosts);
        console.log("\nPost has been deleted successfuly!");
      } else {
        console.log(
          "\nThe Post number is invalid. Please enter a valid Post number."
        );
      }
      blogMenu();
    }
  );
};

blogMenu();
