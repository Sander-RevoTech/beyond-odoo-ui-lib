
import { Observable } from "rxjs";

export class HandleEntity<T> {

   public entity$: Observable<T> | null = null;

   constructor() {}

   public set(subscriber: Observable<T>) {
     this.entity$ = subscriber;
   }

   public get$() {
     return this.entity$;
   }
 }
