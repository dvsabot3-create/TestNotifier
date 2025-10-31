import { defineConfig, splitVendorChunkPlugin } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import viteCompression from 'vite-plugin-compression'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react({
      fastRefresh: false, // Disable React Fast Refresh to fix preamble error
    }),

    // Automatic vendor chunk splitting
    splitVendorChunkPlugin(),

    // Bundle analyzer - generates stats.html for analysis
    visualizer({
      filename: 'dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
      template: 'treemap', // Better visualization for large bundles
    }),

    // Compression plugin for gzip and brotli
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 1024, // Only compress files larger than 1KB
      filter: (file) => !file.includes('stats.html'), // Don't compress stats file
    }),

    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 1024,
      filter: (file) => !file.includes('stats.html'),
    }),


    // Progressive Web App configuration
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,avif}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\//i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\//i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /^https:\/\/api\.testnotifier\.com\//i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 5, // 5 minutes
              },
              cacheableResponse: {
                statuses: [0, 200, 201],
              },
            },
          },
        ],
      },
      manifest: {
        name: 'TestNotifier - DVSA Test Cancellation Finder',
        short_name: 'TestNotifier',
        description: 'Find cancelled driving tests with AI-powered monitoring',
        theme_color: '#2563eb',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
  server: {
    port: 3003,
    host: true,
    // Optimize dev server performance
    hmr: {
      overlay: true,
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,

    // Optimize chunk size warnings
    chunkSizeWarningLimit: 1000, // 1MB warning limit

    // Optimize build performance
    target: 'es2015',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        passes: 2, // Double compression pass
      },
      mangle: {
        safari10: true,
      },
      format: {
        comments: false, // Remove comments
      },
    },

    // CSS optimization
    cssTarget: 'es2015',
    cssCodeSplit: true, // Enable CSS code splitting

    // Enable brotli compression
    brotliSize: true,

    // Rollup optimizations
    rollupOptions: {
      output: {
        // Manual chunk splitting strategy
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            // Vendor chunk splitting
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor';
            }
            if (id.includes('gsap')) {
              return 'animation-vendor';
            }
            if (id.includes('axios') || id.includes('date-fns')) {
              return 'utils-vendor';
            }
            if (id.includes('@sentry') || id.includes('react-ga4')) {
              return 'monitoring-vendor';
            }
            if (id.includes('lucide')) {
              return 'icons-vendor';
            }
            return 'vendor';
          }

          // Route-based code splitting for large components
          if (id.includes('/components/figma/')) {
            const componentName = id.split('/').pop()?.replace(/\.(tsx?|jsx?)$/, '');
            return `components/${componentName}`;
          }

          if (id.includes('/pages/')) {
            const pageName = id.split('/').pop()?.replace(/\.(tsx?|jsx?)$/, '');
            return `pages/${pageName}`;
          }
        },

        // Optimize chunk naming
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId;
          if (facadeModuleId) {
            const fileName = facadeModuleId.split('/').pop()?.replace(/\.(ts|tsx|js|jsx)$/, '');
            return `assets/${fileName}-[hash].js`;
          }
          return 'assets/[name]-[hash].js';
        },

        // Optimize asset naming
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.').pop();
          if (info === 'css') return 'assets/css/[name]-[hash][extname]';
          if (/\.(png|jpe?g|svg|gif|webp|avif)$/.test(assetInfo.name || '')) {
            return 'assets/images/[name]-[hash][extname]';
          }
          if (/\.(woff2?|ttf|eot)$/.test(assetInfo.name || '')) {
            return 'assets/fonts/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },

        // Optimize entry chunk naming
        entryFileNames: 'assets/[name]-[hash].js',

        // Enable inline dynamic imports for better caching
        inlineDynamicImports: false,
      },

      // Tree shaking
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        tryCatchDeoptimization: false,
      },
    },
  },

  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'gsap',
      'gsap/ScrollTrigger',
      'axios',
      '@sentry/react',
      'react-ga4',
      'date-fns',
      'clsx',
      'lucide-react'
    ],
    esbuildOptions: {
      target: 'es2015',
    },
  },

  // Resolve configuration
  resolve: {
    alias: {
      '@': '/src',
    },
    // Optimize module resolution
    mainFields: ['module', 'jsnext:main', 'jsnext', 'main'],
  },

  // CSS configuration
  css: {
    devSourcemap: true,
    preprocessorOptions: {
      css: {
        // Fix CSS nesting warnings
        postcss: {
          plugins: [
            {
              postcssPlugin: 'fix-nesting',
              Rule(rule) {
                if (rule.selector.includes('&')) {
                  rule.selector = rule.selector.replace(/(\s|^)&/g, ':is($1)');
                }
              },
            },
          ],
        },
      },
    },
  },

  // Preview server configuration
  preview: {
    port: 4173,
    host: true,
  },

  // Define global constants
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
  },
})