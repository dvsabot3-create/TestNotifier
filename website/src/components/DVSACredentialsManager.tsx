/**
 * DVSA Credentials Manager Component
 * Allows Professional tier users to securely store and manage DVSA login credentials
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { Shield, Key, Trash2, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface DVSACredentials {
  username: string;
  licenceNumber?: string;
  storedAt?: string;
}

export default function DVSACredentialsManager() {
  const { user } = useAuth();
  const [credentials, setCredentials] = useState<DVSACredentials | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [validating, setValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [licenceNumber, setLicenceNumber] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Check if user has Professional tier
  const isProfessional = user?.subscription?.tier === 'professional';

  // Fetch existing credentials on mount
  useEffect(() => {
    if (isProfessional) {
      fetchCredentials();
    }
  }, [isProfessional]);

  const fetchCredentials = async () => {
    if (!user?.token) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/dvsa-credentials/retrieve', {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        setCredentials(data.credentials);
      } else if (data.error === 'No DVSA credentials stored') {
        setCredentials(null);
      } else {
        setError(data.error || 'Failed to fetch credentials');
      }
    } catch (error) {
      console.error('Error fetching DVSA credentials:', error);
      setError('Failed to fetch credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleStoreCredentials = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.token) return;

    if (!username || !password) {
      setError('Username and password are required');
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/dvsa-credentials/store', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim(),
          licenceNumber: licenceNumber.trim()
        })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('DVSA credentials stored securely');
        setCredentials({
          username: username.trim(),
          licenceNumber: licenceNumber.trim(),
          storedAt: new Date().toISOString()
        });
        // Clear password field for security
        setPassword('');
      } else {
        setError(data.error || 'Failed to store credentials');
      }
    } catch (error) {
      console.error('Error storing DVSA credentials:', error);
      setError('Failed to store credentials');
    } finally {
      setSaving(false);
    }
  };

  const handleValidateCredentials = async () => {
    if (!user?.token || !username || !password) return;

    setValidating(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/dvsa-credentials/validate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim()
        })
      });

      const data = await response.json();

      if (data.success) {
        if (data.valid) {
          setSuccess('DVSA credentials validated successfully');
        } else {
          setError('Invalid DVSA credentials format');
        }
      } else {
        setError(data.error || 'Failed to validate credentials');
      }
    } catch (error) {
      console.error('Error validating DVSA credentials:', error);
      setError('Failed to validate credentials');
    } finally {
      setValidating(false);
    }
  };

  const handleDeleteCredentials = async () => {
    if (!user?.token) return;

    if (!window.confirm('Are you sure you want to delete your DVSA credentials?')) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/dvsa-credentials/delete', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('DVSA credentials deleted successfully');
        setCredentials(null);
        setUsername('');
        setPassword('');
        setLicenceNumber('');
      } else {
        setError(data.error || 'Failed to delete credentials');
      }
    } catch (error) {
      console.error('Error deleting DVSA credentials:', error);
      setError('Failed to delete credentials');
    } finally {
      setLoading(false);
    }
  };

  if (!isProfessional) {
    return (
      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-800">
            <Shield className="h-5 w-5" />
            DVSA Credentials Storage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="border-yellow-200 bg-yellow-100">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              DVSA credentials storage is only available for Professional tier subscribers.
              <a href="/pricing" className="font-medium underline">Upgrade to Professional</a> to access this feature.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <Key className="h-5 w-5" />
          DVSA Login Credentials
        </CardTitle>
        <p className="text-sm text-gray-600 mt-1">
          Securely store your DVSA credentials for automatic login during slot detection
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive" className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        {credentials && (
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-blue-900">Stored Credentials</p>
                <p className="text-sm text-blue-700">Username: {credentials.username}</p>
                {credentials.licenceNumber && (
                  <p className="text-sm text-blue-700">Licence: {credentials.licenceNumber}</p>
                )}
                {credentials.storedAt && (
                  <p className="text-xs text-blue-600 mt-1">
                    Stored: {new Date(credentials.storedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteCredentials}
                disabled={loading}
                className="flex items-center gap-2"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                Delete
              </Button>
            </div>
          </div>
        )}

        <form onSubmit={handleStoreCredentials} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="dvsa-username" className="text-sm font-medium text-gray-700">
              DVSA Username
            </label>
            <Input
              id="dvsa-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your DVSA username"
              required
              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="dvsa-password" className="text-sm font-medium text-gray-700">
              DVSA Password
            </label>
            <div className="relative">
              <Input
                id="dvsa-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your DVSA password"
                required
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="dvsa-licence" className="text-sm font-medium text-gray-700">
              Driving Licence Number (Optional)
            </label>
            <Input
              id="dvsa-licence"
              type="text"
              value={licenceNumber}
              onChange={(e) => setLicenceNumber(e.target.value)}
              placeholder="Enter your driving licence number"
              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={saving || !username || !password}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Storing...
                </>
              ) : (
                <>
                  <Key className="h-4 w-4 mr-2" />
                  Store Credentials
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleValidateCredentials}
              disabled={validating || !username || !password}
              className="flex items-center gap-2"
            >
              {validating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle className="h-4 w-4" />
              )}
              Validate
            </Button>
          </div>
        </form>

        <div className="text-xs text-gray-500 space-y-1">
          <p>• Credentials are encrypted with AES-256 encryption</p>
          <p>• Only stored for Professional tier subscribers</p>
          <p>• Used for automatic DVSA login during slot detection</p>
          <p>• Never shared with third parties</p>
        </div>
      </CardContent>
    </Card>
  );
}

// UI Components (simplified versions)
const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-lg shadow-sm border ${className}`}>{children}</div>
);

const CardHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="px-6 py-4 border-b border-gray-200">{children}</div>
);

const CardTitle = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <h3 className={`text-lg font-semibold ${className}`}>{children}</h3>
);

const CardContent = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);

const Input = ({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    {...props}
  />
);

const Button = ({
  children,
  variant = 'default',
  size = 'default',
  className,
  ...props
}: {
  children: React.ReactNode;
  variant?: 'default' | 'outline' | 'destructive';
  size?: 'default' | 'sm';
  className?: string;
  [key: string]: any;
}) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const variantClasses = {
    default: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    outline: "border border-gray-300 bg-transparent hover:bg-gray-50 focus:ring-gray-500",
    destructive: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
  };
  const sizeClasses = {
    default: "px-4 py-2 text-sm",
    sm: "px-3 py-1.5 text-xs"
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const Alert = ({
  children,
  variant = 'default',
  className
}: {
  children: React.ReactNode;
  variant?: 'default' | 'destructive';
  className?: string;
}) => (
  <div className={`p-4 rounded-lg border ${variant === 'destructive' ? 'border-red-200 bg-red-50' : 'border-blue-200 bg-blue-50'} ${className}`}>
    {children}
  </div>
);

const AlertDescription = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={`text-sm ${className}`}>{children}</div>
);

export { Card, CardHeader, CardTitle, CardContent, Input, Button, Alert, AlertDescription };