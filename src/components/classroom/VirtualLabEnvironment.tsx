import React, { useState, useEffect } from 'react';
import { 
  Monitor, 
  Code, 
  Terminal, 
  Play, 
  Save, 
  Download, 
  Upload,
  Share2,
  Settings,
  Maximize,
  Minimize,
  RefreshCw,
  FileText,
  Folder,
  Plus,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  Zap,
  Bug,
  CheckCircle,
  XCircle,
  Clock,
  Users
} from 'lucide-react';

interface CodeFile {
  id: string;
  name: string;
  language: string;
  content: string;
  isModified: boolean;
  lastSaved: string;
}

interface LabExercise {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: number;
  instructions: string[];
  starterCode: string;
  testCases: TestCase[];
  hints: string[];
}

interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  description: string;
  passed?: boolean;
}

interface ExecutionResult {
  success: boolean;
  output: string;
  error?: string;
  executionTime: number;
  memoryUsage: number;
}

export const VirtualLabEnvironment: React.FC = () => {
  const [activeFile, setActiveFile] = useState<string>('main.py');
  const [files, setFiles] = useState<CodeFile[]>([
    {
      id: '1',
      name: 'main.py',
      language: 'python',
      content: '# Binary Search Implementation\ndef binary_search(arr, target):\n    left, right = 0, len(arr) - 1\n    \n    while left <= right:\n        mid = (left + right) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    \n    return -1\n\n# Test the function\nif __name__ == "__main__":\n    numbers = [1, 3, 5, 7, 9, 11, 13, 15]\n    target = 7\n    result = binary_search(numbers, target)\n    print(f"Target {target} found at index: {result}")',
      isModified: false,
      lastSaved: '2024-03-15T10:30:00'
    }
  ]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [showConsole, setShowConsole] = useState(true);
  const [showInstructions, setShowInstructions] = useState(true);
  const [collaborators, setCollaborators] = useState(3);

  const mockExercise: LabExercise = {
    id: '1',
    title: 'Implement Binary Search Algorithm',
    description: 'Create an efficient binary search function that finds the index of a target element in a sorted array.',
    difficulty: 'medium',
    estimatedTime: 30,
    instructions: [
      'Implement the binary_search function that takes a sorted array and target value',
      'Return the index of the target if found, -1 if not found',
      'Use the divide-and-conquer approach for O(log n) time complexity',
      'Test your implementation with the provided test cases'
    ],
    starterCode: 'def binary_search(arr, target):\n    # Your implementation here\n    pass',
    testCases: [
      {
        id: '1',
        input: 'arr=[1,3,5,7,9], target=5',
        expectedOutput: '2',
        description: 'Find element in middle of array'
      },
      {
        id: '2',
        input: 'arr=[1,3,5,7,9], target=1',
        expectedOutput: '0',
        description: 'Find first element'
      },
      {
        id: '3',
        input: 'arr=[1,3,5,7,9], target=10',
        expectedOutput: '-1',
        description: 'Element not in array'
      }
    ],
    hints: [
      'Remember to update left and right pointers correctly',
      'The middle index is calculated as (left + right) // 2',
      'Compare the middle element with the target to decide which half to search'
    ]
  };

  const executeCode = async () => {
    setIsExecuting(true);
    
    // Simulate code execution
    setTimeout(() => {
      const mockResult: ExecutionResult = {
        success: true,
        output: 'Target 7 found at index: 3\nExecution completed successfully!',
        executionTime: 0.045,
        memoryUsage: 2.1
      };
      setExecutionResult(mockResult);
      setIsExecuting(false);
    }, 2000);
  };

  const runTests = () => {
    // Simulate running test cases
    const updatedTestCases = mockExercise.testCases.map(test => ({
      ...test,
      passed: Math.random() > 0.3 // 70% pass rate for demo
    }));
    
    console.log('Running tests:', updatedTestCases);
  };

  const saveFile = () => {
    const currentFile = files.find(f => f.name === activeFile);
    if (currentFile) {
      setFiles(files.map(f => 
        f.name === activeFile 
          ? { ...f, isModified: false, lastSaved: new Date().toISOString() }
          : f
      ));
    }
  };

  const createNewFile = () => {
    const fileName = prompt('Enter file name:');
    if (fileName) {
      const newFile: CodeFile = {
        id: Date.now().toString(),
        name: fileName,
        language: fileName.split('.').pop() || 'text',
        content: '',
        isModified: false,
        lastSaved: new Date().toISOString()
      };
      setFiles([...files, newFile]);
      setActiveFile(fileName);
    }
  };

  const getLanguageIcon = (language: string) => {
    switch (language) {
      case 'python': return '🐍';
      case 'javascript': return '🟨';
      case 'java': return '☕';
      case 'cpp': return '⚡';
      default: return '📄';
    }
  };

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-gray-900">Virtual Programming Lab</h1>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
              {mockExercise.title}
            </span>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              mockExercise.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
              mockExercise.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {mockExercise.difficulty}
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Users className="w-4 h-4" />
              <span>{collaborators} collaborators</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>{mockExercise.estimatedTime}m estimated</span>
            </div>
            <button className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <CheckCircle className="w-4 h-4" />
              <span>Submit</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Instructions Panel */}
        {showInstructions && (
          <div className="w-80 bg-white border-r border-gray-200 p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Instructions</h2>
              <button
                onClick={() => setShowInstructions(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <EyeOff className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Description</h3>
                <p className="text-sm text-gray-600">{mockExercise.description}</p>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">Steps</h3>
                <ol className="space-y-2">
                  {mockExercise.instructions.map((instruction, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start space-x-2">
                      <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2 py-1 rounded-full mt-0.5">
                        {index + 1}
                      </span>
                      <span>{instruction}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">Test Cases</h3>
                <div className="space-y-2">
                  {mockExercise.testCases.map((test, index) => (
                    <div key={test.id} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900">Test {index + 1}</span>
                        {test.passed !== undefined && (
                          test.passed ? 
                            <CheckCircle className="w-4 h-4 text-green-600" /> :
                            <XCircle className="w-4 h-4 text-red-600" />
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mb-1">{test.description}</p>
                      <div className="text-xs">
                        <div><strong>Input:</strong> {test.input}</div>
                        <div><strong>Expected:</strong> {test.expectedOutput}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">Hints</h3>
                <div className="space-y-2">
                  {mockExercise.hints.map((hint, index) => (
                    <details key={index} className="bg-yellow-50 rounded-lg">
                      <summary className="p-3 cursor-pointer text-sm font-medium text-yellow-800">
                        Hint {index + 1}
                      </summary>
                      <p className="px-3 pb-3 text-sm text-yellow-700">{hint}</p>
                    </details>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col">
          {/* File Tabs */}
          <div className="bg-gray-50 border-b border-gray-200 px-4 py-2">
            <div className="flex items-center space-x-2">
              {files.map((file) => (
                <button
                  key={file.id}
                  onClick={() => setActiveFile(file.name)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeFile === file.name
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <span>{getLanguageIcon(file.language)}</span>
                  <span>{file.name}</span>
                  {file.isModified && <div className="w-2 h-2 bg-orange-400 rounded-full"></div>}
                </button>
              ))}
              <button
                onClick={createNewFile}
                className="flex items-center space-x-1 px-2 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Toolbar */}
          <div className="bg-white border-b border-gray-200 px-4 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  onClick={executeCode}
                  disabled={isExecuting}
                  className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {isExecuting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                  <span>{isExecuting ? 'Running...' : 'Run Code'}</span>
                </button>
                <button
                  onClick={runTests}
                  className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Zap className="w-4 h-4" />
                  <span>Run Tests</span>
                </button>
                <button
                  onClick={saveFile}
                  className="flex items-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Save</span>
                </button>
              </div>
              
              <div className="flex items-center space-x-2">
                {!showInstructions && (
                  <button
                    onClick={() => setShowInstructions(true)}
                    className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => setShowConsole(!showConsole)}
                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Terminal className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                  <Share2 className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Code Editor */}
          <div className="flex-1 flex">
            <div className="flex-1 bg-gray-900 text-gray-100 p-4 font-mono text-sm overflow-auto">
              <pre className="whitespace-pre-wrap">
                {files.find(f => f.name === activeFile)?.content}
              </pre>
            </div>
          </div>

          {/* Console/Output */}
          {showConsole && (
            <div className="h-48 bg-black text-green-400 p-4 font-mono text-sm overflow-auto border-t border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400">Console Output</span>
                <button
                  onClick={() => setShowConsole(false)}
                  className="text-gray-400 hover:text-gray-200"
                >
                  <Minimize className="w-4 h-4" />
                </button>
              </div>
              
              {executionResult && (
                <div className="space-y-2">
                  <div className={`text-sm ${executionResult.success ? 'text-green-400' : 'text-red-400'}`}>
                    {executionResult.success ? '✓ Execution successful' : '✗ Execution failed'}
                  </div>
                  <pre className="whitespace-pre-wrap text-gray-100">
                    {executionResult.output}
                  </pre>
                  {executionResult.error && (
                    <pre className="whitespace-pre-wrap text-red-400">
                      {executionResult.error}
                    </pre>
                  )}
                  <div className="text-xs text-gray-400 mt-2">
                    Execution time: {executionResult.executionTime}s | Memory: {executionResult.memoryUsage}MB
                  </div>
                </div>
              )}
              
              {isExecuting && (
                <div className="text-yellow-400">
                  <RefreshCw className="w-4 h-4 animate-spin inline mr-2" />
                  Executing code...
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};