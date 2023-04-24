import { UserProfile } from "@clerk/nextjs";
import AppLayout from "~/pages/app/AppLayout";

export default function UserProfilePage() {
  // Finally, mount the UserProfile component under "/profile" 🎉
  // Don't forget to set the "routing" and "path" props
  return (
    <AppLayout>
      <div className={"w-full h-full flex justify-center items-center p-5"}>
        <UserProfile routing="path" path="/app/profile" />
      </div>
    </AppLayout>


  );
}