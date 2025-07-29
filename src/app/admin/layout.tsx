import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard |  RICH CHIDAMBARAM GOLD COVERING',
  description: 'Admin dashboard for managing products and store content',
  icons:{
    icon:"/Logo-3.png", // Ensure this file is in the public folder
  }
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
