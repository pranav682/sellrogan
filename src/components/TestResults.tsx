import React from 'react';

interface TestResultsProps {
  results: {
    component: string;
    status: 'pass' | 'fail' | 'warning';
    message?: string;
    details?: string[];
  }[];
}

const TestResults: React.FC<TestResultsProps> = ({ results }) => {
  const passedTests = results.filter(result => result.status === 'pass').length;
  const totalTests = results.length;
  const passRate = Math.round((passedTests / totalTests) * 100);
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <h2 className="text-xl font-semibold mb-4">Test Results</h2>
      
      <div className="flex items-center mb-6">
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div 
            className={`h-4 rounded-full ${passRate > 80 ? 'bg-green-600' : passRate > 50 ? 'bg-yellow-500' : 'bg-red-500'}`} 
            style={{ width: `${passRate}%` }}
          ></div>
        </div>
        <span className="ml-4 font-medium">{passRate}%</span>
      </div>
      
      <div className="space-y-4">
        {results.map((result, index) => (
          <div 
            key={index} 
            className={`p-4 rounded-lg ${
              result.status === 'pass' ? 'bg-green-50 border border-green-200' : 
              result.status === 'warning' ? 'bg-yellow-50 border border-yellow-200' : 
              'bg-red-50 border border-red-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{result.component}</h3>
              <span 
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  result.status === 'pass' ? 'bg-green-100 text-green-800' : 
                  result.status === 'warning' ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-red-100 text-red-800'
                }`}
              >
                {result.status.toUpperCase()}
              </span>
            </div>
            
            {result.message && (
              <p className={`mt-2 text-sm ${
                result.status === 'pass' ? 'text-green-700' : 
                result.status === 'warning' ? 'text-yellow-700' : 
                'text-red-700'
              }`}>
                {result.message}
              </p>
            )}
            
            {result.details && result.details.length > 0 && (
              <ul className="mt-2 text-sm space-y-1 list-disc list-inside pl-2">
                {result.details.map((detail, i) => (
                  <li key={i} className={
                    result.status === 'pass' ? 'text-green-700' : 
                    result.status === 'warning' ? 'text-yellow-700' : 
                    'text-red-700'
                  }>
                    {detail}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestResults;
