import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, TitleStrategy } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { SeoTitleStrategy } from './seo-title-strategy';
import { SeoService } from './seo.service';

@Component({ template: '' })
class Page {}

describe('SeoTitleStrategy', () => {
  it('applies the seo data of the deepest route with the navigated URL', async () => {
    const apply = vi.fn();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          {
            path: 'blog',
            children: [
              {
                path: ':slug',
                component: Page,
                data: { seo: { title: 'Post', description: 'D' } },
              },
            ],
          },
          { path: 'plain', component: Page },
        ]),
        { provide: TitleStrategy, useClass: SeoTitleStrategy },
        { provide: SeoService, useValue: { apply } },
      ],
    });
    const harness = await RouterTestingHarness.create();

    await harness.navigateByUrl('/blog/hello');
    expect(apply).toHaveBeenCalledWith('/blog/hello', { title: 'Post', description: 'D' });

    apply.mockClear();
    await harness.navigateByUrl('/plain');
    expect(apply).not.toHaveBeenCalled();
  });
});
