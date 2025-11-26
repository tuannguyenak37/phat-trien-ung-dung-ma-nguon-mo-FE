"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import UserAPI from "../../lib/API/user";
import Image from "next/image";
import avatar from "../../../public/avatar-mac-dinh.jpg";
import Link from "next/link";

import {UserTheadResponse} from "@/types/home";
interface UserTheadProps {
  id: string;
}

export default function UserThead({ id }: UserTheadProps) {
  const API = useQuery({
    queryKey: ["user-profile", id],
    queryFn: () => UserAPI.APIpublic_proflle(id),
    enabled: !!id,
  });

  const user = API.data?.data as UserTheadResponse | undefined;
  console.log("UserThead data:", user);

  return (
    <div className="mb-3 flex items-center gap-3 text-xs text-gray-500">
      {API.isLoading ? (
        // Skeleton avatar + text
        <>
          <div className="w-6 h-6 rounded-full bg-gray-700 animate-pulse" />
          <div className="flex flex-col gap-1">
            <div className="h-2 w-20 bg-gray-700 rounded animate-pulse" />
            <div className="h-2 w-12 bg-gray-700 rounded animate-pulse" />
          </div>
        </>
      ) : (
        <>
          <div className="w-8 h-8 relative rounded-full overflow-hidden">
            <Link href={`/profile/${user?.user_id}`}>
             <Image
              src={user?.url_avatar || avatar}
              alt="avatar"
              fill
              className="object-cover"
            />
            </Link>
           
          </div>
          <span className="font-bold text-red-500 uppercase tracking-wider">
            {user?.firstName || "UNKNOWN"} {user?.lastName || ""}
          </span>
        </>
      )}
    </div>
  );
}
