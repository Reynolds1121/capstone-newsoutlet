import React, { useState, useEffect } from "react";
const WorldNews = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [linkCopiedState, setLinkCopiedState] = useState({});

  const fetchArticles = async () => {
    const apiKey = "UiHVtYvNUQ2wFOsMqMwPb2KGWTAu9lg0oeBFhBsC";
    const regions = {
      Africa: ["za", "ng", "ke"],
      Americas: ["us", "ca", "br", "mx"],
      Asia: ["in", "cn", "jp", "kr"],
      Australia: ["au", "nz"],
      Canada: ["ca"],
      Europe: ["gb", "de", "fr", "es", "it"],
      "Middle East": ["ae", "sa", "eg", "jo"],
      "United Kingdom": ["gb"],
    };
    const articlesArray = [];
    setLoading(true);
    try {
      for (const region in regions) {
        const countryCodes = regions[region];
        for (const country of countryCodes) {
          const storedData = localStorage.getItem(`worldNews_${country}`);
          if (storedData) {
            const cachedArticles = JSON.parse(storedData);
            articlesArray.push(...cachedArticles);
          } else {
            const apiUrl = `https://api.thenewsapi.com/v1/news/top?api_token=${apiKey}&locale=${country}&limit=5`;
            const response = await fetch(apiUrl);
            if (!response.ok) {
              const errorText = `HTTP error! Status: ${response.status}, ${response.statusText}`;
              throw new Error(errorText);
            }
            const data = await response.json();
            articlesArray.push(...(data.data || []));
            localStorage.setItem(
              `worldNews_${country}`,
              JSON.stringify(data.data)
            );
          }
        }
      }
      setArticles(articlesArray);
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const defaultImageUrl = "src/components/images/defaultNewsImage.jpg";

  const filteredArticles = articles.filter(
    (article) => article.title !== "[Removed]"
  );

  const handleCopyToClipboard = (url, index) => {
    navigator.clipboard.writeText(url).then(() => {
      setLinkCopiedState({
        ...linkCopiedState,
        [index]: true,
      });

      setTimeout(() => {
        setLinkCopiedState({
          ...linkCopiedState,
          [index]: false,
        });
      }, 3000);
    });
  };

  return (
    <div className="newsFeed">
      <h4 className="pageTitle"></h4>

      {loading ? (
        <p>Loading articles...</p>
      ) : (
        <ul>
          {filteredArticles.map((article, index) => (
            <li className="itemCard" key={index}>
              <h4>{article.title}</h4>
              {article.urlToImage && (
                <div className="imageDiv">
                  <img
                    className="image"
                    src={article.urlToImage}
                    alt="Article"
                  />
                </div>
              )}
              {!article.urlToImage && (
                <div className="imageDiv">
                  <img className="image" src={defaultImageUrl} alt="Default" />
                </div>
              )}
              <p className="article">{article.description}</p>
              <p className="author">Author: {article.author}</p>
              <p className="published">Published at: {article.publishedAt}</p>
              <p className="source">Source: {article.source.name}</p>
              {article.url && (
                <div>
                  <p className="article-link">
                    <a
                      className="articleLink"
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Read More
                    </a>
                  </p>
                  <button
                    className="copyLinkButton"
                    onClick={() => handleCopyToClipboard(article.url, index)}
                    disabled={linkCopiedState[index]}
                  >
                    {linkCopiedState[index] ? "Link Copied!" : "Copy Link"}
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default WorldNews;
