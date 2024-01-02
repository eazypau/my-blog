import Link from "next/link";
// components
import renderBlock from "@/components/renderer";
import { HomeIcon } from "@/components/icons/Home";
// lib
import {
  Blog,
  getAllPublished,
  getPageBlocks,
  getBlogPageBySlug,
} from "@/lib/notion";
import { BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";
// utils
import { formatDate } from "@/utils/dateFormatter";
import Head from "next/head";

export const getStaticPaths = async () => {
  const database = await getAllPublished();
  const paths = database.map((post) => {
    return {
      params: {
        id: post.id,
        slug: post.slug,
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
  const page = (await getBlogPageBySlug(slug)) as Blog;
  const blocks = await getPageBlocks(
    Object.keys(page).length > 0 && page.hasOwnProperty("id") ? page.id : ""
  );

  return {
    props: {
      page,
      blocks,
    },
  };
};

export default function Slug({
  page,
  blocks,
}: {
  page: Blog;
  blocks: BlockObjectResponse[];
}) {
  if (page && blocks) {
    return (
      <div className="blog-wrapper">
        <Head>
          <title>{page.title}</title>
          <meta name="description" content={page.description} />
          <meta
            name="og:site"
            content={`https://my-blog-eazypau.vercel.app/blog/${page.slug}`}
          />
          <meta name="og:site_name" content={`#${page.title} | Eazypau`} />
          <meta name="og:title" content={`#${page.title} | Eazypau`} />
          <meta name="og:description" content={page.description} />
        </Head>
        <nav>
          <Link
            href="/"
            className="p-2 bg-gradient-to-br from-white to-slate-100 rounded-md shadow"
          >
            <HomeIcon width="28" height="28" />
          </Link>
        </nav>
        <article className="blog-details">
          <h1 className="blog-heading-1">{page.title}</h1>
          <p className="description">{page.description}</p>
          <p className="author-date-container">
            <span>by Po Yi Zhi</span> |{" "}
            <span>Posted on {formatDate(page.date)}</span>
          </p>
        </article>
        <article className="block-content">
          {blocks.map((block) => renderBlock({ block }))}
        </article>
      </div>
    );
  }

  return <div>Oops, it seems this blog post does not exist!</div>;
}
