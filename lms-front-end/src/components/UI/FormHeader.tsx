import React from "react";

interface FormHeaderProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export default function FormHeader({ title, description, icon }: FormHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-4">
      <div className="flex items-center">
        {icon && <div className="h-6 w-6 text-white mr-3">{icon}</div>}
        <h2 className="text-xl font-semibold text-white">{title}</h2>
      </div>
      <p className="text-indigo-100 text-sm mt-1">{description}</p>
    </div>
  );
}
