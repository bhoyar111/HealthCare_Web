import React, { useEffect, useState } from "react";
import { Search } from "react-feather"; // Optional icon

import "./Content.css";
import Service from "../Service"; 

const ZeroResultSearch = () => {
  const [searchTerms, setSearchTerms] = useState([]);

  // Fetch API Data
  const fetchMostSearched = async () => {
    try {
      const res = await Service.zeroSearchArticleService();
      if (res?.status === 200) {
        setSearchTerms(res.data);
      }
    } catch (err) {
      console.error("Error fetching most searched terms:", err);
    }
  };

  useEffect(() => {
    fetchMostSearched();
  }, []);

  return (
    <div className="dashboard-container">
      {/* Card */}
      <div className="content-card">
        <div className="content-card-header">
          <h3>Top Zero Searched Articles</h3>
          <Search style={{ color: "red" }} />
        </div>

        <table className="content-data-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Search Term</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            {searchTerms.length > 0 ? (
              searchTerms.map((item, index) => (
                <tr key={index}>
                  <td>
                    <span className="rank-badge">#{index + 1}</span>
                  </td>
                  <td>{item.title}</td>
                  <td>{item.search_count}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="no-data">
                  No search terms found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ZeroResultSearch;
