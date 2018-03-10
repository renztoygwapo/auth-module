import Middleware from '../middleware'
import { routeOption } from './utilities'
import __get from 'lodash/get'
import __merge from 'lodash/merge'

const getLoginUrls = (auth) => {
  let loginUrls = []
  let url = __get(auth.options, 'redirect.login', false)
  if (url) loginUrls.push(url.split('?')[0])
  Object.keys(auth.strategies).map(key => {
    url = __get(auth.strategies[key].options, 'redirect.login', false)
    if (url) loginUrls.push(url.split('?')[0])
  })
  return loginUrls
}

Middleware.auth = function (ctx) {
  // Disable middleware if options: { auth: false } is set on the route
  if (routeOption(ctx.route, 'auth', false)) {
    return
  }

  const meta = ctx.route.meta[0].auth
  const routeStrategy = __get(meta, 'strategy.main', '')
  const login = __get(ctx.app.$auth, '.strategies[\'' + routeStrategy + '\'].options.redirect.login', false) ||
    __get(ctx.app.$auth.options, 'redirect.login', false)

  // Not loggedIn
  if (!ctx.app.$auth.state.loggedIn) {
    // if not on login page, redirect to login page
    if (login && !(ctx.route.path === login.split('?')[0])) {
      ctx.app.$auth.redirect('login', false, routeStrategy)
    }
    return
  }

  // include/exclude strategy
  const allowedStrategies = __get(meta, 'strategy.allow', [])
  const restrictedStrategies =  __get(meta, 'strategy.restrict', [])
  let validStrategies = []
  if (allowedStrategies.length) validStrategies = __merge(allowedStrategies, routeStrategy ? [routeStrategy] : [])
  if (allowedStrategies.length && !validStrategies.includes(ctx.app.$auth.state.strategy)) {
    ctx.app.$auth.redirect('home', false, ctx.app.$auth.state.strategy)
  } else if (restrictedStrategies.length && restrictedStrategies.includes(ctx.app.$auth.state.strategy)) {
    ctx.app.$auth.redirect('home', false, ctx.app.$auth.state.strategy)
  }

  // Make sure we're not on any login page
  const loginUrls = getLoginUrls(ctx.app.$auth)
  if (loginUrls.includes(ctx.route.path)) {
    ctx.app.$auth.redirect('home', false, ctx.app.$auth.state.strategy)
  }
}
