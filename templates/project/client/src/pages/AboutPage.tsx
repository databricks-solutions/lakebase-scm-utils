// pages/ layer: route-level views. Pages compose components + hooks; a page never
// fetches directly. This is a STYLED, ROUTED example page , the pattern every
// feature page follows: it is wired into App.tsx's <Routes>, reachable from the
// navbar, and it CONSUMES the design vocabulary (.page/.card + the app icon) rather
// than rendering bare HTML. The kit's UX gate checks both (reachability + token
// consumption); model your feature pages on this, not on unstyled markup.
export function AboutPage() {
  return (
    <main className="page">
      <div className="page__header">
        <h1 className="page__title">
          <img className="page__title-icon" src="/favicon.svg" alt="" />
          <span>About {{PROJECT_NAME}}</span>
        </h1>
      </div>
      <div className="card">
        <p>
          This page is scaffolded to show the shape of a real feature screen:
          it is reachable from the navbar (wired into <code>App.tsx</code>), and
          it styles itself with the design vocabulary in{" "}
          <code>styles/global.css</code> (the <code>page</code> and{" "}
          <code>card</code> classes), which consume the tokens in{" "}
          <code>styles/theme.css</code>. Build your feature pages the same way.
        </p>
      </div>
    </main>
  );
}
