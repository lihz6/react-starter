import React, { FunctionComponent } from 'react';
import { RouteComponentProps, Redirect, Switch, Route } from 'react-router-dom';
// import URLSearchParams from '@ungap/url-search-params';
type Params = {
  [key: string]: string | number;
};

type PathOf<P extends Params, Q extends Params> = {
  /**
   * Construct path from `params` and `query`.
   */
  pathOf(params?: Partial<P>, query?: Partial<Q>): string;
  /**
   * path in `<Route path={Component.path} />`.
   */
  path: string[];
};

type Mix<A, B> = (Component: A) => A & B;

interface EnhancedMatch<P, Q> extends RouteComponentProps<P> {
  // @ts-ignore
  match: RouteComponentProps<P>['match'] & { query: Q } & PathOf<P, Q>;
}

export default function withPath<P extends Params = {}, Q extends Params = {}>(
  path: string,
  defaultParams: P = {} as P,
  defaultQuery: Q = {} as Q
  // @ts-ignore
): Mix<FunctionComponent<EnhancedMatch<P, Q>>, PathOf<P, Q>> {
  return Component => {
    const [pathOf, transform] = getPathOf(path, defaultParams, defaultQuery);
    // const transform = getTransform(defaultParams, defaultQuery);
    let withRouteComponent: any;
    if (Object.keys(defaultParams).length) {
      const regPath = pathOf(keyParams(defaultParams) as any);
      const redPath = pathOf(defaultParams, defaultQuery);
      // @ts-ignore
      withRouteComponent = (props: RouteComponentProps<P>) => (
        <Switch>
          <Route
            path={regPath}
            // component={Component}
            render={_props =>
              React.createElement(Component, { ...props, ...transform(_props) })
            }
          />
          <Redirect to={redPath} />
        </Switch>
      );
      withRouteComponent.path = [path, regPath];
    } else {
      // @ts-ignore
      withRouteComponent = (props: RouteComponentProps<P>) =>
        React.createElement(Component, transform(props));
      withRouteComponent.path = [path];
    }
    withRouteComponent.displayName = `withPath(${path})`;
    withRouteComponent.pathOf = pathOf;
    return withRouteComponent;
  };
}

function getPathOf<P extends Params, Q extends Params>(
  path: string,
  defaultParams: P,
  defaultQuery: Q
): [
  PathOf<P, Q>['pathOf'],
  // @ts-ignore
  (props: RouteComponentProps<P>) => EnhancedMatch<P, Q>
] {
  function getPathOf(lockQuery: Q): PathOf<P, Q>['pathOf'] {
    const formatQuery = (query: Q) => {
      const result = [] as string[];
      for (const key in lockQuery) {
        if (lockQuery[key] === query[key]) {
          continue;
        }
        const { [key]: value = lockQuery[key] } = query;
        result.push(`${key}=${encodeURIComponent(value)}`);
      }
      if (result.length) {
        return `?${result.join('&')}`;
      }
      return '';
    };
    const pkeys = Object.keys(defaultParams);
    const qkeys = Object.keys(defaultQuery);
    if (pkeys.length && qkeys.length) {
      return (params, query) => {
        const _params = { ...defaultParams, ...params };
        return `${path}/${pkeys
          .map(key => _params[key])
          .join('/')}${formatQuery({ ...defaultQuery, ...query })}`;
      };
    }
    if (pkeys.length) {
      return params => {
        const _params = { ...defaultParams, ...params };
        return `${path}/${pkeys.map(key => _params[key]).join('/')}`;
      };
    }
    if (qkeys.length) {
      return (_, query) => {
        return `${path}${formatQuery({ ...defaultQuery, ...query })}`;
      };
    }
    return () => path;
  }

  const pathOf = getPathOf(defaultQuery);
  function getTransform(
    lockParams: P,
    lockQuery: Q
    // @ts-ignore
  ): (props: RouteComponentProps<P>) => EnhancedMatch<P, Q> {
    function map<T>(params: T): (p: T) => T {
      const keys = Object.keys(params);
      const mapper = keys.reduce((a, b) => {
        if (typeof params[b] === 'number') {
          a[b] = Number;
        } else {
          a[b] = echo;
        }
        return a;
      }, {});
      return _params => {
        return keys.reduce((p, k) => {
          p[k] = mapper[k](_params[k]);
          return p;
        }, {}) as T;
      };
    }
    const mapParams = map(lockParams);
    const mapQuery = map(lockQuery);
    return props => {
      const {
        match: { params },
        location: { search },
      } = props;
      props.match['pathOf'] = pathOf;
      defaultParams = props.match.params = mapParams(params);
      defaultQuery = props.match['query'] = mapQuery({
        ...lockQuery,
        ...Object.fromEntries(new URLSearchParams(search)),
      });
      return props as EnhancedMatch<P, Q>;
    };
  }
  const transform = getTransform(defaultParams, defaultQuery);
  return [pathOf, transform];
}

function keyParams<P extends Params>(params: P): P {
  return Object.keys(params).reduce((o, k) => {
    (o as any)[k] = `:${k}`;
    return o;
  }, {} as P);
}

function echo<T>(arg: T): T {
  return arg;
}
