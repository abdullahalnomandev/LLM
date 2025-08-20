import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumb = ({ 
  items, 
  separator = <ChevronRight size={14} />, 
  showHome = true,
  homeHref = "/",
  className = ""
}) => {
  return (
    <nav 
      aria-label="breadcrumb" 
      className={`flex items-center space-x-1 text-sm ${className}`}
    >
      <ol className="flex items-center space-x-1">
        {showHome && (
          <li className="flex items-center">
            <Link 
              href={homeHref}
              className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <Home size={16} />
              <span className="sr-only">Home</span>
            </Link>
            {items.length > 0 && (
              <span className="mx-2 text-gray-400" aria-hidden="true">
                {separator}
              </span>
            )}
          </li>
        )}
        
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <li key={index} className="flex items-center">
              {item.href && !isLast ? (
                <Link 
                  href={item.href}
                  className="text-gray-600 hover:text-gray-900 hover:underline transition-colors duration-200"
                >
                  {item.label}
                </Link>
              ) : (
                <span 
                  className="text-gray-900 font-medium"
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
              
              {!isLast && (
                <span className="mx-2 text-gray-400" aria-hidden="true">
                  {separator}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;

/* 
Usage Examples:

// Basic usage
<Breadcrumb 
  items={[
    { label: "Products", href: "/products" },
    { label: "Electronics", href: "/products/electronics" },
    { label: "Smartphones" } // Current page (no href)
  ]} 
/>

// Custom separator
<Breadcrumb 
  items={[
    { label: "Blog", href: "/blog" },
    { label: "Technology", href: "/blog/tech" },
    { label: "Next.js Guide" }
  ]}
  separator="/"
/>

// Without home icon
<Breadcrumb 
  items={[
    { label: "Account", href: "/account" },
    { label: "Settings", href: "/account/settings" },
    { label: "Profile" }
  ]}
  showHome={false}
/>

// Custom styling
<Breadcrumb 
  items={[
    { label: "Docs", href: "/docs" },
    { label: "Components", href: "/docs/components" },
    { label: "Breadcrumb" }
  ]}
  className="text-base py-4"
/>
*/