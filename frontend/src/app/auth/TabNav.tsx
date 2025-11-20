"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface TabNavProps {
  tabs: { label: string; href: string }[];
}

export default function TabNav({ tabs }: TabNavProps) {
  const pathname = usePathname();

  return (
    <div className="flex py-3">
      <div className="flex h-12 flex-1 items-center justify-center rounded-xl bg-[#f0f2f4] p-0.5">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex h-full grow items-center justify-center overflow-hidden rounded-[10px] px-2 text-sm font-medium leading-normal transition-colors ${
                isActive
                  ? "bg-white text-[#111318] shadow-[0_0_4px_rgba(0,0,0,0.1)]"
                  : "text-[#616f89]"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
