import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { AlertCircle, CheckCircle, Chrome, User, CreditCard, BarChart, Shield } from 'lucide-react';
import { AuthModal } from './auth/AuthModal';
import { SubscriptionModal } from './subscription/SubscriptionModal';
import { DownloadFlow } from './download/DownloadFlow';
import { authAPI, subscriptionAPI, analyticsAPI, extensionAPI } from '../utils/api';
import { analytics, trackEvent } from '../utils/analytics';
import { securityManager, InputValidator } from '../utils/security';
import { logger } from '../utils/logging';

interface IntegrationStatus {
  authentication: {
    status: 'pending' | 'connected' | 'error';
    user?: any;
    error?: string;
  };
  subscription: {
    status: 'pending' | 'active' | 'inactive' | 'error';
    plan?: any;
    error?: string;
  };
  extension: {
    status: 'pending' | 'installed' | 'not-installed' | 'error';
    version?: string;
    error?: string;
  };
  analytics: {
    status: 'pending' | 'connected' | 'error';
    trackingId?: string;
    error?: string;
  };
}

export function IntegrationHub() {
  const [status, setStatus] = useState<IntegrationStatus>({
    authentication: { status: 'pending' },
    subscription: { status: 'pending' },
    extension: { status: 'pending' },
    analytics: { status: 'pending' }
  });

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showDownloadFlow, setShowDownloadFlow] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeStep, setActiveStep] = useState(0);

  const integrationSteps = [
    { key: 'authentication', title: 'Authentication', icon: User },
    { key: 'subscription', title: 'Subscription', icon: CreditCard },
    { key: 'extension', title: 'Chrome Extension', icon: Chrome },
    { key: 'analytics', title: 'Analytics', icon: BarChart }
  ];

  useEffect(() => {
    initializeIntegration();
  }, []);

  const initializeIntegration = async () => {
    try {
      logger.info('integration', 'Starting integration initialization');

      // Initialize security
      securityManager.initialize();

      // Check authentication status
      await checkAuthentication();

      // Check subscription status
      await checkSubscription();

      // Check extension status
      await checkExtension();

      // Initialize analytics
      await initializeAnalytics();

      // Determine active step
      const currentStep = determineCurrentStep();
      setActiveStep(currentStep);

      logger.info('integration', 'Integration initialization completed', {
        authentication: status.authentication.status,
        subscription: status.subscription.status,
        extension: status.extension.status,
        analytics: status.analytics.status
      });

    } catch (error) {
      logger.error('integration', 'Failed to initialize integration', { error });
      trackEvent('integration_initialization_failed', 'error', 'initialization');
    } finally {
      setIsLoading(false);
    }
  };

  const checkAuthentication = async () => {
    try {
      const token = localStorage.getItem('auth_token');

      if (!token) {
        setStatus(prev => ({
          ...prev,
          authentication: { status: 'pending' }
        }));
        return;
      }

      // Validate token
      if (!securityManager.validateAuthToken(token)) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');

        setStatus(prev => ({
          ...prev,
          authentication: { status: 'pending' }
        }));
        return;
      }

      // Get current user
      const response = await authAPI.getCurrentUser();

      if (response.success) {
        analytics.setUserId(response.data.id);

        setStatus(prev => ({
          ...prev,
          authentication: {
            status: 'connected',
            user: response.data
          }
        }));

        logger.info('integration', 'Authentication verified', { userId: response.data.id });
        trackEvent('authentication_verified', 'integration', 'auth');
      } else {
        throw new Error(response.message);
      }

    } catch (error) {
      logger.error('integration', 'Authentication check failed', { error });

      setStatus(prev => ({
        ...prev,
        authentication: {
          status: 'error',
          error: error.message
        }
      }));

      trackEvent('authentication_check_failed', 'error', 'auth', undefined, { error: error.message });
    }
  };

  const checkSubscription = async () => {
    try {
      if (status.authentication.status !== 'connected') {
        setStatus(prev => ({
          ...prev,
          subscription: { status: 'pending' }
        }));
        return;
      }

      const response = await subscriptionAPI.getSubscription();

      if (response.success) {
        setStatus(prev => ({
          ...prev,
          subscription: {
            status: response.data.status === 'active' ? 'active' : 'inactive',
            plan: response.data
          }
        }));

        logger.info('integration', 'Subscription status retrieved', {
          plan: response.data.planName,
          status: response.data.status
        });

        trackEvent('subscription_status_retrieved', 'integration', 'subscription');
      } else {
        throw new Error(response.message);
      }

    } catch (error) {
      logger.error('integration', 'Subscription check failed', { error });

      setStatus(prev => ({
        ...prev,
        subscription: {
          status: 'error',
          error: error.message
        }
      }));

      trackEvent('subscription_check_failed', 'error', 'subscription');
    }
  };

  const checkExtension = async () => {
    try {
      // Check if extension is installed
      if (typeof chrome !== 'undefined' && chrome.runtime) {
        try {
          const manifest = await extensionAPI.getManifest();

          setStatus(prev => ({
            ...prev,
            extension: {
              status: 'installed',
              version: manifest.data?.version
            }
          }));

          logger.info('integration', 'Extension detected', { version: manifest.data?.version });
          trackEvent('extension_detected', 'integration', 'extension');
        } catch (error) {
          setStatus(prev => ({
            ...prev,
            extension: { status: 'not-installed' }
          }));
        }
      } else {
        setStatus(prev => ({
          ...prev,
          extension: { status: 'not-installed' }
        }));
      }

    } catch (error) {
      logger.error('integration', 'Extension check failed', { error });

      setStatus(prev => ({
        ...prev,
        extension: {
          status: 'error',
          error: error.message
        }
      }));

      trackEvent('extension_check_failed', 'error', 'extension');
    }
  };

  const initializeAnalytics = async () => {
    try {
      // Initialize Google Analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('config', 'GA_MEASUREMENT_ID', {
          page_path: window.location.pathname,
          custom_map: {
            dimension1: 'user_type',
            dimension2: 'subscription_plan',
            dimension3: 'extension_installed'
          }
        });

        setStatus(prev => ({
          ...prev,
          analytics: {
            status: 'connected',
            trackingId: 'GA_MEASUREMENT_ID'
          }
        }));

        logger.info('integration', 'Analytics initialized');
        trackEvent('analytics_initialized', 'integration', 'analytics');
      } else {
        setStatus(prev => ({
          ...prev,
          analytics: { status: 'pending' }
        }));
      }

    } catch (error) {
      logger.error('integration', 'Analytics initialization failed', { error });

      setStatus(prev => ({
        ...prev,
        analytics: {
          status: 'error',
          error: error.message
        }
      }));

      trackEvent('analytics_initialization_failed', 'error', 'analytics');
    }
  };

  const determineCurrentStep = () => {
    if (status.authentication.status !== 'connected') return 0;
    if (status.subscription.status !== 'active') return 1;
    if (status.extension.status !== 'installed') return 2;
    return 3;
  };

  const handleStepAction = async (stepIndex: number) => {
    const step = integrationSteps[stepIndex];

    try {
      switch (step.key) {
        case 'authentication':
          setShowAuthModal(true);
          trackEvent('auth_modal_opened', 'integration', 'auth');
          break;

        case 'subscription':
          if (status.authentication.status === 'connected') {
            setShowSubscriptionModal(true);
            trackEvent('subscription_modal_opened', 'integration', 'subscription');
          } else {
            alert('Please complete authentication first');
          }
          break;

        case 'extension':
          setShowDownloadFlow(true);
          trackEvent('download_flow_opened', 'integration', 'extension');
          break;

        case 'analytics':
          // Analytics is automatically initialized
          trackEvent('analytics_settings_opened', 'integration', 'analytics');
          break;
      }
    } catch (error) {
      logger.error('integration', `Failed to handle step action: ${step.key}`, { error });
    }
  };

  const handleAuthSuccess = async (user: any) => {
    setStatus(prev => ({
      ...prev,
      authentication: { status: 'connected', user }
    }));

    analytics.setUserId(user.id);

    // Refresh subscription status
    await checkSubscription();

    logger.info('integration', 'Authentication successful', { userId: user.id });
    trackEvent('authentication_success', 'integration', 'auth');
  };

  const handleSubscriptionSuccess = async (subscription: any) => {
    setStatus(prev => ({
      ...prev,
      subscription: {
        status: subscription.status === 'active' ? 'active' : 'inactive',
        plan: subscription
      }
    }));

    logger.info('integration', 'Subscription updated', {
      plan: subscription.planName,
      status: subscription.status
    });

    trackEvent('subscription_updated', 'integration', 'subscription');
  };

  const handleExtensionInstalled = async () => {
    setStatus(prev => ({
      ...prev,
      extension: { status: 'installed' }
    }));

    logger.info('integration', 'Extension installed successfully');
    trackEvent('extension_installed', 'integration', 'extension');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
      case 'active':
      case 'installed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <div className="w-5 h-5 bg-gray-300 rounded-full" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
      case 'active':
      case 'installed':
        return 'border-green-200 bg-green-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1d70b8] mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing integration hub...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card className="border-[#1d70b8]/20">
        <CardHeader className="bg-gradient-to-r from-[#1d70b8]/5 to-[#2e8bc0]/5">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-[#1d70b8]" />
            <div>
              <CardTitle className="text-xl text-gray-900">Integration Hub</CardTitle>
              <CardDescription>
                Manage your TestNotifier integration and settings
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <!-- Integration Steps -->
          <div className="space-y-4">
            {integrationSteps.map((step, index) => {
              const stepStatus = status[step.key as keyof IntegrationStatus];
              const Icon = step.icon;

              return (
                <Card
                  key={step.key}
                  className={`border-2 transition-all duration-200 ${
                    index === activeStep
                      ? 'border-[#1d70b8] shadow-lg scale-105'
                      : getStatusColor(stepStatus.status)
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border-2 border-gray-200">
                          <Icon className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{step.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            {getStatusIcon(stepStatus.status)}
                            <span className="text-sm text-gray-600">
                              {stepStatus.status === 'connected' || stepStatus.status === 'active' || stepStatus.status === 'installed'
                                ? 'Connected'
                                : stepStatus.status === 'error'
                                ? stepStatus.error
                                : 'Not configured'
                              }
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleStepAction(index)}
                        variant={index === activeStep ? "default" : "outline"}
                        className={index === activeStep
                          ? "bg-gradient-to-r from-[#1d70b8] to-[#2e8bc0] text-white"
                          : "border-gray-300 text-gray-700"
                        }
                      >
                        {index === activeStep ? 'Configure' : 'Edit'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <!-- Integration Summary -->
          <Card className="bg-gradient-to-r from-gray-50 to-blue-50">
            <CardHeader>
              <CardTitle className="text-lg">Integration Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#1d70b8]">
                    {Object.values(status).filter(s =>
                      s.status === 'connected' || s.status === 'active' || s.status === 'installed'
                    ).length}
                  </div>
                  <div className="text-sm text-gray-600">Connected</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {status.authentication.user ? '1' : '0'}
                  </div>
                  <div className="text-sm text-gray-600">Users</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {status.subscription.plan?.planName || 'None'}
                  </div>
                  <div className="text-sm text-gray-600">Plan</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {status.extension.version ? '✓' : '✗'}
                  </div>
                  <div className="text-sm text-gray-600">Extension</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- Quick Actions -->
          <div className="grid md:grid-cols-3 gap-4">
            <Button
              onClick={() => {
                trackEvent('quick_action_dashboard', 'integration', 'dashboard');
                window.location.href = '/dashboard';
              }}
              className="bg-gradient-to-r from-[#1d70b8] to-[#2e8bc0] text-white"
            >
              <BarChart className="w-4 h-4 mr-2" />
              Go to Dashboard
            </Button>

            <Button
              onClick={() => {
                trackEvent('quick_action_support', 'integration', 'support');
                window.location.href = '/support';
              }}
              variant="outline"
              className="border-[#1d70b8] text-[#1d70b8]"
            >
              Get Support
            </Button>

            <Button
              onClick={() => {
                trackEvent('quick_action_documentation', 'integration', 'docs');
                window.open('https://docs.testnotifier.co.uk', '_blank');
              }}
              variant="outline"
              className="border-gray-300 text-gray-700"
            >
              Documentation
            </Button>
          </div>
        </CardContent>
      </Card>

      <!-- Modals -->
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        source="integration_hub"
      />

      <SubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
        source="integration_hub"
        currentPlan={status.subscription.plan?.id}
      />

      <DownloadFlow
        isOpen={showDownloadFlow}
        onClose={() => setShowDownloadFlow(false)}
        source="integration_hub"
        onComplete={handleExtensionInstalled}
      />
    </div>
  );
}

// Modal wrapper component for DownloadFlow
function DownloadFlowModal({ isOpen, onClose, source, onComplete }: {
  isOpen: boolean;
  onClose: () => void;
  source: string;
  onComplete: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Install Chrome Extension</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <DownloadFlow
            onComplete={() => {
              onComplete();
              onClose();
            }}
            source={source}
          />
        </div>
      </div>
    </div>
  );
}