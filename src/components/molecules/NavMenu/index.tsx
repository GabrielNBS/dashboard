import Link from 'next/link';

type Props = {
  isVisible: boolean;
};

export default function NavMenu({ isVisible }: Props) {
  if (!isVisible) return null;

  return (
    <nav className="absolute top-14 left-2 rounded-md bg-black p-4 shadow-md">
      <ul>
        <li>
          <Link href="/dashboard" className="block px-2 py-1 hover:bg-gray-200">
            Dashboard
          </Link>
        </li>
        <li>
          <Link href="/profile" className="block px-2 py-1 hover:bg-gray-200">
            Profile
          </Link>
        </li>
        <li>
          <Link href="/settings" className="block px-2 py-1 hover:bg-gray-200">
            Settings
          </Link>
        </li>
        <li>
          <Link href="/logout" className="block px-2 py-1 hover:bg-gray-200">
            Logout
          </Link>
        </li>
      </ul>
    </nav>
  );
}
