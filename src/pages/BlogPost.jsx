import { Link, useParams } from 'react-router-dom';
import { marked } from 'marked';
import { Button } from '@/components/ui/button';
import SeoHead from '@/components/blog/SeoHead';
import BlogHeroBand from '@/components/blog/BlogHeroBand';
import ArticleConsultBanner from '@/components/blog/ArticleConsultBanner';
import BlogReadMore from '@/components/blog/BlogReadMore';
import BackToTop from '@/components/blog/BackToTop';
import PageNotFound from '@/lib/PageNotFound';
import { useLeadModal } from '@/components/LeadModal';
import {
  getAllPosts,
  getPostBySlug,
  getRelatedPosts,
  splitBodyForBanner,
} from '@/lib/blog';
import { buildArticleJsonLd, canonicalBlogUrl } from '@/lib/blog-seo';

marked.setOptions({ gfm: true, breaks: false });

function ArticleBody({ markdown }) {
  if (!markdown) return null;
  const html = marked.parse(markdown);
  return (
    <div
      className="blog-prose max-w-[70ch] leading-relaxed text-foreground/90
        [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:mt-12 [&_h2]:mb-4
        [&_h3]:font-display [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-foreground [&_h3]:mt-8 [&_h3]:mb-3
        [&_p]:mb-5 [&_p]:text-base [&_p]:leading-relaxed
        [&_ul]:mb-5 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2
        [&_ol]:mb-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-2
        [&_a]:text-electric [&_a]:underline [&_a]:underline-offset-2
        [&_img]:my-8 [&_img]:w-full [&_img]:border [&_img]:border-border [&_img]:aspect-[16/9] [&_img]:object-cover
        [&_table]:w-full [&_table]:text-sm [&_table]:border-collapse [&_table]:my-8
        [&_th]:border [&_th]:border-border [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:bg-secondary/40
        [&_td]:border [&_td]:border-border [&_td]:px-3 [&_td]:py-2
        [&_pre]:overflow-x-auto [&_pre]:my-6 [&_code]:text-sm"
      // Prerender + CMS content is author-controlled MDX from this repo.
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export default function BlogPost() {
  const { slug } = useParams();
  const { openLeadModal } = useLeadModal();
  const post = getPostBySlug(slug);

  if (!post) return <PageNotFound />;

  const canonical = canonicalBlogUrl(post.slug);
  const jsonLd = buildArticleJsonLd(post);
  const related = getRelatedPosts(getAllPosts(), post.slug, 3);
  const { before, after } = splitBodyForBanner(post.body);

  return (
    <>
      <SeoHead
        title={`${post.title} · Cryptobus`}
        description={post.description}
        canonical={canonical}
        image={post.coverImage}
        jsonLd={jsonLd}
      />
      <BlogHeroBand kicker={post.category} title={post.title} />
      <article className="relative overflow-x-hidden py-12 lg:py-16">
        <div className="mx-auto max-w-[760px] px-4 sm:px-6 lg:px-8">
          <Link
            to="/blog"
            className="text-sm text-electric hover:text-electric/80 underline-offset-2 hover:underline inline-block mb-8"
          >
            ← All articles
          </Link>
          <p className="text-sm text-muted-foreground mb-10">
            {post.author.name}
            {post.datePublished ? ` · ${post.datePublished}` : ''}
            {post.readTime ? ` · ${post.readTime}` : ''}
          </p>
          {post.coverImage ? (
            <img
              src={post.coverImage}
              alt=""
              className="w-full h-56 sm:h-72 lg:h-[22rem] object-cover mb-12 border border-border"
            />
          ) : null}

          <ArticleBody markdown={before} />
          <ArticleConsultBanner />
          <ArticleBody markdown={after} />

          {post.faq.length > 0 ? (
            <section className="mt-16 max-w-[70ch]">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-6">FAQ</h2>
              <dl className="space-y-6">
                {post.faq.map((item) => (
                  <div key={item.question}>
                    <dt className="text-foreground font-medium mb-2">{item.question}</dt>
                    <dd className="text-muted-foreground text-sm leading-relaxed">{item.answer}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ) : null}

          <section
            id="blog-lead-form"
            className="mt-16 pt-12 border-t border-border scroll-mt-24 max-w-[70ch]"
          >
            <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
              Ready to settle business payments in crypto?
            </h2>
            <p className="text-muted-foreground mb-8">
              Tell us about your invoices, corridors, and treasury needs. We will follow up on
              opening a Cryptobus business account.
            </p>
            <Button
              className="bg-electric hover:bg-electric/90 text-graphite font-semibold"
              onClick={() =>
                openLeadModal({
                  source: `blog-${post.slug}`,
                  title: 'Open Business Account',
                })
              }
            >
              Open Business Account
            </Button>
          </section>

          <BlogReadMore posts={related} />
        </div>
      </article>
      <BackToTop />
    </>
  );
}
