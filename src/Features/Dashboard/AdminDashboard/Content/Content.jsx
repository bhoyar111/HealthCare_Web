import React from "react";
import "./Content.css";

import mockData from "./MockData";

import TopViewedContent from "./TopViewedContent";
import TopSavedContent from "./TopSavedContent";
import ThumbsUpContent from "./ThumbsUpContent";
import ThumbsDownContent from "./ThumbsDownContent";
import TopSearchTerms from "./TopSearchTerms";
import ZeroResultSearch from "./ZeroResultSearch";
import MostFrequentlySavedQuestions from "./MostFrequentlySavedQuestions";

const Content = ({ data }) => {
  return (
    <div className="dashboard-grid">
      <TopViewedContent data={mockData.topViewed} />
      <TopSavedContent data={mockData.topSaved} />
      <ThumbsUpContent data={mockData.thumbsUp} />
      <ThumbsDownContent data={mockData.thumbsDown} />
      <TopSearchTerms data={mockData.topSearchTerms} />
      <ZeroResultSearch data={mockData.zeroResultSearch} />
      <MostFrequentlySavedQuestions data={mockData.mostFrequentlySavedQuestions} />
    </div>
  );
};

export default Content;
