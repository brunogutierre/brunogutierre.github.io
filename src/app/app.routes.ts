import { Routes } from '@angular/router';
import { PageSeo, pageTitle } from './core/seo/seo.service';
import { HomePage } from './features/home/home-page';
import { NotFoundPage } from './features/not-found/not-found-page';

const notFound: PageSeo = {
  title: pageTitle($localize`:@@seo.notFound.title:Page not found`),
  description: $localize`:@@seo.notFound.description:This page does not exist on Bruno Gutierre's site.`,
  noindex: true,
};

export const routes: Routes = [
  {
    path: '',
    component: HomePage,
    data: {
      seo: {
        title: $localize`:@@seo.home.title:Bruno Gutierre · Senior software engineer`,
        description: $localize`:@@seo.home.description:Bruno Gutierre is a senior software engineer in Montreal who works with Angular, TypeScript, Java and Spring Boot. Projects, experience and blog.`,
      } satisfies PageSeo,
    },
  },
  {
    path: 'projects',
    loadComponent: () => import('./features/projects/projects-page').then((m) => m.ProjectsPage),
    data: {
      seo: {
        title: pageTitle($localize`:@@nav.projects:Projects`),
        description: $localize`:@@seo.projects.description:Study and portfolio projects by Bruno Gutierre: Angular apps and libraries, Spring Boot APIs and Android apps.`,
      } satisfies PageSeo,
    },
  },
  {
    path: 'experience',
    loadComponent: () =>
      import('./features/experience/experience-page').then((m) => m.ExperiencePage),
    data: {
      seo: {
        title: pageTitle($localize`:@@nav.experience:Experience`),
        description: $localize`:@@seo.experience.description:Professional experience and skills of Bruno Gutierre, with a printable CV.`,
      } satisfies PageSeo,
    },
  },
  // The blog index and its posts: the post list is loaded only with them.
  { path: 'blog', loadChildren: () => import('./features/blog/blog.routes') },
  // A concrete path, so it is prerendered; it becomes the site-wide 404.html on deployment.
  { path: '404', component: NotFoundPage, data: { seo: notFound } },
  { path: '**', component: NotFoundPage, data: { seo: notFound } },
];
