import { type APIRequestContext } from '@playwright/test';
import { type ArticleData } from '../test-data/article';

export class ArticlesApi {
  constructor(private request: APIRequestContext, private token?: string) {}

  private get headers(): Record<string, string> {
    return this.token ? { Authorization: `Token ${this.token}` } : {};
  }

  create(article: ArticleData) {
    return this.request.post('/api/articles', { headers: this.headers, data: { article } });
  }

  get(slug: string) {
    return this.request.get(`/api/articles/${slug}`, { headers: this.headers });
  }

  update(slug: string, article: Partial<ArticleData>) {
    return this.request.put(`/api/articles/${slug}`, { headers: this.headers, data: { article } });
  }

  delete(slug: string) {
    return this.request.delete(`/api/articles/${slug}`, { headers: this.headers });
  }
}
