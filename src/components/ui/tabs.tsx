import React from 'react';

export interface TabsProps {
  defaultValue: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  children: React.ReactNode;
}

export const Tabs: React.FC<TabsProps> = ({ 
  defaultValue, 
  value, 
  onValueChange, 
  className = "", 
  children 
}) => {
  return (
    <div className={className}>
      {children}
    </div>
  );
};

export interface TabsListProps {
  className?: string;
  children: React.ReactNode;
}

export const TabsList: React.FC<TabsListProps> = ({ 
  className = "", 
  children 
}) => {
  return (
    <div className={`inline-flex items-center justify-center rounded-md bg-gray-100 p-1 ${className}`}>
      {children}
    </div>
  );
};

export interface TabsTriggerProps {
  value: string;
  className?: string;
  children: React.ReactNode;
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({ 
  value, 
  className = "", 
  children 
}) => {
  // Get the Tabs context value
  const tabsContext = React.useContext(TabsContext);
  
  const isActive = tabsContext.value === value;
  
  return (
    <button
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
        isActive 
          ? "bg-white text-gray-950 shadow-sm" 
          : "text-gray-500 hover:text-gray-900"
      } ${className}`}
      onClick={() => tabsContext.onValueChange?.(value)}
    >
      {children}
    </button>
  );
};

export interface TabsContentProps {
  value: string;
  className?: string;
  children: React.ReactNode;
}

export const TabsContent: React.FC<TabsContentProps> = ({ 
  value, 
  className = "", 
  children 
}) => {
  // Get the Tabs context value
  const tabsContext = React.useContext(TabsContext);
  
  const isActive = tabsContext.value === value;
  
  if (!isActive) return null;
  
  return (
    <div className={`mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 ${className}`}>
      {children}
    </div>
  );
};

// Create a context for the Tabs component
interface TabsContextType {
  value: string;
  onValueChange?: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextType>({
  value: "",
});

// Update the Tabs component to provide the context
export const TabsWithContext: React.FC<TabsProps> = ({ 
  defaultValue, 
  value, 
  onValueChange, 
  className = "", 
  children 
}) => {
  // Use internal state if value is not controlled
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  
  // Determine the actual value to use
  const actualValue = value !== undefined ? value : internalValue;
  
  // Handle value change
  const handleValueChange = (newValue: string) => {
    if (value === undefined) {
      setInternalValue(newValue);
    }
    onValueChange?.(newValue);
  };
  
  return (
    <TabsContext.Provider value={{ value: actualValue, onValueChange: handleValueChange }}>
      <div className={className}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

// Export the components with context
export { TabsWithContext as Tabs };
