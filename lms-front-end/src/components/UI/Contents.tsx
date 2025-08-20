"use client";

import React from "react";

const Contents = ({ children }: { children: React.ReactNode }) => {
  return <div className="min-h-screen flex flex-col w-full max-w-6xl m-auto py-6">{children}</div>;
};

export default Contents;
