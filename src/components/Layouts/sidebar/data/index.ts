import * as Icons from "../icons";

export const NAV_DATA = [
  {
    label: "FESTIVAL MANAGEMENT",
    items: [
      {
        title: "Dashboard",
        icon: Icons.HomeIcon,
        items: [
          {
            title: "Overview",
            url: "/admin/dashboard",
          },
        ],
      },
      {
        title: "Event Calendar",
        url: "/admin/calendar",
        icon: Icons.Calendar,
        items: [],
      },
      {
        title: "Profile",
        url: "/admin/profile",
        icon: Icons.User,
        items: [],
      },
      {
        title: "Event Forms",
        icon: Icons.Alphabet,
        items: [
          {
            title: "Artist Registration",
            url: "/admin/forms/form-elements",
          },
          {
            title: "Vendor Applications",
            url: "/admin/forms/form-layout",
          },
        ],
      },
      {
        title: "Data Tables",
        url: "/admin/tables",
        icon: Icons.Table,
        items: [
          {
            title: "Attendee Lists",
            url: "/admin/tables",
          },
        ],
      },
      {
        title: "Settings",
        icon: Icons.Alphabet,
        items: [
          {
            title: "Festival Settings",
            url: "/admin/pages/settings",
          },
        ],
      },
    ],
  },
  {
    label: "ANALYTICS & TOOLS",
    items: [
      {
        title: "Analytics",
        icon: Icons.PieChart,
        items: [
          {
            title: "Ticket Sales",
            url: "/admin/charts/basic-chart",
          },
        ],
      },
      {
        title: "Components",
        icon: Icons.FourCircle,
        items: [
          {
            title: "Alerts",
            url: "/admin/ui-elements/alerts",
          },
          {
            title: "Buttons",
            url: "/admin/ui-elements/buttons",
          },
        ],
      },
      {
        title: "Authentication",
        icon: Icons.Authentication,
        items: [
          {
            title: "Admin Login",
            url: "/admin/auth/sign-in",
          },
        ],
      },
    ],
  },
];
