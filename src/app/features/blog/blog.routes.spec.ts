import { Location } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  provideRouter,
  Router,
  withComponentInputBinding,
} from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { postSummary, provideBlogContent } from '../../core/blog/testing';
import { NotFoundPage } from '../not-found/not-found-page';
import BLOG_ROUTES from './blog.routes';

describe('blog routes', () => {
  const post = postSummary('hello', { title: 'Hello', locales: ['en', 'fr'] });

  async function navigate(url: string) {
    TestBed.configureTestingModule({
      providers: [
        provideRouter(
          [
            { path: 'blog', children: BLOG_ROUTES },
            { path: '404', component: NotFoundPage },
          ],
          withComponentInputBinding(),
        ),
        provideBlogContent({ en: [post] }, { en: { hello: { html: '<p>Hi!</p>', toc: [] } } }),
      ],
    });
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl(url);
    return harness.routeNativeElement as HTMLElement;
  }

  const leaf = () => {
    let route: ActivatedRouteSnapshot = TestBed.inject(Router).routerState.snapshot.root;
    while (route.firstChild) route = route.firstChild;
    return route;
  };

  it('renders a post with its content and metadata, in its languages only', async () => {
    const root = await navigate('/blog/hello');

    expect(root.querySelector('h1')?.textContent).toBe('Hello');
    expect(root.querySelector('app-post-body')?.innerHTML).toBe('<p>Hi!</p>');
    expect(leaf().data['seo']).toEqual({
      title: 'Hello · Bruno Gutierre',
      description: 'About hello.',
      locales: ['en', 'fr'],
    });
  });

  it('shows the 404 page at the URL of a post the language does not have', async () => {
    const root = await navigate('/blog/missing');

    expect(root.querySelector('h1')?.textContent).toBe('Page not found');
    expect(TestBed.inject(Location).path()).toBe('/blog/missing');
  });

  it('declares the metadata of the blog index', async () => {
    await navigate('/blog');

    expect(leaf().data['seo'].title).toBe('Blog · Bruno Gutierre');
  });
});
