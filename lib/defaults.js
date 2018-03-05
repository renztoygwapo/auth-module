const providers = require('./auth/providers')

module.exports = {
  //  Error handling

  resetOnError: false,

  // Authorization

  scopeKey: 'scope',

  // Redirects

  rewriteRedirects: true,

  redirect: {
    login: '/login',
    logout: '/',
    home: '/',
    callback: '/login'
  },

  // Vuex Store

  vuex: {
    namespace: 'auth'
  },

  // Cookie Store

  cookie: {
    prefix: 'auth.',
    options: {
      path: '/'
    }
  },

  // localStorage Store

  localStorage: {
    prefix: 'auth.'
  },

  // Token

  token: {
    prefix: '_token.'
  },

  // Providers
  providers: Object.assign({}, providers),

  // API
  api: {
    endpoints: {
      user: {
        url: '/api/auth/user',
        method: 'get',
        propertyName: 'user'
      },
      logout: {
        url: '/api/auth/logout',
        method: 'post'
      }
    }
  },

  // Strategies
  defaultStrategy: undefined /* will be auto set at module level */,

  strategies: {
    local: {
      endpoints: {
        login: {
          url: '/api/auth/login',
          method: 'post',
          propertyName: 'access_token'
        },
        logout: {
          url: '/api/auth/logout',
          method: 'post'
        },
        user: {
          url: '/api/auth/user',
          method: 'get',
          propertyName: 'user'
        }
      }
    }
  }
}
