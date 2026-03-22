import Link from 'next/link';
import { BUSINESS } from '@/lib/constants';

interface BreadcrumbItem {
  name: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  const schemaItems = items.map((item, index) => {
    const entry: Record<string, unknown> = {
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
    };
    if (item.href) {
      entry.item = item.href.startsWith('http')
        ? item.href
        : `${BUSINESS.domain}${item.href}`;
    }
    return entry;
  });

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: schemaItems,
  };

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* Visual breadcrumbs */}
      <nav
        aria-label="Breadcrumb"
        className="bg-brand-green pt-20 md:pt-24 pb-0"
      >
        <div className="container-custom pt-4 pb-2">
          {/* Desktop: show all items */}
          <ol className="hidden md:flex items-center gap-1.5 text-body-sm font-body">
            {items.map((item, index) => {
              const isLast = index === items.length - 1;
              return (
                <li key={index} className="flex items-center gap-1.5">
                  {index > 0 && (
                    <span className="text-gray-500" aria-hidden="true">›</span>
                  )}
                  {isLast || !item.href ? (
                    <span className="text-white font-semibold truncate max-w-[280px]">
                      {item.name}
                    </span>
                  ) : (
                    <Link
                      href={item.href}
                      className="text-gray-300 hover:text-brand-orange transition-colors"
                    >
                      {item.name}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>

          {/* Mobile: show back link to parent */}
          <div className="md:hidden">
            {items.length >= 2 && (
              <Link
                href={items[items.length - 2].href || '/'}
                className="text-gray-300 hover:text-brand-orange transition-colors text-body-sm font-body inline-flex items-center gap-1"
              >
                ← {items[items.length - 2].name}
              </Link>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
