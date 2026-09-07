import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import SeoHead from '@/components/blog/SeoHead';
import BlogHeroBand from '@/components/blog/BlogHeroBand';
import BackToTop from '@/components/blog/BackToTop';
import { BLOG_CATEGORIES, getAllPosts, getPostsByCategory } from '@/lib/blog';
import { canonicalBlogIndexUrl } from '@/lib/blog-seo';

export default function Blog() {
  const [params, setParams] = useSearchParams();
  const category = params.get('category') || '';
  const posts = useMemo(
    () => (category ? getPostsByCategory(category) : getAllPosts()),
    [category],
  );

  const setCategory = (next) => {
    const nextParams = new URLSearchParams(params);
    if (!next) nextParams.delete('category');
    else nextParams.set('category', next);
    setParams(nextParams, { replace: true });
  };

  return (
    <>
      <SeoHead
        title="Business crypto settlements blog · Cryptobus"
        description="English guides on paying invoices with crypto, corporate treasury, cross-border settlement, compliance, and ops playbooks."
        canonical={canonicalBlogIndexUrl()}
        type="website"
      />
      <BlogHeroBand kicker="Cryp2bus Editorial" title="Business crypto settlements" />
      <section className="relative py-12 lg:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Practical English guides for companies that pay invoices, manage treasury, and
            settle cross-border in crypto — without investment hype.
          </p>

          <div className="mt-10 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setCategory('')}
              className={`px-3.5 py-2 text-sm border transition-colors ${
                !category
                  ? 'border-electric text-electric bg-electric/10'
                  : 'border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              All
            </button>
            {BLOG_CATEGORIES.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={`px-3.5 py-2 text-sm border transition-colors ${
                  category === item
                    ? 'border-electric text-electric bg-electric/10'
                    : 'border-border text-muted-foreground hover:text-foreground'
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          {posts.length === 0 ? (
            <p className="mt-16 text-muted-foreground">No articles in this category yet.</p>
          ) : (
            <ul className="mt-12 space-y-6">
              {posts.map((post) => (
                <li key={post.slug}>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="flex flex-col md:flex-row overflow-hidden border border-border hover:border-electric/40 transition-colors bg-secondary/20"
                  >
                    <div className="relative w-full md:w-72 h-44 md:self-stretch md:min-h-[11rem] shrink-0 overflow-hidden bg-graphite">
                      {post.coverImage ? (
                        <img
                          src={post.coverImage}
                          alt=""
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                      ) : null}
                    </div>
                    <div className="p-6 flex flex-col justify-center">
                      <p className="text-[11px] uppercase tracking-wider text-electric mb-2">
                        {post.category}
                      </p>
                      <h2 className="font-display text-xl sm:text-2xl font-semibold text-foreground mb-3">
                        {post.title}
                      </h2>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {post.description}
                      </p>
                      <p className="mt-4 text-xs text-muted-foreground">
                        {post.datePublished}
                        {post.readTime ? ` · ${post.readTime}` : ''}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
      <BackToTop />
    </>
  );
}
