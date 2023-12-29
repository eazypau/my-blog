// component
import Post from "@/components/Post";
// fonts
import { Inter } from "next/font/google";
// lib
import { Blog, getAllPublished } from "@/lib/notion";

export const getStaticProps = async () => {
  const data = await getAllPublished();

  return {
    props: {
      posts: data ? data : [],
    },
  };
};

const inter = Inter({ subsets: ["latin"] });

export default function Home({ posts }: { posts: Blog[] }) {
  return (
    <main className={`blog-page-container ${inter.className}`}>
      <h1 className="home-title">Blog Overview</h1>
      <p className="mb-7">
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quae tenetur
        suscipit officiis nesciunt odit. Alias eaque tenetur ut repellendus
        repudiandae soluta, distinctio maxime pariatur atque sapiente libero.
        Omnis, consequuntur aut?
      </p>
      {posts && posts.length === 0 ? (
        "There is no blog post."
      ) : (
        <Post posts={posts} />
      )}
    </main>
  );
}
