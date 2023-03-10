module.exports = function(config) {
  config.set({
    frameworks: ['jasmine', 'jasmine-matchers'],
      preprocessors: {
        '*.js': ['coverage']
      },
    files: [
        './custom-matchers.js',
        '*.js',
        '*.spec.js'
    ],
      plugins: [
          'karma-jasmine',
          'karma-jasmine-matchers',
          'karma-chrome-launcher',
          'karma-coverage'
      ],
      reporters: ['dots', 'coverage'],
      //reporters: ['progress'],
      browsers: ['ChromeHeadless'],
      browserNoActivityTimeout: 30000,
      color: true,
      singleRun: true,
      coverage: {
          dir: 'coverage/',
          reporters: [
              { type: 'html', subdir: 'html' }
          ]
      }
  });
};
