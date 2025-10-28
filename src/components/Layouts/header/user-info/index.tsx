"use client";

import { ChevronUpIcon } from "@/assets/icons";
import {
  Dropdown,
  DropdownContent,
  DropdownTrigger,
} from "@/components/ui/dropdown";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { LogOutIcon, SettingsIcon, UserIcon } from "./icons";

export function UserInfo() {
  const [isOpen, setIsOpen] = useState(false);

  const USER = {
    name: "Admin",
    email: "Mikdadmk95@gmail.com",
    img: "/images/user/user-03.png",
  };

  return (
    <Dropdown isOpen={isOpen} setIsOpen={setIsOpen}>
      <DropdownTrigger className="rounded align-middle outline-none ring-blue-500 ring-offset-2 focus-visible:ring-1 dark:ring-offset-gray-800">
        <span className="sr-only">My Account</span>

        <figure className="flex items-center gap-3">
          <Image
            src={USER.img}
            className="w-10 h-10 rounded-full"
            alt={`Avatar of ${USER.name}`}
            role="presentation"
            width={40}
            height={40}
          />
          <figcaption className="flex items-center gap-1 font-medium text-gray-900 dark:text-gray-300 max-[1024px]:sr-only">
            <span>{USER.name}</span>

            <ChevronUpIcon
              aria-hidden
              className={cn(
                "rotate-180 transition-transform w-4 h-4",
                isOpen && "rotate-0",
              )}
              strokeWidth={1.5}
            />
          </figcaption>
        </figure>
      </DropdownTrigger>

      <DropdownContent
        className="border border-gray-200 bg-white shadow-lg dark:border-gray-600 dark:bg-gray-800 w-72 rounded-lg"
        align="end"
      >
        <h2 className="sr-only">User information</h2>

        <figure className="flex items-center gap-2.5 px-5 py-3.5">
          <Image
            src={USER.img}
            className="w-12 h-12 rounded-full"
            alt={`Avatar for ${USER.name}`}
            role="presentation"
            width={48}
            height={48}
          />

          <figcaption className="space-y-1 text-base font-medium flex-1 min-w-0">
            <div className="mb-2 leading-none text-gray-900 dark:text-white">
              {USER.name}
            </div>

            <div className="leading-none text-xs text-gray-600 dark:text-gray-400 truncate">{USER.email}</div>
          </figcaption>
        </figure>

        <hr className="border-gray-200 dark:border-gray-600" />

        <div className="p-2 text-base text-gray-700 dark:text-gray-300 [&>*]:cursor-pointer">
          <Link
            href={"/admin/profile"}
            onClick={() => setIsOpen(false)}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-white transition-colors duration-200"
          >
            <UserIcon />

            <span className="mr-auto text-base font-medium">View profile</span>
          </Link>

          <Link
            href={"/admin/settings"}
            onClick={() => setIsOpen(false)}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-white transition-colors duration-200"
          >
            <SettingsIcon />

            <span className="mr-auto text-base font-medium">
              Account Settings
            </span>
          </Link>
        </div>

        <hr className="border-gray-200 dark:border-gray-600" />

        <div className="p-2 text-base text-gray-700 dark:text-gray-300">
          <button
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-white transition-colors duration-200"
            onClick={() => setIsOpen(false)}
          >
            <LogOutIcon />

            <span className="text-base font-medium">Log out</span>
          </button>
        </div>
      </DropdownContent>
    </Dropdown>
  );
}
