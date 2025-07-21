import React, { useState } from 'react';
import { Eye, EyeOff, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const PasswordChangeForm: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, updatePassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsSubmitting(true);
    const success = await updatePassword(newPassword);
    setIsSubmitting(false);

    if (!success) {
      setError('Failed to update password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-neutral-50 to-secondary-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-3">
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Change Your Password</h1>
          <p className="text-neutral-600">
            Welcome, {user?.firstName} to COUMANO! Please change your default password to continue.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-neutral-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-error-50 border-l-4 border-error-500 p-4 rounded-r-lg">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-error-500 mr-2" />
                  <p className="text-error-700 text-sm">{error}</p>
                </div>
              </div>
            )}

            <div className="bg-primary-50 border-l-4 border-primary-500 p-4 rounded-r-lg">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-primary-500 mr-2" />
                <p className="text-primary-700 text-sm">
                  Your matricule: <strong>{user?.matricule}</strong>
                </p>
              </div>
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-neutral-800 mb-2">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                <input
                  id="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors bg-white"
                  placeholder="Enter new password"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-800 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors bg-white"
                  placeholder="Confirm new password"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="bg-neutral-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-neutral-800 mb-2">Password Requirements:</h4>
              <ul className="text-sm text-neutral-600 space-y-1">
                <li className={`flex items-center ${newPassword.length >= 8 ? 'text-success-600' : ''}`}>
                  <div className={`w-2 h-2 rounded-full mr-2 ${newPassword.length >= 8 ? 'bg-success-500' : 'bg-neutral-300'}`}></div>
                  At least 8 characters long
                </li>
                <li className={`flex items-center ${newPassword === confirmPassword && newPassword.length > 0 ? 'text-success-600' : ''}`}>
                  <div className={`w-2 h-2 rounded-full mr-2 ${newPassword === confirmPassword && newPassword.length > 0 ? 'bg-success-500' : 'bg-neutral-300'}`}></div>
                  Passwords match
                </li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || newPassword.length < 8 || newPassword !== confirmPassword}
              className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-3 px-4 rounded-lg font-medium hover:from-primary-700 hover:to-secondary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Updating Password...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};