import { Link } from 'react-router-dom';

export default function BlogReadMore({ posts }) {
  if (!posts?.length) return null;

  return (
    <section className="mt-16 pt-12 border-t border-border">
      <h2 className="font-display text-2xl font-semibold text-foreground mb-8">Read more</h2>
      <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              to={`/blog/${post.slug}`}
              className="block h-full overflow-hidden border border-border hover:border-electric/50 transition-colors bg-secondary/30"
            >
              {post.coverImage ? (
                <img src={post.coverImage} alt="" className="w-full h-36 object-cover" />
              ) : (
                <div className="w-full h-36 bg-graphite" />
              )}
              <div className="p-4">
                <p className="text-[11px] uppercase tracking-wider text-electric mb-2">
                  {post.category}
                </p>
                <h3 className="font-display text-base font-semibold text-foreground leading-snug mb-2">
                  {post.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                  {post.description}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
