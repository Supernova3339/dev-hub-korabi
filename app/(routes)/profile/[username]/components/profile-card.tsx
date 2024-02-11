import { Avatar, AvatarFallback, AvatarImage } from "~/avatar";
import { Card, CardContent, CardHeader } from "~/card";
import { Separator } from "~/separator";
import prismadb from "@/lib/prismadb";
import { PostCard } from "@/components/post-card";
import Link from "next/link";
import { Button } from "~/button";
import { Edit } from "lucide-react";
import { CgProfile } from "react-icons/cg";
import { User } from "@prisma/client";
import { FaUser } from "react-icons/fa";
import { currentUser } from "@/lib/auth";

interface ProfileCardProps {
  profileId: string;
  user: User;
}

const ProfileCard: React.FC<ProfileCardProps> = async ({ profileId, user }) => {
  const logedInUser = await currentUser();
  const latestPostsByUser = await prismadb.post.findMany({
    where: {
      userId: profileId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="flex py-20 items-center justify-center">
      <Card className="lg:w-[800px] md:w-[500px] w-full select-none">
        <CardHeader>
          <div className="font-bold tracking-tight">
            <div className="flex w-full justify-between">
              <Avatar className="lg:h-40 lg:w-40 h-20 w-20">
                <AvatarImage
                  src={user?.image!}
                  alt={`${user?.username}'s profile image`}
                />
                <AvatarFallback className="bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400 text-white">
                  <FaUser className="lg:w-20 lg:h-20 h-10 w-10" />
                </AvatarFallback>
              </Avatar>
              <div className="md:block hidden">
                <div>
                  {user?.name && (
                    <p className="scroll-m-20 text-4xl font-extrabold tracking-tight text-end lg:text-5xl">
                      {user?.name}
                    </p>
                  )}
                  <div className="flex justify-end">
                    {user?.username && (
                      <p className="scroll-m-20 text-2xl font-medium text-start text-zinc-400 tracking-tight">
                        @{user?.username}
                      </p>
                    )}
                  </div>
                </div>
                {logedInUser?.id === user.id ? (
                  <div className="grid grid-cols-2 gap-2">
                    <Link href="/profile/edit">
                      <Button variant={"outline"} className="mt-4 w-full">
                        <Edit size={15} />{" "}
                        <span className="ml-2">Edit Profile</span>
                      </Button>
                    </Link>
                    <Link href="/profile/edit/picture">
                      <Button variant={"outline"} className="mt-4 w-full">
                        <CgProfile size={15} />{" "}
                        <span className="ml-2">Change Picture</span>
                      </Button>
                    </Link>
                  </div>
                ) : null}
              </div>
            </div>
            <div className="md:hidden block">
              <div className="mt-4">
                {user?.name && (
                  <p className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                    {user?.name}
                  </p>
                )}
                {user?.username && (
                  <p className="scroll-m-20 text-lg font-medium text-zinc-400 tracking-tight">
                    @{user?.username}
                  </p>
                )}
                {logedInUser?.id === user.id ? (
                  <div className="grid grid-cols-2 gap-2 md:hidden">
                    <Link href="/profile/edit">
                      <Button variant={"outline"} className="mt-4 w-full">
                        <Edit size={15} />{" "}
                        <span className="ml-2">Edit Profile</span>
                      </Button>
                    </Link>
                    <Link href="/profile/edit/picture">
                      <Button variant={"outline"} className="mt-4 w-full">
                        <CgProfile size={15} />{" "}
                        <span className="ml-2">Change Picture</span>
                      </Button>
                    </Link>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
          <div>
            <p className="mt-8 scroll-m-20 text-muted-foreground md:text-lg text-sm tracking-tight text-black">
              {user?.bio}
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <p className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
            Posts
          </p>
          <Separator className="mt-2 mb-6" />
          <div>
            {latestPostsByUser.length === 0 && (
              <p className="text-lg text-zinc-400">No posts.</p>
            )}
          </div>
          <div className="grid lg:grid-cols-2 md:grid-cols-1 place-items-center justify-center">
            {latestPostsByUser.map((post) => (
              <PostCard
                className="mb-4"
                key={post.id}
                data={post}
                username={user?.username as string}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileCard;
