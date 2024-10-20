import { FakeParagraphs } from "@/src/components/helpers/FakeParagraphs";
import { FakeWordList } from "@/src/components/helpers/FakeWordList";
import { Footer } from "@/src/components/layout/footer";
import { Paragraph } from "@/src/components/layout/paragraph";
import { StickyHeader } from "@/src/components/layout/sticky-header";
import { StickySidebar } from "@/src/components/layout/sticky-sidebar";

export default function Layout() {
  return (
    <>
      <StickyHeader className="p-2">Sticky header</StickyHeader>
      {/* Remove `container` if you want full-page width layout */}
      <div className="container grid grid-cols-[240px_minmax(0,1fr)]">
        <StickySidebar className="top-[calc(2.5rem+1px)] h-[calc(100vh-(2.5rem+1px))]">
          <div>Sticky sidebar</div>
          <FakeWordList count={3} length={[4, 15]} />
        </StickySidebar>
        <main>
          <div className="min-h-[calc(100vh-2.5rem)]">
            <Paragraph>Main content</Paragraph>
            <FakeParagraphs words={80} count={5} />
          </div>
          <Footer>Footer below fold inside the main column</Footer>
        </main>
      </div>
    </>
  );
}
