import { AnimatePresence } from "framer-motion";
import { getSession, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { modalState, modalTypeState } from "../atoms/modalAtom";
import Feed from "../components/Feed";
import Header from "../components/Header";
import Modal from "../components/Modal";
import Sidebar from "../components/Sidebar";
import { useRecoilState } from "recoil";
import { connectToDatabase } from "../util/mongodb";
import Widgets from "../components/Widgets";
import axios from "axios";

export default function Home({ posts, articles }) {
  // console.log(posts);
  // console.log(articles);
  const [modalOpen, setModalOpen] = useRecoilState(modalState);
  const [modalType, setModalType] = useRecoilState(modalTypeState);
  const router = useRouter();
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/home");
    },
  });

  return (
    <div className="bg-[#f3f2ef] dark:bg-black dark:text-white h-screen overflow-y-scroll md:space-y-6">
      <Head>
        <title>Feed | LinkedIn</title>
        <link rel="icon" path="/favicon.ico" />
      </Head>

      <Header />

      <main className="flex justify-center gap-x-5 px-4 sm:px-12">
        <div className=" flex flex-col md:flex-row gap-5">
          <Sidebar />
          <Feed posts={posts} />
        </div>

        <AnimatePresence>
          {modalOpen && (
            <Modal handleClose={() => setModalOpen(false)} type={modalType} />
          )}
        </AnimatePresence>

        {/* Widgets */}
        <Widgets articles={articles} />
      </main>

      {/* <button onClick={signOut}>Sign Out</button> */}
    </div>
  );
}

export async function getServerSideProps(context) {
  // check if the user is authenticated on the server

  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: "/home",
      },
    };
  }

  // Get posts on SSR
  const { db } = await connectToDatabase();

  let posts = await db
    .collection("posts")
    .find()
    .sort({ timestamp: -1 })
    .toArray();

  // Google NEWS API
  const { data } = await axios.get(
    `https://newsapi.org/v2/top-headlines?country=in&apiKey=${process.env.NEWS_API_KEY}`
  );

  return {
    props: {
      session,
      articles: data.articles,
      posts: posts.map((post) => ({
        ...post,
        _id: post._id.toString(),
        timestamp: post.timestamp.toString(),
      })),
    },
  };
}
