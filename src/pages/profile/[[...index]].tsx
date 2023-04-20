import { UserProfile } from "@clerk/nextjs";

export default function UserProfilePage() {
  // Finally, mount the UserProfile component under "/profile" 🎉
  // Don't forget to set the "routing" and "path" props
  return (
    <div className={"w-full h-full flex justify-center items-center p-5"}>
      <UserProfile routing="path" path="/profile" />
    </div>

  );
}