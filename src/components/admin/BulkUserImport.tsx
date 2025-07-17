import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Download, 
  FileText, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Users,
  Eye,
  Trash2
} from 'lucide-react';
import { apiClient } from '../../services/api';

interface ImportResult {
  success: boolean;
  totalRows: number;
  successCount: number;
  errorCount: number;
  errors: {
    row: number;
    field: string;
    message: string;
  }[];
  createdUsers: {
    matricule: string;
    firstName: string;
    lastName: string;
    role: string;
    password: string;
  }[];
}

interface PreviewData {
  headers: string[];
  rows: string[][];
  errors: string[];
}

export const BulkUserImport: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (selectedFile: File) => {
    if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
      alert('Please select a CSV file');
      return;
    }

    setFile(selectedFile);
    setResult(null);
    previewFile(selectedFile);
  };

  const previewFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length === 0) {
        setPreview({ headers: [], rows: [], errors: ['File is empty'] });
        return;
      }

      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      const rows = lines.slice(1, 6).map(line => 
        line.split(',').map(cell => cell.trim().replace(/"/g, ''))
      );

      // Validate headers
      const requiredHeaders = ['firstName', 'lastName', 'email', 'role', 'department'];
      const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
      const errors = missingHeaders.length > 0 
        ? [`Missing required columns: ${missingHeaders.join(', ')}`]
        : [];

      setPreview({ headers, rows, errors });
    };
    reader.readAsText(file);
  };

  const downloadTemplate = () => {
    const template = `firstName,lastName,email,role,department,specialty
John,Doe,john.doe@university.cm,student,Computer Science,Software Engineering
Jane,Smith,jane.smith@university.cm,lecturer,Mathematics,
Admin,User,admin@university.cm,admin,,`;

    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'user_import_template.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const handleImport = async () => {
    if (!file) return;

    setImporting(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await apiClient.bulkImportUsers(formData);
      setResult(response);
    } catch (error) {
      console.error('Import failed:', error);
      setResult({
        success: false,
        totalRows: 0,
        successCount: 0,
        errorCount: 1,
        errors: [{ row: 0, field: 'general', message: 'Import failed. Please try again.' }],
        createdUsers: []
      });
    } finally {
      setImporting(false);
    }
  };

  const exportResults = () => {
    if (!result) return;

    const csvContent = [
      'Matricule,First Name,Last Name,Role,Password',
      ...result.createdUsers.map(user => 
        `${user.matricule},${user.firstName},${user.lastName},${user.role},${user.password}`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'imported_users_credentials.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const resetImport = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bulk User Import</h1>
          <p className="text-gray-600 mt-1">Import multiple users from CSV file</p>
        </div>
        <button
          onClick={downloadTemplate}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Download Template</span>
        </button>
      </div>

      {!result && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload CSV File</h2>
          
          {/* File Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-primary-500 bg-primary-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">
              Drop your CSV file here, or click to browse
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Supports CSV files up to 10MB
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Select File
            </button>
          </div>

          {/* File Info */}
          {file && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <button
                  onClick={resetImport}
                  className="text-red-600 hover:text-red-800 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Preview */}
      {preview && !result && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Preview Data</h2>
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-500">Showing first 5 rows</span>
            </div>
          </div>

          {preview.errors.length > 0 && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <XCircle className="w-5 h-5 text-red-600" />
                <h3 className="font-medium text-red-900">Validation Errors</h3>
              </div>
              <ul className="text-sm text-red-700 space-y-1">
                {preview.errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}

          {preview.headers.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    {preview.headers.map((header, index) => (
                      <th key={index} className="px-4 py-2 text-left text-sm font-medium text-gray-900 border-b border-gray-200">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {preview.rows.map((row, rowIndex) => (
                    <tr key={rowIndex} className="hover:bg-gray-50">
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex} className="px-4 py-2 text-sm text-gray-900 border-b border-gray-200">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {preview.errors.length === 0 && (
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleImport}
                disabled={importing}
                className="flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {importing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Importing...</span>
                  </>
                ) : (
                  <>
                    <Users className="w-4 h-4" />
                    <span>Import Users</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Import Results</h2>
            <div className="flex items-center space-x-3">
              {result.createdUsers.length > 0 && (
                <button
                  onClick={exportResults}
                  className="flex items-center space-x-2 px-4 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Export Credentials</span>
                </button>
              )}
              <button
                onClick={resetImport}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Upload className="w-4 h-4" />
                <span>Import More</span>
              </button>
            </div>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <FileText className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-blue-900">{result.totalRows}</p>
                  <p className="text-sm text-blue-700">Total Rows</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-green-900">{result.successCount}</p>
                  <p className="text-sm text-green-700">Successful</p>
                </div>
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <XCircle className="w-8 h-8 text-red-600" />
                <div>
                  <p className="text-2xl font-bold text-red-900">{result.errorCount}</p>
                  <p className="text-sm text-red-700">Errors</p>
                </div>
              </div>
            </div>
          </div>

          {/* Errors */}
          {result.errors.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Import Errors</h3>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="space-y-2">
                  {result.errors.map((error, index) => (
                    <div key={index} className="flex items-start space-x-2 text-sm">
                      <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <span className="text-red-700">
                        Row {error.row}: {error.field} - {error.message}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Created Users */}
          {result.createdUsers.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Created Users</h3>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <div className="flex items-center space-x-2 text-sm text-green-700">
                  <CheckCircle className="w-4 h-4" />
                  <span>
                    {result.createdUsers.length} users created successfully. 
                    Make sure to download and securely share the credentials with the users.
                  </span>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-900 border-b border-gray-200">
                        Matricule
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-900 border-b border-gray-200">
                        Name
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-900 border-b border-gray-200">
                        Role
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-900 border-b border-gray-200">
                        Password
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.createdUsers.slice(0, 10).map((user, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-sm font-mono text-gray-900 border-b border-gray-200">
                          {user.matricule}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900 border-b border-gray-200">
                          {user.firstName} {user.lastName}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900 border-b border-gray-200">
                          <span className="capitalize">{user.role}</span>
                        </td>
                        <td className="px-4 py-2 text-sm font-mono text-gray-900 border-b border-gray-200">
                          {user.password}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {result.createdUsers.length > 10 && (
                  <p className="text-sm text-gray-500 mt-2 text-center">
                    Showing first 10 users. Download full list using the Export button.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};