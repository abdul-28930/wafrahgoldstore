import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Login |  RICH CHIDAMBARAM GOLD COVERING',
  description: 'Secure login page for  RICH CHIDAMBARAM GOLD COVERING store administrators',
  icons:{
    icon:"/Logo-3.png"
  }
};

export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
