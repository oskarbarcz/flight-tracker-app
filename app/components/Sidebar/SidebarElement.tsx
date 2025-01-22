"use client"

import {Link} from "react-router";
import React from "react";
import {IconType} from "react-icons";

type SidebarElementProps = {
  isCollapsed: boolean;
  label: string;
  href: string;
  icon: IconType;
}

export default function SidebarElement({isCollapsed, label, href, icon: Icon}: SidebarElementProps) {
  return (
    <Link to={href} replace={true}>
      <span className="my-1 flex w-full items-center rounded-lg bg-gray-100 p-2 text-gray-900 transition-colors duration-100 hover:bg-gray-200">
        <Icon size="24px" className="text-gray-500" />
        {!isCollapsed && <span className="mx-3">{label}</span>}
      </span>
    </Link>
  );
}
