import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { wrapComponent, getComponent, RouteItem, IFaaSContext, INodeModule, IWindow } from 'ssr-client-utils'

declare const window: IWindow
declare const module: INodeModule
declare const __isBrowser__: boolean

const clientRender = async (): Promise<void> => {
  // 客户端渲染||hydrate
  ReactDOM[window.__USE_SSR__ ? 'hydrate' : 'render'](
    <BrowserRouter>
      <Switch>
        {
          // 使用高阶组件wrapComponent使得csr首次进入页面以及csr/ssr切换路由时调用getInitialProps
          routes.map((item: RouteItem) => {
            const Layout = item.component.Layout
            const WrappedComponent = wrapComponent(item.component)
            return <Route exact={item.exact} key={item.path} path={item.path} render={() => <Layout key={location.pathname}><WrappedComponent /></Layout>} />
          })
        }
      </Switch>
    </BrowserRouter>
    , document.getElementById('app'))
  if (process.env.NODE_ENV === 'development' && module.hot) {
    module.hot.accept()
  }
}

const serverRender = async (ctx: IFaaSContext, config): Promise<JSX.Element> => {
  const ActiveComponent = getComponent(routes, ctx.path)()
  const Layout = ActiveComponent.Layout

  if (config.type !== 'ssr') {
    return <Layout ctx></Layout>
  }
  const serverData = ActiveComponent.getInitialProps ? await ActiveComponent.getInitialProps(ctx) : {}
  ctx.serverData = serverData
  return <Layout ctx>
      <ActiveComponent {...serverData} />
    </Layout>

}

export default __isBrowser__ ? clientRender() : serverRender