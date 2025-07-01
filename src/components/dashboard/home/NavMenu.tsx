import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

type Props = {
  isVisible: boolean;
};

export default function NavMenu({ isVisible }: Props) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute top-14 left-2 z-40 rounded-md bg-black p-4 shadow-md"
        >
          <ul>
            {[
              { label: 'Dashboard', href: '/dashboard' },
              { label: 'Profile', href: '/profile' },
              { label: 'Settings', href: '/settings' },
              { label: 'Logout', href: '/logout' },
            ].map(item => (
              <li key={item.href}>
                <Link href={item.href} className="block px-2 py-1">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
