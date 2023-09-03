import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import _ from 'lodash';
import mongoose from 'mongoose';

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const dbName = "blogsDB";
const password = process.env.PASSWORD;
mongoose.connect(`mongodb+srv://admin-sanidhya:${password}@cluster0.2lidq.mongodb.net/${dbName}`, { useNewUrlParser : true });

const homeStartingContent = "The posts you create will appear hear.";
const aboutContent = " About Content";
const contactContent = "Contact Content";

// const posts = [];
const postSchema = new mongoose.Schema({
  title : {
    type : String,
    required : true
  },
  content : String
});
const Post = new mongoose.model("Post", postSchema);

// const postListSchema = new mongoose.Schema({
//   post : postSchema
// });
// const PostList = new mongoose.model("PostList", postListSchema);

app.get("/", (req, res) =>{
  Post.find({}).then((posts) => {
    res.render("home.ejs",{
      homeContent : homeStartingContent,
      posts : posts
    });
  });
});

app.get("/about", (req, res) =>{
  res.render("about.ejs",{
    aboutContent : aboutContent
  });
});

app.get("/contact", (req, res) =>{
  res.render("contact.ejs",{
    contactContent : contactContent
  });
});

app.get("/compose", (req, res) =>{
  res.render("compose.ejs");
});

app.post("/compose", (req, res) =>{
  const post = new Post({
    title : req.body["postTitle"],
    content : req.body["postContent"]
  });
  post.save();
  // const post = {
  //   title : req.body["postTitle"],
  //   content : req.body["postContent"]
  // }
  // posts.push(post);
  // console.log(posts);
  res.redirect("/");
});

app.get("/posts/:postId", (req, res) =>{
  const requestedPostId = req.params.postId;

  Post.findOne({_id : requestedPostId}).then((post) => {
    res.render("post.ejs",{
      title : post.title,
      content : post.content
    });
  });

  // Post.forEach(post => {
  //   if(_.lowerCase(post.title) === _.lowerCase(enteredTitle)){
  //     // console.log("Match found");
  //     res.render("post.ejs", {
  //       title : post.title,
  //       content : post.content
  //     });    
  //   }
  // });
});



app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});