var express          = require("express"),
    app              = express(),
    bodyParser       = require("body-parser"),
    mongoose         = require("mongoose"),
    methodOverride   = require("method-override"),
    expressSanitizer = require("express-sanitizer");

app.set("view engine", "ejs");
app.use(express.static("public"));
mongoose.connect("mongodb://localhost/restful_blog_app");
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());


var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created :{ type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

//RESTFUL ROUTES

// Blog.create({
//     title: "Test Blog",
//     image: "https://previews.123rf.com/images/belchonock/belchonock1509/belchonock150904319/45833475-beautiful-tulips-with-diary-and-cup-of-coffee-on-wooden-table-top-view.jpg",
//     body: "Starting with something easy"
// });

app.get("/", (req, res)=>{
    res.redirect("/blogs");
});

//Index Route
app.get("/blogs", (req, res)=>{
    Blog.find({}, (err, blogs)=>{
        if(err) console.log(err);
        else res.render("index", {blogs : blogs});
    });
})


//New Route
app.get("/blogs/new", (req, res)=>{
    res.render("new");
});

//Create Route
app.post("/blogs", (req, res)=>{
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, (err, newBlog)=>{
        if(err) res.redirect("new");
        else res.redirect("/blogs");
    });
});

//Show Route
app.get("/blogs/:id", (req, res)=>{
    Blog.findById(req.params.id, (err, found)=>{
        if(err) res.redirect("/blogs");
        else res.render("show", {blog: found});
    });
});

//EDIT route
app.get("/blogs/:id/edit", (req, res)=>{
    Blog.findById(req.params.id, (err, found)=>{
        if(err) res.render("/blogs");
        else res.render("edit", {blog: found});
    });
});

//Update Route
app.put("/blogs/:id", (req, res)=>{
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updated)=>{
        if(err) res.redirect("/blogs");
        else res.redirect("/blogs/"+req.params.id);
    });
});


app.delete("/blogs/:id", (req, res)=>{
    Blog.findByIdAndRemove(req.params.id, (err)=>{
        if(err) res.redirect("/blogs");
        else res.redirect("/blogs");
    });
});

app.listen(3000, ()=>{
    console.log("Server Running at port 3000");
})