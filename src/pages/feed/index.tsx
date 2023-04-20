import { type NextPage } from "next";
import { api } from "~/utils/api";
import { useUser } from "@clerk/nextjs";


const createPostWizard = () => {
  const { user } = useUser();
  const Posts = api.posts.getAll.useQuery();
  console.log(Posts);

};

const Feed: NextPage = () => {

  const user = useUser();

  const { data } = api.posts.getAll.useQuery();


  return (
    <div>
      {JSON.stringify(data)}
    </div>
  );
};

export default Feed;
