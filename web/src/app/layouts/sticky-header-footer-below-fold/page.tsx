import { FakeParagraphs } from "@/src/components/helpers/FakeParagraphs";
import { Footer } from "@/src/components/layout/footer";
import { Paragraph } from "@/src/components/layout/paragraph";
import { StickyHeader } from "@/src/components/layout/sticky-header";

export default function Layout() {
  return (
    <>
      <StickyHeader className="p-2">Sticky header</StickyHeader>
      {/* For Footer to appear below the fold, the subtrahend
        inside calc() must be the same height as the header */}
      <main className="min-h-[calc(100vh-(2.5rem+1px))]">
        <Paragraph>Main content</Paragraph>
        <FakeParagraphs words={80} count={5} />
      </main>
      <Footer>Footer below fold</Footer>
    </>
  );
}
