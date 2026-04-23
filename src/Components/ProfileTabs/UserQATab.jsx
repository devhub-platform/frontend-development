import React, { Component } from 'react'

const UserQATab = ({ openReactionId, setOpenReactionId, author }) => (
  <div className="p-6 bg-card rounded-2xl border border-gray-200 shadow-xl dark:border-bg-secondary-dark dark:bg-bg-secondary-dark">
    <h3 className="mb-2 font-semibold text-2xl dark:text-white">
      {author}'s Published Questions
    </h3>
    <div className="py-10 text-center">
      <p className="text-gray-500 dark:text-gray-400">
        {author} haven't published any questions yet.
      </p>
    </div>
  </div>
);

export default UserQATab;
