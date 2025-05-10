import React from "react";
import { Tabs, Tab, Box, SvgIcon } from "@mui/material";

const HomeHeader = ({ activeKey, onKeyChange }) => {
  const tabs = [
    {
      key: "Posts",
      label: "Posts",
      icon: (
        <SvgIcon>
          <path
            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </SvgIcon>
      ),
    },
    {
      key: "LearningProgress",
      label: "Learning Progress",
      icon: (
        <SvgIcon>
          <path
            d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </SvgIcon>
      ),
    },
  ];

  const currentTabIndex = tabs.findIndex((tab) => tab.key === activeKey);

  const handleChange = (event, newIndex) => {
    onKeyChange(tabs[newIndex].key);
  };

  return (
    <Box boxShadow={3} bgcolor="white">
      <Tabs
        value={currentTabIndex}
        onChange={handleChange}
        variant="fullWidth"
        indicatorColor="primary"
        textColor="primary"
        centered
      >
        {tabs.map((tab) => (
          <Tab
            key={tab.key}
            icon={tab.icon}
            label={tab.label}
            iconPosition="top"
          />
        ))}
      </Tabs>
    </Box>
  );
};

export default HomeHeader;
