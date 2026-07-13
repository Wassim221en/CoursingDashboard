// @ts-nocheck
// this file is not used now
// will be used in the future (I guess?)

import env from 'constants/env';
import { MainPaths } from 'constants/values';
import { LoaderFunction, redirect } from 'react-router-dom';
import { useUserStore, useWebsiteStore } from 'zustand/stores';

// where to look for pages
const pagesFolder = '../../pages';
// extention of files to be treated as pages
const pageExtention = '.page.tsx';

// constructed import pattren
// can't actually be used as an Import path
// const pagesImportPathRgx = RegExp(`${pagesFolder}/**/*${pageExtention}`);
// const globImportPath = '../../pages/**/*.page.tsx';

// const pages = import.meta.glob(globImportPath);
const pages = import.meta.glob('../../pages/**/[!-]*.page.tsx');

const isDynamicPagePathRgx = /^.*[[\w\d]+]+.*$/;
const indexPagesRgx = /\/index$/;

// remove pagesFolder path and pagesExtention
// example: ../pages/dashboard/CustomPage.page.tsx => /dashboard/CustomPage
const removeFileSystemExtras = (path: string) =>
  path.slice(
    path.indexOf(pagesFolder) + pagesFolder.length,
    path.indexOf(pageExtention),
  );

const calcPagePath = (importPath: string) => {
  let pagePath = removeFileSystemExtras(importPath);

  // contains any [params] in the import path
  if (isDynamicPagePathRgx.test(pagePath)) {
    const paramName = '[\\w\\d]';
    const sectionWithParmaRgx = RegExp(
      `${paramName}*\\[${paramName}+\\]${paramName}*`,
    );

    const pathArr = pagePath.split('/');
    const newPathArr = pathArr.map((path) => {
      if (sectionWithParmaRgx.test(path)) {
        const trimStart = path.indexOf('[');
        const trimEnd = path.indexOf(']');

        const before = path.slice(0, trimStart);
        const param = path.slice(trimStart + 1, trimEnd);
        const after = path.slice(trimEnd + 1);

        return `${before}:${param}${after}`;
      }
      return path;
    });
    const newRoute = newPathArr.join('/');

    pagePath = newRoute;
  }

  // /dashboard/section/index => /dashboard/section
  if (indexPagesRgx.test(pagePath)) {
    return pagePath.slice(0, pagePath.indexOf('/index'));
  }

  return pagePath;
};

// eslint-disable-next-line consistent-return
const smartRedirect = (path: string, currentPath: string) => {
  if (path !== currentPath) return redirect(path);
};

const checkForRedirect = (currentPathname: string, isLoggedIn?: boolean) => {
  if (
    isLoggedIn &&
    currentPathname.toLowerCase() === MainPaths.LOGIN_PAGE.toLowerCase()
  )
    return smartRedirect(MainPaths.HOME_PAGE, currentPathname);
  if (
    !isLoggedIn &&
    // prevents recursive redirection
    currentPathname.toLowerCase() !== MainPaths.LOGIN_PAGE.toLowerCase()
  )
    return smartRedirect(MainPaths.LOGIN_PAGE, currentPathname);
  if (
    [
      MainPaths.ROOT_PATH,
      MainPaths.DASH_ROOT_PATH,
      MainPaths.DASH_ROOT_PATH2,
    ].some((link) => currentPathname.toLowerCase() === link.toLowerCase())
  )
    return smartRedirect(
      isLoggedIn ? MainPaths.HOME_PAGE : MainPaths.LOGIN_PAGE,
      currentPathname,
    );
  return undefined;
};

const defaultLoader =
  (pagePath: string, pageImport: () => Promise<unknown>): LoaderFunction =>
  (args) => {
    const { isLoggedIn, getPermission } = useUserStore.getState();
    const { setPreload, setCurrentPagePermission } = useWebsiteStore.getState();
    const currentPath = new URL(args.request.url).pathname;

    const shouldRedirect = checkForRedirect(currentPath, isLoggedIn);
    if (shouldRedirect) return shouldRedirect;

    setPreload(true);
    return pageImport()
      .then((result) => {
        const moduleFile = result as any;
        if (moduleFile) {
          if (
            'permissionNames' in moduleFile &&
            Array.isArray(moduleFile.permissionNames)
          ) {
            const currentPagePermitions = getPermission(
              moduleFile.permissionNames,
            );
            setCurrentPagePermission(currentPagePermitions);
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            env.isDevEnv &&
              console.log(pagePath, {
                currentPagePermitions,
                permissionNames: moduleFile.permissionNames,
              });
          } else
            setCurrentPagePermission({
              canAdd: true,
              canDelete: true,
              canEdit: true,
              canView: true,
              permissionName: [],
            });
          if ('loader' in moduleFile && typeof moduleFile.loader === 'function')
            return moduleFile.loader?.(args) ?? null;
        }
        return null;
      })
      .finally(() => setPreload(false));
  };

export { pages, calcPagePath, defaultLoader };
