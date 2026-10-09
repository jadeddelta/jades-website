"use client";

import { usePathname } from "next/navigation";
import TrianglePath from "../../_trail/TrianglePath";
import { pageConfigFor } from "../../_pages";

/**
 * trail behind current page, page type chosen by URL, @see pageConfigFor
 *
 * client component b/c page's config route builder is a function, and layout.tsx
 * (which is a server component) cannot pass a function to a client component.
 */
export default function PageTrail() {
    const pathname = usePathname();
    const page = pageConfigFor(pathname);
    if (!page) return null;

    return (
        <TrianglePath
            key={pathname}
            sectionIds={page.sectionIds}
            buildRoute={page.buildRoute}
            heroSection={page.heroSection}
        />
    );
}
