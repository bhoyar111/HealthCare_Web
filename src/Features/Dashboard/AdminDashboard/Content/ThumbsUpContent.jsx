import React, { useEffect, useState } from "react";
import { ThumbsUp } from "react-feather";

import "./Content.css";
import Service from "../Service"; 

const ThumbsUpDownContent = ({ data }) => {
  const [articles, setArticles] = useState([]);

  //  Fetch API Data
  const fetchMostViewed = async () => {
    try {
      const res = await Service.mostLikeArticleService();

      if (res?.status === 200 && res?.data) {
        setArticles(res?.data);
      }
    } catch (err) {
      console.error("Error fetching most viewed articles:", err);
    }
  };

  useEffect(() => {
    fetchMostViewed();
  }, []);

  return (
    <div className="content-dashboard-container">
      {/* Card */}
      <div className="content-card">
        <div className="content-card-header">
          <h3>Top 10 Most Likes Articles</h3>
            <ThumbsUp style={{ color: 'green' }} />
          
        </div>

        <table className="content-data-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Article Title</th>
              <th>Likes</th>
            </tr>
          </thead>
          <tbody>
            {articles.length > 0 ? (
              articles.map((item, index) => (
                <tr key={item?._id}>
                  <td>
                    <span className="rank-badge">#{index + 1}</span>
                  </td>
                  <td>{item?.title}</td>
                  <td>{item?.thumbsup_count}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="no-data">
                  No articles found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ThumbsUpDownContent;
