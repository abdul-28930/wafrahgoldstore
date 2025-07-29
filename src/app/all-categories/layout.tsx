import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'All Categories | RICH CHIDAMBARAM GOLD COVERING ',
  description: 'Browse all categories of our exquisite gold jewelry collection at RICH CHIDAMBARAM GOLD COVERING.',
  icons: {
    icon: '/Logo-3.png', // Make sure this file is inside the public folder
  },
};

export default function AllCategoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
