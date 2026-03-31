import React, { useEffect, useState } from "react";
import { Bookmark } from "react-feather"; // Optional icon

import "./Content.css";
import Service from "../Service";

const MostFrequentlySavedQuestions = () => {
  const [saveQuestion, setSaveQuestion] = useState([]);

  // Fetch API Data
  useEffect(() => {
    fetchMostSave();
  }, []);

  const fetchMostSave = async () => {
    try {
      const res = await Service.mostSaveQuesService();
      if (res?.status === 200) {
        setSaveQuestion(res?.data?.topQuestions);
      }
    } catch (err) {
      console.error("Error fetching most searched terms:", err);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Card */}
      <div className="content-card">
        <div className="content-card-header">
          <h3>Top 10 Saved Questions</h3>
          <Bookmark style={{ color: "green" }} />
        </div>

        <table className="content-data-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Save Ques</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            {saveQuestion.length > 0 ? (
              saveQuestion.map((item, index) => (
                <tr key={index}>
                  <td>
                    <span className="rank-badge">#{index + 1}</span>
                  </td>
                  <td className="question-cell">{item.question}</td>
                  <td>{item.totalSaved}</td>
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

export default MostFrequentlySavedQuestions;
