import { CommonModule } from '@angular/common';
import { inject, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard, authServiceProviders, permissionGuard } from '@auth';
import { EsmAuthService } from '@esm/api';
import { ESM_CONFIG } from '@esm/config';
import {
  appReducer,
  EsmEffects,
  esmFeatureKey,
  EsmSelector,
  EsmState,
} from '@esm/store';
import { EffectsModule } from '@ngrx/effects';
import { routerReducer, StoreRouterConnectingModule } from '@ngrx/router-store';
import { Store, StoreModule } from '@ngrx/store';
import { layoutProviders, useLayoutRoutes } from '@utconnect/components';
import { TAIGA_PROVIDERS } from '@utconnect/utils';
import { RECAPTCHA_SETTINGS } from 'ng-recaptcha';
import { combineLatest, map, tap } from 'rxjs';
import { extModules } from './build-specifics';
import { esmSideBarItems, EsmTopBarConstants } from './constants';
import { Role } from './roles';

const NGRX = [
  StoreModule.forRoot({ router: routerReducer }, {}),
  StoreModule.forFeature(esmFeatureKey, appReducer),
  EffectsModule.forRoot([EsmEffects]),
  StoreRouterConnectingModule.forRoot(),
];

export const routes: Routes = [
  {
    path: '',
    loadChildren: async () => (await import('@esm/home')).ROUTES,
  },
  {
    path: 'create',
    canActivate: [permissionGuard],
    data: {
      roles: [Role.EXAMINATION_DEPARTMENT_HEAD],
      isCreateMode: true,
    },
    loadChildren: async () => (await import('@esm/examination')).ROUTES,
  },
  //     {
  //       path: 'data',
  //       canActivate: [permissionGuard],
  //       data: {
  //         roles: [Role.EXAMINATION_DEPARTMENT_HEAD],
  //       },
  //       loadChildren: async () => (await import('./data/data.routing')).ROUTES,
  //     },
  //     {
  //       path: 'notification',
  //       loadChildren: async () =>
  //         (await import('./notification/notification.routing')).ROUTES,
  //     },
  //     {
  //       path: 'settings',
  //       loadChildren: async () =>
  //         (await import('./settings/settings.routing')).ROUTES,
  //     },
  //     {
  //       path: ':examinationId',
  //       canActivate: [authGuard],
  //       children: [
  //         {
  //           path: '',
  //           loadChildren: async () =>
  //             (await import('./examination/general/general.routing')).ROUTES,
  //         },
  //         {
  //           path: 'exam',
  //           children: [
  //             {
  //               path: '',
  //               canActivate: [permissionGuard],
  //               loadChildren: async () =>
  //                 (await import('./examination/exam/exam.routing')).ROUTES,
  //             },
  //             {
  //               path: 'data',
  //               canActivate: [permissionGuard],
  //               data: {
  //                 roles: [Role.EXAMINATION_DEPARTMENT_HEAD],
  //               },
  //               loadChildren: async () =>
  //                 (await import('./examination/data/data.routing')).ROUTES,
  //             },
  //             {
  //               path: 'handover',
  //               canActivate: [permissionGuard],
  //               data: {
  //                 roles: [Role.EXAMINATION_DEPARTMENT_HEAD],
  //               },
  //               loadChildren: async () =>
  //                 (await import('./examination/handover/handover.routing'))
  //                   .ROUTES,
  //             },
  //           ],
  //         },
  //         {
  //           path: 'invigilator',
  //           children: [
  //             {
  //               path: 'assign-faculty',
  //               canActivate: [permissionGuard],
  //               data: {
  //                 roles: [Role.EXAMINATION_DEPARTMENT_HEAD],
  //               },
  //               loadChildren: async () =>
  //                 (
  //                   await import(
  //                     './invigilator/assign-faculty/assign-faculty.routing'
  //                   )
  //                 ).ROUTES,
  //             },
  //             {
  //               path: 'assign-teacher',
  //               canActivate: [permissionGuard],
  //               loadChildren: async () =>
  //                 (
  //                   await import(
  //                     './invigilator/assign-teacher/assign-teacher.routing'
  //                   )
  //                 ).ROUTES,
  //             },
  //             {
  //               path: 'assign-room',
  //               canActivate: [permissionGuard],
  //               data: {
  //                 roles: [Role.EXAMINATION_DEPARTMENT_HEAD],
  //               },
  //               loadChildren: async () =>
  //                 (
  //                   await import(
  //                     './invigilator/assign-room/assign-room.routing'
  //                   )
  //                 ).ROUTES,
  //             },
  //           ],
  //         },
  //         {
  //           path: 'paid',
  //           children: [
  //             {
  //               path: 'invigilator',
  //               loadChildren: async () =>
  //                 (await import('./paid/invigilator/invigilator.routing'))
  //                   .ROUTES,
  //             },
  //             {
  //               path: 'invigilator-department',
  //               loadChildren: async () =>
  //                 (
  //                   await import(
  //                     './paid/invigilator-department/invigilator-department.routing'
  //                   )
  //                 ).ROUTES,
  //             },
  //             {
  //               path: 'exam-department',
  //               loadChildren: async () =>
  //                 (
  //                   await import(
  //                     './paid/exam-department/exam-department.routing'
  //                   )
  //                 ).ROUTES,
  //             },
  //           ],
  //         },
  //         {
  //           path: 'process',
  //           loadChildren: async () =>
  //             (await import('./examination/process/process.routing')).ROUTES,
  //         },
  //         {
  //           path: 'report',
  //           loadChildren: async () =>
  //             (await import('./examination/report/report.routing')).ROUTES,
  //         },
  //         {
  //           path: 'document',
  //           loadChildren: async () =>
  //             (await import('./examination/document/document.routing')).ROUTES,
  //         },
  //         {
  //           path: 'edit',
  //           canActivate: [permissionGuard],
  //           data: {
  //             roles: [Role.EXAMINATION_DEPARTMENT_HEAD],
  //           },
  //           loadChildren: async () =>
  //             (await import('./examination/edit/edit.routing')).ROUTES,
  //         },
  //       ],
  //     },
  // },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(
      useLayoutRoutes({
        children: routes,
        canActivate: [authGuard],
        loginRoute: {
          path: 'login',
          canActivate: [authGuard],
          loadChildren: async () => (await import('@auth')).ROUTES,
        },
      }),
    ),
    ...NGRX,
    ...extModules,
  ],
  exports: [RouterModule],
  providers: [
    TAIGA_PROVIDERS,
    authServiceProviders({
      authService: EsmAuthService,
      storage: 'localStorage',
      guard: {
        role: (store) =>
          store.pipe(EsmSelector.notNullUser).pipe(
            tap((x) => console.log(store, x)),
            map((u) => u?.roles ?? []),
          ),
        store: Store<EsmState>,
      },
    }),
    layoutProviders({
      store: Store<EsmState>,
      sideBar: {
        items: esmSideBarItems,
      },
      topBar: {
        items: EsmTopBarConstants.items,
        menuText: {
          factory: (store) =>
            combineLatest([
              store.pipe(EsmSelector.userTitle()),
              store.pipe(EsmSelector.userName),
            ]).pipe(
              map(([title, name]) =>
                `Xin chào ${title ?? ''} ${name ?? ''}`.trim(),
              ),
            ),
        },
      },
    }),
    {
      provide: RECAPTCHA_SETTINGS,
      useFactory: (): { siteKey: string } => inject(ESM_CONFIG).recaptcha,
    },
  ],
})
export class EsmShellFeatureModule {}
