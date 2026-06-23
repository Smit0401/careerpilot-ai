const router = require("express").Router();

const {
    getArticlesController
} = require("../controllers/article.controller");

router.get("/", getArticlesController);

module.exports = router;