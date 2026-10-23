/**
 * UGEN Client-Side Demo Generator Fallback
 * Provides instant deterministic generation if backend API is offline or during static previews.
 */

function uid() {
  return Math.random().toString(36).substring(2, 9);
}

export function generateFallbackSpec(prompt, currentSpec = null) {
  const p = (prompt || '').toLowerCase().trim();

  // 1. Analytics / Metric / SaaS Dashboard
  if (p.includes('dashboard') || p.includes('metric') || p.includes('analytic') || p.includes('revenue') || p.includes('chart')) {
    return {
      id: `spec-${uid()}`,
      title: 'Executive Analytics & Performance Hub',
      description: 'Real-time adaptive metrics, conversion velocity, and transaction monitoring.',
      version: 1,
      theme: {
        primary: '#EAAA00',
        primary_hover: '#C99100',
        secondary: '#3A0F34',
        background: '#100D12',
        surface: '#19141C',
        text_primary: '#F4F0F5',
        text_secondary: '#BDB3C1',
        border: 'rgba(221, 227, 232, 0.14)',
        radius: '16px'
      },
      current_page_id: 'page-overview',
      pages: [
        {
          id: 'page-overview',
          title: 'Live Metrics Overview',
          route: '/overview',
          layout: 'grid',
          components: [
            {
              id: 'comp-header',
              type: 'heading',
              props: {
                level: 2,
                text: 'Autonomous Growth & Revenue Intelligence',
                subtext: 'Telemetry streaming live from 4 connected regions.',
                size: '2xl'
              }
            },
            {
              id: 'comp-stat-1',
              type: 'metric_card',
              props: {
                title: 'Annual Recurring Revenue',
                value: '$482,950',
                change: '+28.4% vs last cycle',
                trend: 'up',
                accent: '#EAAA00'
              }
            },
            {
              id: 'comp-stat-2',
              type: 'metric_card',
              props: {
                title: 'Active Adaptive Sessions',
                value: '42,819',
                change: '+14.2% engagement surge',
                trend: 'up',
                accent: '#3A0F34'
              }
            },
            {
              id: 'comp-stat-3',
              type: 'metric_card',
              props: {
                title: 'Synthesis Latency',
                value: '18ms',
                change: '-45% optimization',
                trend: 'down',
                accent: '#DDE3E8'
              }
            },
            {
              id: 'comp-stat-4',
              type: 'metric_card',
              props: {
                title: 'Schema Validation Rate',
                value: '99.98%',
                change: 'Zero fatal regressions',
                trend: 'up',
                accent: '#EAAA00'
              }
            },
            {
              id: 'comp-chart-desc',
              type: 'card',
              props: {
                title: 'System Activity & Generative Flow',
                content: 'All user intent events dispatched are mapped onto deterministic component specifications with 100% type safety and zero arbitrary code execution risks.'
              }
            },
            {
              id: 'comp-btn-action',
              type: 'button',
              props: {
                label: 'Export Real-Time Telemetry',
                variant: 'primary',
                size: 'md',
                action_id: 'analytics.export'
              }
            }
          ]
        }
      ]
    };
  }

  // 2. Registration / Sign Up Form
  if (p.includes('register') || p.includes('sign up') || p.includes('create account') || p.includes('registration')) {
    return {
      id: `spec-${uid()}`,
      title: 'Adaptive Member Registration Flow',
      description: 'Streamlined account creation with inline validation and security checks.',
      version: 1,
      theme: {
        primary: '#EAAA00',
        primary_hover: '#C99100',
        secondary: '#3A0F34',
        background: '#100D12',
        surface: '#19141C',
        text_primary: '#F4F0F5',
        text_secondary: '#BDB3C1',
        border: 'rgba(221, 227, 232, 0.14)',
        radius: '16px'
      },
      current_page_id: 'page-register',
      pages: [
        {
          id: 'page-register',
          title: 'Join the Platform',
          route: '/register',
          layout: 'form',
          components: [
            {
              id: 'comp-reg-title',
              type: 'heading',
              props: {
                level: 2,
                text: 'Create Your Adaptive Account',
                subtext: 'Get started with autonomous UI generation in seconds.',
                size: '2xl'
              }
            },
            {
              id: 'field-fullname',
              type: 'text_input',
              props: {
                name: 'full_name',
                label: 'Full Name',
                placeholder: 'e.g. Elena Rostova',
                required: true
              }
            },
            {
              id: 'field-email',
              type: 'text_input',
              props: {
                name: 'email',
                label: 'Work Email Address',
                placeholder: 'elena@enterprise.io',
                type: 'email',
                required: true
              }
            },
            {
              id: 'field-password',
              type: 'text_input',
              props: {
                name: 'password',
                label: 'Secure Password',
                placeholder: 'Minimum 8 characters with numbers',
                type: 'password',
                required: true
              }
            },
            {
              id: 'field-phone',
              type: 'text_input',
              props: {
                name: 'phone',
                label: 'Mobile Contact (Optional)',
                placeholder: '+1 (555) 019-2834',
                type: 'tel',
                required: false
              }
            },
            {
              id: 'field-terms',
              type: 'checkbox',
              props: {
                name: 'terms_agreed',
                label: 'I accept the Enterprise Service Agreement & Data Privacy Policy',
                checked: false,
                required: true
              }
            },
            {
              id: 'btn-submit-reg',
              type: 'button',
              props: {
                label: 'Complete Registration',
                variant: 'primary',
                size: 'lg',
                action_id: 'form.submit_demo'
              }
            }
          ]
        }
      ]
    };
  }

  // 3. Login / Authentication
  if (p.includes('login') || p.includes('sign in') || p.includes('auth')) {
    return {
      id: `spec-${uid()}`,
      title: 'Secure Access Gateway',
      description: 'Zero-trust authentication interface with biometric & 2FA readiness.',
      version: 1,
      theme: {
        primary: '#EAAA00',
        primary_hover: '#C99100',
        secondary: '#3A0F34',
        background: '#100D12',
        surface: '#19141C',
        text_primary: '#F4F0F5',
        text_secondary: '#BDB3C1',
        border: 'rgba(221, 227, 232, 0.14)',
        radius: '16px'
      },
      current_page_id: 'page-login',
      pages: [
        {
          id: 'page-login',
          title: 'Sign In',
          route: '/login',
          layout: 'form',
          components: [
            {
              id: 'comp-login-h',
              type: 'heading',
              props: {
                level: 2,
                text: 'Welcome Back',
                subtext: 'Enter your credentials to access your adaptive workspace.',
                size: '2xl'
              }
            },
            {
              id: 'field-login-email',
              type: 'text_input',
              props: {
                name: 'email',
                label: 'Registered Email',
                placeholder: 'user@company.com',
                type: 'email',
                required: true
              }
            },
            {
              id: 'field-login-pass',
              type: 'text_input',
              props: {
                name: 'password',
                label: 'Password',
                placeholder: '••••••••••••',
                type: 'password',
                required: true
              }
            },
            {
              id: 'btn-do-login',
              type: 'button',
              props: {
                label: 'Authorize & Enter Workspace',
                variant: 'primary',
                size: 'lg',
                action_id: 'form.submit_demo'
              }
            }
          ]
        }
      ]
    };
  }

  // 4. Default / Generic Adaptive Spec
  return {
    id: `spec-${uid()}`,
    title: 'Adaptive Workspace: ' + (prompt.slice(0, 32) || 'Custom Interface'),
    description: `Generated dynamically from your prompt: "${prompt}".`,
    version: 1,
    theme: {
      primary: '#EAAA00',
      primary_hover: '#C99100',
      secondary: '#3A0F34',
      background: '#100D12',
      surface: '#19141C',
      text_primary: '#F4F0F5',
      text_secondary: '#BDB3C1',
      border: 'rgba(221, 227, 232, 0.14)',
      radius: '16px'
    },
    current_page_id: 'page-main',
    pages: [
      {
        id: 'page-main',
        title: 'Adaptive Experience',
        route: '/main',
        layout: 'grid',
        components: [
          {
            id: 'h-1',
            type: 'heading',
            props: {
              level: 2,
              text: 'Personalized Interface Generated',
              subtext: `Active synthesis for: "${prompt}"`,
              size: '2xl'
            }
          },
          {
            id: 'stat-active',
            type: 'metric_card',
            props: {
              title: 'Adaptive State',
              value: 'Optimal',
              change: 'All rules validated',
              trend: 'up',
              accent: '#EAAA00'
            }
          },
          {
            id: 'stat-nodes',
            type: 'metric_card',
            props: {
              title: 'Rendered Components',
              value: '6 Modules',
              change: '100% reactive state',
              trend: 'up',
              accent: '#DDE3E8'
            }
          },
          {
            id: 'card-details',
            type: 'card',
            props: {
              title: 'Dynamic Context & Actions',
              content: 'This interface reflects your conversational intent. Use follow-up prompts in the chat panel to add components, adjust layouts, or reconfigure styling.'
            }
          },
          {
            id: 'action-primary',
            type: 'button',
            props: {
              label: 'Trigger Demo Action',
              variant: 'primary',
              size: 'md',
              action_id: 'demo.action'
            }
          }
        ]
      }
    ]
  };
}
