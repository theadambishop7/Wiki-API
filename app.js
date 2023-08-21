import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

const port = 3000;
const app = express();
const uri = dotenv.config().parsed.MONGO_URI;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model('Article', articleSchema);

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('short'));


app.route("/articles")
    .get((req, res) => {
        Article.find({}).then((articles) => {
            res.send(articles);
        }
        ).catch((err) => {
            res.send(err);
        });
    })
    //Create a new article
    .post((req, res) => {
        const article = new Article({
            title: req.body.title,
            content: req.body.content
        });

        article.save().then(() => {
            res.send(article);
        }
        ).catch((err) => {
            res.send(err);
        });
    })
    //Delete all articles
    .delete((req, res) => {
        Article.deleteMany({}).then(() => {
            res.send('Articles deleted');
        }
        ).catch((err) => {
            res.send(err);
        });
    });


app.route("/articles/:title")
    .get((req, res) => {
        Article.findOne({title: req.params.title}).then((article) => {
            res.send(article);
        }
        ).catch((err) => {
            res.send(err);
        });
    })
    //Update a specific article put
    .put((req, res) => {
        Article.updateOne({title: req.params.title}, {title: req.body.title, content: req.body.content}).then((response) => {
            if (response.modifiedCount == 1) {
                res.send("Article updated");
            } else { 
                res.send(response);
            }
        }
        ).catch((err) => {
            res.send(err);
        });
    })
    //Update a specific article patch
    .patch((req, res) => {
        Article.updateOne({title: req.params.title}, {$set: req.body}).then((response) => {
            if (response.modifiedCount == 1) {
                res.send("Article updated");
            } else { 
                res.send(response);
            }
        }
        ).catch((err) => {
            res.send(err);
        });
    })
    //Delete a specific article
    .delete((req, res) => {
        Article.deleteOne({title: req.params.title}).then(() => {
            res.send('Article deleted');
        }
        ).catch((err) => {
            res.send(err);
        });
    }); 





app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

