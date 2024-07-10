import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy } from '@angular/router';

export class NoReuseStrategy implements RouteReuseStrategy {
  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return false; // Nunca desanexar a instância da rota
  }

  store(route: ActivatedRouteSnapshot, detachedTree: DetachedRouteHandle): void {
    // Nunca armazenar a instância desanexada
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    return false; // Nunca reanexar a instância desanexada
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    return null; // Nunca recuperar uma instância desanexada
  }

  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return false; // Nunca reutilizar uma rota
  }
}
