import Link from "next/link";
import { useRouter } from "next/router";
// components
import Post from "@/components/Post";
import { HomeIcon } from "@/components/icons/Home";
// lib
import { Blog, getAllPublished, getBlogsByTag } from "@/lib/notion";
// utils
import { TAG_LIST } from "@/utils/const";

export const getStaticPaths = async () => {
  const paths = TAG_LIST.map((item) => {
    return {
      params: {
        slug: item,
      },
    };
  });

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps = async ({
  params,
}: {
  params: { slug: string };
}) => {
  const { slug } = params;
  const posts = await getBlogsByTag(slug);

  return {
    props: {
      posts,
    },
  };
};

export default function Tag({ posts }: { posts: Blog[] }) {
  const router = useRouter();
  const slug = router.query.slug as string;

  return (
    <main className="blog-page-container">
      <nav>
        <Link
          href="/"
          className="p-2 bg-gradient-to-br from-white to-slate-100 rounded-md shadow"
        >
          <HomeIcon width="28" height="28" />
        </Link>
      </nav>
      <h1 className="home-title">#{slug}</h1>
      <p className="mb-7">It is what it is all about</p>
      {posts && posts.length === 0 ? (
        "There is no blog post related to the selected tag."
      ) : (
        <Post posts={posts} />
      )}
    </main>
  );
}
