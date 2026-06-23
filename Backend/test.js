require("dotenv").config();

const { getArticles } = require("./src/services/article.service");

(async () => {

    const articles = await getArticles("React Hooks");

    console.log(articles);

})();