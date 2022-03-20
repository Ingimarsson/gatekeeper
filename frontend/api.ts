import axios from "axios";
import { GetServerSidePropsContext, PreviewData } from "next";
import { getSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";

const baseURL = process.env.API_URL || "/api";

const ApiClient = (context: GetServerSidePropsContext | null = null) => {
  const defaultOptions = {
    baseURL,
    validateStatus: () => true,
  };

  const instance = axios.create(defaultOptions);

  instance.interceptors.request.use(async (request) => {
    const session = !!context ? await getSession(context) : await getSession();
    if (session && request.headers) {
      request.headers.Authorization = `Bearer ${session.token}`;
    }
    return request;
  });

  instance.interceptors.response.use(
    (response) => {
      if (response.status == 401) {
        if (typeof window !== "undefined") {
          const router = useRouter();
          signOut({ redirect: false }).then(() => router.push("/"));
        } else {
          context?.res.writeHead(302, { Location: "/?signout=true" }).end();
        }
      }
      return response;
    },
    (error) => {
      console.log(`error`, error);
    }
  );

  return instance;
};

export default ApiClient;
