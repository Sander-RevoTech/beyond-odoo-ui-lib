var BydMainRoute;
(function (BydMainRoute) {
    BydMainRoute["HOME"] = "HOME";
    BydMainRoute["USERLOGIN"] = "USERLOGIN";
    BydMainRoute["USERLOGOUT"] = "USERLOGOUT";
})(BydMainRoute || (BydMainRoute = {}));
class BydRoutesCore {
    routes = [
        {
            key: BydMainRoute.HOME,
            url: '',
        },
        {
            key: BydMainRoute.USERLOGIN,
            url: 'login',
        },
        {
            key: BydMainRoute.USERLOGOUT,
            url: 'logout',
        },
    ];
    constructor() { }
    addRoute(route) {
        this.routes.push(route);
    }
    addRoutes(routes) {
        routes.forEach(route => this.addRoute(route));
    }
    getHome() {
        return this.getAbsoluteUrl([BydMainRoute.HOME]);
    }
    getLogin() {
        return this.getAbsoluteUrl([BydMainRoute.USERLOGIN]);
    }
    getLogout() {
        return this.getAbsoluteUrl([BydMainRoute.USERLOGOUT]);
    }
    getUrl(eNums, params = {}, strict = false) {
        const url = this._replaceParams(this._getUrl(eNums), params);
        return strict ? this._removeParams(url) : url;
    }
    getAbsoluteUrl(eNums, params = {}, queryParams = null, strict = false) {
        const url = this._replaceParams(this._getUrl(eNums, true), params);
        return (strict ? this._removeParams(url) : url) + (queryParams ? this._formatQueryParams(queryParams) : '');
    }
    addQueryParamsToUrl(route, params = {}) {
        const keys = Object.keys(params);
        for (let key of keys) {
            route.params[key] = params[key];
        }
        return route.toString();
    }
    getPermission(eNums) {
        const route = this._getRouteByENum(eNums);
        if (route === null) {
            return true;
        }
        else {
            return route.canActivate === undefined ? true : route.canActivate;
        }
    }
    _replaceParams(url, params) {
        if (!params || Object.keys(params).length === 0) {
            return url;
        }
        // Create regex using the keys of the replacement object.
        const regex = new RegExp(':(' + Object.keys(params).join('|') + ')', 'g');
        // Replace the string by the value in object
        return url.replace(regex, (m, $1) => params[$1] || m);
    }
    _removeParams(url) {
        const regex = new RegExp('/:([a-zA-Z0-9_]*)', 'g');
        return url.replace(regex, '');
    }
    _getRouteByENum(eNums) {
        let route = null;
        for (const eNum of eNums) {
            route = this._getByENum(route === null ? this.routes : route.children, eNum);
            if (route === null) {
                return null;
            }
        }
        return route;
    }
    _getUrl(eNums, absolute = false) {
        let route = null;
        let url = '';
        for (const eNum of eNums) {
            route = this._getByENum(route === null ? this.routes : route.children, eNum);
            if (route === null) {
                break;
            }
            url += (url === '' ? '' : '/') + route.url;
        }
        return route === null ? '' : absolute === false ? route.url : '/' + url;
    }
    _getByENum(routes, eNum) {
        if (!routes) {
            return null;
        }
        for (const route of routes) {
            if (route.key === eNum) {
                return route;
            }
        }
        return null;
    }
    _formatQueryParams(params) {
        const queryString = Object.entries(params)
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            .join('&');
        return queryString ? `?${queryString}` : '';
    }
}
const BydRoutes = new BydRoutesCore();

/*
 * Public API Surface of menu
 */

/**
 * Generated bundle index. Do not edit.
 */

export { BydMainRoute, BydRoutes, BydRoutesCore };
//# sourceMappingURL=beyond-menu.mjs.map
